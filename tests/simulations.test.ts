import assert from "node:assert/strict";
import test from "node:test";
import { MessageBrokerClusterEngine } from "../src/lib/simulations/leaderElection";
import { SagaPaymentEngine } from "../src/lib/simulations/sagaFsm";
import { Base62ShortenerEngine } from "../src/lib/simulations/base62Generator";

test("Engine 1: Message Broker - Leader Election & Quorum Replication", () => {
  const broker = new MessageBrokerClusterEngine();
  const initialState = broker.getState();

  assert.equal(initialState.nodes.length, 5, "Cluster must have 5 broker nodes");
  assert.equal(initialState.leaderId, "b-1", "Initial leader should be b-1");
  assert.equal(initialState.currentTerm, 1, "Initial term should be 1");

  // Produce 1st message
  const produceRes1 = broker.produceMessage("prod-alpha", 0, "order.created:1001", 0);
  assert.equal(produceRes1.success, true, "Message 1 should commit successfully");
  assert.equal(produceRes1.duplicate, false, "Message 1 should not be duplicate");

  // Duplicate retry with same sequence number
  const dupRes = broker.produceMessage("prod-alpha", 0, "order.created:1001", 0);
  assert.equal(dupRes.success, true, "Duplicate retry should succeed gracefully");
  assert.equal(dupRes.duplicate, true, "Duplicate retry must be flagged as duplicate");
  assert.equal(broker.getState().committedMessages.length, 1, "No extra message should be committed");

  // Produce 2nd message
  const produceRes2 = broker.produceMessage("prod-alpha", 1, "order.payment_authorized:1001", 0);
  assert.equal(produceRes2.success, true, "Message 2 should commit successfully");
  assert.equal(broker.getState().committedMessages.length, 2, "2 messages committed");

  // Trigger Leader Election
  broker.completeElection(745);
  const stateAfterElection = broker.getState();

  assert.equal(stateAfterElection.currentTerm, 2, "Term should increment to 2");
  assert.ok(stateAfterElection.leaderId, "New leader must be elected");
  assert.equal(stateAfterElection.acknowledgedLossCount, 0, "Acknowledged message loss must be 0");
  assert.equal(stateAfterElection.committedMessages.length, 2, "All committed messages must survive");

  // Test Consumer Group Rebalancing
  const rebalanceRes = broker.rebalanceConsumerGroup(3);
  assert.ok(rebalanceRes.rebalanceDurationMs < 200, "Rebalance must complete in <200ms");
  const activeConsumers = broker.getState().consumerGroup.filter((c) => c.status === "ACTIVE");
  assert.equal(activeConsumers.length, 3, "Active consumers count should match 3");
});

test("Engine 2: Saga Workflow & Transaction FSM - Predicates, FSM & Ledger Drift", async () => {
  const saga = new SagaPaymentEngine();

  // Test 8-predicate evaluation
  const predResult = saga.evaluateValidationPredicates({
    userId: "usr_881",
    amount: 85.0,
    seats: ["A1", "A2"],
    userBalance: 150.0,
    sessionAgeSec: 30,
    isDuplicateKey: false,
    theaterOnline: true,
    fraudScore: 0.02,
  });

  assert.equal(predResult.allValid, true, "All 8 predicates must pass for valid input");
  assert.equal(predResult.checks.length, 8, "Must evaluate exactly 8 domain checks");

  // Test FSM illegal transition rejection
  const illegalTransition = saga.transitionState("INITIALIZED", "CONFIRMED");
  assert.equal(illegalTransition.allowed, false, "INITIALIZED -> CONFIRMED directly must be rejected");
  assert.ok(illegalTransition.reason?.includes("ILLEGAL_STATE_TRANSITION"));

  // Execute normal transaction
  const happyTx = await saga.executeBookingSaga({
    idempotencyKey: "idem_key_happy_1",
    userId: "usr_881",
    movieTitle: "Interstellar",
    seats: ["C4", "C5"],
    amount: 40.0,
  });

  assert.equal(happyTx.transaction.state, "CONFIRMED", "Happy path should confirm");

  // Test Idempotent Replay
  const replayTx = await saga.executeBookingSaga({
    idempotencyKey: "idem_key_happy_1",
    userId: "usr_881",
    movieTitle: "Interstellar",
    seats: ["C4", "C5"],
    amount: 40.0,
  });

  assert.equal(replayTx.transaction.id, happyTx.transaction.id, "Replay must return identical tx ID");
  assert.ok(replayTx.message.includes("IDEMPOTENT_REPLAY_DETECTED"));

  // Test Gateway Timeout with Saga Compensation
  const compTx = await saga.executeBookingSaga({
    idempotencyKey: "idem_key_timeout_1",
    userId: "usr_992",
    movieTitle: "Dune Part Two",
    seats: ["D10"],
    amount: 25.0,
    injectFailure: "GATEWAY_TIMEOUT",
  });

  assert.equal(compTx.transaction.state, "COMPENSATED", "Timed out transaction must compensate");
  assert.ok(
    compTx.transaction.compensationDurationMs && compTx.transaction.compensationDurationMs < 450,
    "Compensation must finish in ~300ms"
  );

  // Test Double-Entry Ledger Net Drift
  const drift = saga.computeLedgerDrift();
  assert.equal(drift.netDrift, 0.0, "Double-entry net drift must be exactly 0.00");
  assert.equal(drift.totalDebit, drift.totalCredit, "Total Debit must equal Total Credit");
});

