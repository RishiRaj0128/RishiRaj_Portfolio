/**
 * SHARED SIMULATION ENGINE SINGLETONS
 * Maintains state across 3D node dockings and telemetry updates.
 */

import { MessageBrokerClusterEngine } from "./leaderElection";
import { SagaPaymentEngine } from "./sagaFsm";
import { Base62ShortenerEngine } from "./base62Generator";

export const sharedBrokerEngine = new MessageBrokerClusterEngine();
export const sharedSagaEngine = new SagaPaymentEngine();
export const sharedShortenerEngine = new Base62ShortenerEngine(42);

// Seed initial shortened URL for instant interaction
sharedShortenerEngine.shortenUrl("https://github.com/RishiRaj0128");
