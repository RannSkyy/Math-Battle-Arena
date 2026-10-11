/**
 * Procedural Web Audio API Sound Engine for Math Battle Arena
 * Pure synthesized audio: 100% offline, zero network dependencies, zero broken audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmMuted: boolean = false;
  private masterVolume: number = 0.6;
  private bgmInterval: number | null = null;
  private bgmStep: number = 0;

  constructor() {
    // Check saved preferences
    try {
      const savedMute = localStorage.getItem('mba_sfx_muted');
      if (savedMute !== null) this.isMuted = savedMute === 'true';
      const savedBgmMute = localStorage.getItem('mba_bgm_muted');
      if (savedBgmMute !== null) this.isBgmMuted = savedBgmMute === 'true';
    } catch {
      // ignore
    }
  }

  private initCtx(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsBgmMuted(): boolean {
    return this.isBgmMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('mba_sfx_muted', String(this.isMuted));
    } catch {}
    return this.isMuted;
  }

  public toggleBgmMute(): boolean {
    this.isBgmMuted = !this.isBgmMuted;
    try {
      localStorage.setItem('mba_bgm_muted', String(this.isBgmMuted));
    } catch {}
    if (this.isBgmMuted) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
    return this.isBgmMuted;
  }

  public playClick() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15 * this.masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  public playTick(isUrgent: boolean = false) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = isUrgent ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(isUrgent ? 880 : 440, ctx.currentTime);

    gain.gain.setValueAtTime((isUrgent ? 0.2 : 0.08) * this.masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  }

  public playSlash() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    // Noise burst + sweeping sine
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.25 * this.masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.19);
  }

  public playMagic() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(440, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.25);
    osc2.frequency.setValueAtTime(660, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.2 * this.masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.26);
    osc2.stop(ctx.currentTime + 0.26);
  }

  public playHit() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3 * this.masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  }

  public playCritical() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    // Heavy impact explosion
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(260, now);
    osc1.frequency.exponentialRampToValueAtTime(30, now + 0.4);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(520, now);
    osc2.frequency.exponentialRampToValueAtTime(80, now + 0.35);

    gain.gain.setValueAtTime(0.45 * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.43);
    osc2.stop(now + 0.43);
  }

  public playUltimate() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Rising chords
    const notes = [330, 440, 554, 660, 880, 1108];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startT = now + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startT);

      gain.gain.setValueAtTime(0.25 * this.masterVolume, startT);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startT);
      osc.stop(startT + 0.42);
    });
  }

  public playHeal() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.2 * this.masterVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.36);
    });
  }

  public playCombo(comboCount: number) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const baseFreq = 440 + Math.min(comboCount * 70, 600);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.16);

    gain.gain.setValueAtTime(0.25 * this.masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  public playWrong() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.setValueAtTime(110, now + 0.12);

    gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  public playVictory() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = [
      { f: 523, d: 0.15 }, // C
      { f: 659, d: 0.15 }, // E
      { f: 784, d: 0.15 }, // G
      { f: 1046, d: 0.4 }, // High C
    ];

    let t = ctx.currentTime;
    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0.3 * this.masterVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + n.d);
      t += n.d;
    });
  }

  public playDefeat() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = [440, 392, 349, 293];
    let t = ctx.currentTime;
    notes.forEach((f) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.2 * this.masterVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.32);
      t += 0.22;
    });
  }

  // Epic Synthesized RPG Battle Soundtrack
  public startBGM() {
    if (this.isBgmMuted || this.bgmInterval !== null) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    // 16-step battle loop in D Minor (Tempo ~138 BPM, step = 115ms)
    // Scale frequencies (Hz):
    const D3 = 146.83, E3 = 164.81, F3 = 174.61, G3 = 196.00, A3 = 220.00, Bb3 = 233.08, C4 = 261.63;
    const D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, C5 = 523.25, D5 = 587.33;

    // Melody line (32 steps = 2 bars)
    const melodyPattern: (number | null)[] = [
      D4, null, D4, F4, G4, null, A4, null,
      Bb4, A4, G4, null, F4, G4, E4, null,
      D4, null, F4, null, A4, null, D5, null,
      C5, Bb4, A4, G4, F4, E4, D4, null
    ];

    // Driving Bass line (32 steps)
    const bassPattern: number[] = [
      D3, D3, D3, D3, G3, G3, A3, A3,
      Bb3, Bb3, A3, A3, F3, F3, E3, E3,
      D3, D3, F3, F3, G3, G3, A3, A3,
      Bb3, Bb3, C4, C4, D3, D3, A3, A3
    ];

    this.bgmStep = 0;
    this.bgmInterval = window.setInterval(() => {
      if (this.isBgmMuted) {
        this.stopBGM();
        return;
      }

      const step = this.bgmStep % 32;
      const now = ctx.currentTime;

      // 1. Play Bass note (every 8th/16th beat)
      const bassFreq = bassPattern[step];
      if (bassFreq) {
        this.playBattleBass(ctx, bassFreq, now);
      }

      // 2. Play Lead Melody
      const melodyFreq = melodyPattern[step];
      if (melodyFreq) {
        this.playBattleLead(ctx, melodyFreq, now);
      }

      // 3. Play Percussive Beat:
      // Kick on beats 0, 8, 16, 24
      if (step % 8 === 0) {
        this.playBattleKick(ctx, now);
      }
      // Snare on beats 4, 12, 20, 28
      else if (step % 8 === 4) {
        this.playBattleSnare(ctx, now);
      }
      // Hi-hat on every odd step
      else if (step % 2 === 1) {
        this.playBattleHiHat(ctx, now);
      }

      this.bgmStep++;
    }, 115);
  }

  private playBattleBass(ctx: AudioContext, freq: number, time: number) {
    if (this.isBgmMuted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.08 * this.masterVolume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.13);
  }

  private playBattleLead(ctx: AudioContext, freq: number, time: number) {
    if (this.isBgmMuted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.07 * this.masterVolume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.17);
  }

  private playBattleKick(ctx: AudioContext, time: number) {
    if (this.isBgmMuted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(35, time + 0.08);

    gain.gain.setValueAtTime(0.22 * this.masterVolume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.1);
  }

  private playBattleSnare(ctx: AudioContext, time: number) {
    if (this.isBgmMuted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, time);
    osc.frequency.exponentialRampToValueAtTime(60, time + 0.07);

    gain.gain.setValueAtTime(0.12 * this.masterVolume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.09);
  }

  private playBattleHiHat(ctx: AudioContext, time: number) {
    if (this.isBgmMuted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(8000, time);

    gain.gain.setValueAtTime(0.02 * this.masterVolume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.035);
  }

  public stopBGM() {
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const soundEngine = new SoundEngine();
