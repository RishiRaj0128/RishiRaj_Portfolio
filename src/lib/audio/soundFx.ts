/**
 * SYNTHESIZED AUDIO FX — "UPLINK"
 * Pure Web Audio API procedural sound synthesis.
 * Zero external sound files needed.
 * Completely optional & toggleable by visitor (defaults to silent/polite).
 */

const NODE_FREQUENCIES: Record<string, number> = {
  ingress: 144,      // Warm sub-harmonic portal hum
  broker: 110,       // Dual heartbeat low hum (Raft quorum)
  payment: 165,      // Crisp transaction harmonic
  shortener: 220,    // High-speed clock tick tone
  status: 130,       // Nominal telemetry tone
  achievements: 180, // Ascending benchmark tone
  security: 92,      // Low-frequency firewall warning tone
  contact: 260,      // High-frequency radio uplink carrier
};

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;

  // Proximity ambient node oscillator
  private proximityOsc: OscillatorNode | null = null;
  private proximityGain: GainNode | null = null;
  private currentNodeId: string | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      if (this.engineGain) {
        this.engineGain.gain.setValueAtTime(0, this.ctx?.currentTime ?? 0);
      }
      if (this.proximityGain) {
        this.proximityGain.gain.setValueAtTime(0, this.ctx?.currentTime ?? 0);
      }
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Continuous gentle thruster hum (frequency rises slightly with speed)
   */
  public updateThruster(thrustLevel: number) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    if (!this.engineOsc) {
      try {
        this.engineOsc = this.ctx.createOscillator();
        this.engineGain = this.ctx.createGain();
        this.engineOsc.type = "sawtooth";
        this.engineOsc.frequency.setValueAtTime(45, this.ctx.currentTime);
        this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(140, this.ctx.currentTime);

        this.engineOsc.connect(filter);
        filter.connect(this.engineGain);
        this.engineGain.connect(this.ctx.destination);
        this.engineOsc.start();
      } catch {
        // Safe fail
      }
    }

    if (this.engineGain && this.engineOsc) {
      const now = this.ctx.currentTime;
      const targetGain = Math.min(0.07, thrustLevel * 0.07);
      const targetFreq = 45 + thrustLevel * 35;
      this.engineGain.gain.setTargetAtTime(targetGain, now, 0.05);
      this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.05);
    }
  }

  /**
   * Proximity-based ambient node audio layering:
   * Fades in a faint distinct ambient harmonic tone within 35m of any node.
   */
  public updateNodeProximity(nodeId: string | null, distance: number) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const maxProximityRange = 35; // meters

    if (!this.proximityOsc) {
      try {
        this.proximityOsc = this.ctx.createOscillator();
        this.proximityGain = this.ctx.createGain();
        this.proximityOsc.type = "sine";
        this.proximityOsc.frequency.setValueAtTime(120, this.ctx.currentTime);
        this.proximityGain.gain.setValueAtTime(0, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(180, this.ctx.currentTime);
        filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

        this.proximityOsc.connect(filter);
        filter.connect(this.proximityGain);
        this.proximityGain.connect(this.ctx.destination);
        this.proximityOsc.start();
      } catch {
        // Safe fail
      }
    }

    if (this.proximityGain && this.proximityOsc) {
      const now = this.ctx.currentTime;
      if (!nodeId || distance > maxProximityRange) {
        this.proximityGain.gain.setTargetAtTime(0, now, 0.1);
        return;
      }

      const freq = NODE_FREQUENCIES[nodeId] || 120;
      if (this.currentNodeId !== nodeId) {
        this.currentNodeId = nodeId;
        this.proximityOsc.frequency.setTargetAtTime(freq, now, 0.2);
      }

      // Proximity intensity curve (gentle, never piercing)
      const proximityFactor = Math.max(0, (maxProximityRange - distance) / maxProximityRange);
      const targetGain = proximityFactor * 0.04; // Max 4% volume
      this.proximityGain.gain.setTargetAtTime(targetGain, now, 0.08);
    }
  }

  /**
   * TCP Handshake Audio Sequence:
   * Step 1 (SYN): Short digital packet blip
   * Step 2 (SYN-ACK): Dual harmonic response
   * Step 3 (ACK): Confirmation chord
   */
  public playTcpHandshakeStep(step: 1 | 2 | 3) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      if (step === 1) {
        // SYN: Quick 480Hz probe blip
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(720, now + 0.06);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (step === 2) {
        // SYN-ACK: Two-tone 640Hz + 960Hz ping
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = "triangle";
        osc2.type = "sine";
        osc1.frequency.setValueAtTime(640, now);
        osc2.frequency.setValueAtTime(960, now);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.11);
        osc2.stop(now + 0.11);
      } else if (step === 3) {
        // ACK: Rich 520Hz -> 1040Hz chime
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = "sine";
        osc2.type = "triangle";
        osc1.frequency.setValueAtTime(520, now);
        osc1.frequency.exponentialRampToValueAtTime(1040, now + 0.15);
        osc2.frequency.setValueAtTime(780, now);
        osc2.frequency.exponentialRampToValueAtTime(1560, now + 0.18);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.35);
        osc2.stop(now + 0.35);
      }
    } catch {
      // Ignored
    }
  }

  public playDockChime() {
    this.playTcpHandshakeStep(3);
  }

  /**
   * Undock sound: soft downward low sweep
   */
  public playUndockSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Ignored
    }
  }

  /**
   * Console key sound
   */
  public playKeyClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(1200 + Math.random() * 200, now);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // Ignored
    }
  }
}

export const soundFx = new SoundSynthesizer();