test("Engine 3: Base62 Shortener - Snowflake IDs & Zero Collisions", () => {
  const shortener = new Base62ShortenerEngine(42);

  // Test URL shortening
  const rec1 = shortener.shortenUrl("https://distributed-systems.engineering/specs/raft");
  assert.ok(rec1.shortCode.length >= 6, "Base62 shortcode must be at least 6 characters");
  assert.equal(rec1.originalUrl, "https://distributed-systems.engineering/specs/raft");

  // Test click resolution & analytics
  const clickRes = shortener.resolveAndTrackClick(rec1.shortCode, "Mozilla/5.0 Chrome/120");
  assert.equal(clickRes.found, true, "Short code must resolve");
  assert.ok(clickRes.latencyMs > 0, "Latency must be tracked");
  assert.equal(rec1.clickCount, 1, "Click counter must increment");

  // Test bot filtering
  const botClick = shortener.resolveAndTrackClick(rec1.shortCode, "Googlebot/2.1");
  assert.equal(botClick.isBot, true, "Crawler user agent must be flagged as bot");
  assert.equal(rec1.botFilteredCount, 1, "Bot filtered counter must increment");

  // Test Collision Resistance across 2,000 rapid keys
  const colTest = shortener.runCollisionTest(2000);
  assert.equal(colTest.collisions, 0, "Must have zero collisions across 2,000 rapid Snowflake keys");
});

test("World Topology: Node Coordinate Mapping & Conduit Connectivity", async () => {
  const { NETWORK_NODES, NETWORK_CONDUITS, WORLD_BOUNDS } = await import("../src/lib/world/worldTopology");

  assert.equal(NETWORK_NODES.length, 8, "World must contain exactly 8 defined network nodes");
  
  const nodeIds = new Set(NETWORK_NODES.map((n) => n.id));
  assert.ok(nodeIds.has("ingress"), "Must have Ingress node");
  assert.ok(nodeIds.has("status"), "Must have Status node");
  assert.ok(nodeIds.has("broker"), "Must have Broker flagship node");
  assert.ok(nodeIds.has("payment"), "Must have Payment flagship node");
  assert.ok(nodeIds.has("shortener"), "Must have Shortener flagship node");
  assert.ok(nodeIds.has("achievements"), "Must have Achievements node");
  assert.ok(nodeIds.has("security"), "Must have Security node");
  assert.ok(nodeIds.has("contact"), "Must have Contact egress node");

  // Verify all positions are within max radius
  NETWORK_NODES.forEach((node) => {
    const dist = Math.sqrt(node.position[0] ** 2 + node.position[2] ** 2);
    assert.ok(dist <= WORLD_BOUNDS.maxRadius, `Node ${node.id} must be within bounds (${dist} <= ${WORLD_BOUNDS.maxRadius})`);
    assert.ok(node.dockingRadius >= 6.0, `Node ${node.id} docking radius must be at least 6.0 units`);
  });

  // Verify conduits connect existing nodes
  assert.ok(NETWORK_CONDUITS.length >= 8, "Must have at least 8 conduit links");
  NETWORK_CONDUITS.forEach((conduit) => {
    assert.ok(nodeIds.has(conduit.fromId), `Conduit fromId ${conduit.fromId} must exist`);
    assert.ok(nodeIds.has(conduit.toId), `Conduit toId ${conduit.toId} must exist`);
  });
});

test("Engine 5: Break-It Demo - Computed Metrics & Zero Acknowledged Loss", async () => {
  const { runBreakItSimulation } = await import("../src/lib/simulations/breakItSimulation");
  
  const result = await runBreakItSimulation(740);

  // Reliable system assertions
  assert.equal(result.reliable.ordersLost, 0, "Reliable system must compute 0 orders lost");
  assert.equal(result.reliable.duplicateCharges, 0, "Reliable system must compute 0 duplicate charges");
  assert.ok(result.reliable.recoveryTimeMs >= 500 && result.reliable.recoveryTimeMs <= 1000, "Recovery time should be within 500-1000ms window");
  assert.equal(result.reliable.survivingOrders, 3, "All 3 committed orders must survive in cluster log");
  assert.equal(result.reliable.compensationCompleted, true, "Timed-out order must be compensated");

  // Fragile system comparison
  assert.ok(result.fragile.ordersLost > 0, "Fragile system must show positive orders lost");
  assert.ok(result.fragile.duplicateCharges > 0, "Fragile system must show duplicate charges");
});

