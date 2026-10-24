/**
 * Sound Engine for Math Battle Arena
 * - SFX tetap memakai Web Audio API
 * - Menu BGM: Merry Christmas.mp3
 * - Battle BGM: BattleCry.mp3
 * - BGM tidak restart saat pindah menu yang sama atau saat toggle mute/unmute
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted = false;
  private isBgmMuted = false;
  private masterVolume = 0.6;

  private currentBgmMode: 'none' | 'menu' | 'battle' = 'none';
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmLoadToken = 0;

  constructor() {
    try {
      const savedMute = localStorage.getItem('mba_sfx_muted');
      if (savedMute !== null) this.isMuted = savedMute === 'true';

      const savedBgmMute = localStorage.getItem('mba_bgm_muted');
      if (savedBgmMute !== null) this.isBgmMuted = savedBgmMute === 'true';
    } catch {
      // ignore storage errors
    }
  }

  private initCtx(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  private normalizeBasePath(base: string): string {
    if (!base) return '/';
    return base.endsWith('/') ? base : `${base}/`;
  }

  private getPublicSoundUrl(fileName: string): string {
    const base = this.normalizeBasePath(import.meta.env.BASE_URL || '/');
    const encodedFileName = fileName
      .split('/')
      .map((part) => encodeURIComponent(part))
      .join('/');

    return `${base}sound/${encodedFileName}`;
  }

  private stopCurrentBgmAudio(resetTime: boolean = true) {
    if (!this.bgmAudio) return;

    try {
      this.bgmAudio.pause();
      if (resetTime) this.bgmAudio.currentTime = 0;
    } catch {
      // ignore
    }

    this.bgmAudio = null;
  }

  private pauseCurrentBgm() {
    if (!this.bgmAudio) return;

    try {
      this.bgmAudio.pause();
    } catch {
      // ignore
    }
  }

  private resumeCurrentBgm() {
    if (!this.bgmAudio || this.isBgmMuted) return;

    this.bgmAudio
      .play()
      .catch(() => {
        // ignore autoplay / browser resume issues
      });
  }

  private hasLiveCurrentBgm(): boolean {
    return !!this.bgmAudio && !this.bgmAudio.ended;
  }

  private playBgmFromFiles(fileNames: string[], volume: number, mode: 'menu' | 'battle') {
    const requestToken = ++this.bgmLoadToken;

    const tryFile = (index: number) => {
      if (requestToken !== this.bgmLoadToken) return;

      if (index >= fileNames.length) {
        console.warn('BGM gagal diputar. Semua nama file sudah dicoba.');
        return;
      }

      const fileName = fileNames[index];
      const audio = new Audio(this.getPublicSoundUrl(fileName));
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = volume;

      const onError = () => {
        if (requestToken !== this.bgmLoadToken) return;
        if (this.bgmAudio === audio) {
          this.bgmAudio = null;
        }
        tryFile(index + 1);
      };

      audio.addEventListener('error', onError, { once: true });

      this.bgmAudio = audio;
      this.currentBgmMode = mode;

      audio
        .play()
        .then(() => {
          if (requestToken !== this.bgmLoadToken) {
            try {
              audio.pause();
              audio.currentTime = 0;
            } catch {
              // ignore
            }
            return;
          }

          this.bgmAudio = audio;
          this.currentBgmMode = mode;
        })
        .catch(() => {
          onError();
        });
    };

    tryFile(0);
  }

  private ensureBgmRunning(mode: 'menu' | 'battle', fileNames: string[], volume: number) {
    if (this.isBgmMuted) {
      this.currentBgmMode = mode;
      return;
    }

    const sameMode = this.currentBgmMode === mode;
    const audioExists = this.hasLiveCurrentBgm();

    if (sameMode && audioExists) {
      if (this.bgmAudio?.paused) {
        this.resumeCurrentBgm();
      }
      return;
    }

    if (this.bgmAudio && this.currentBgmMode !== mode) {
      this.stopCurrentBgmAudio(true);
    }

    if (sameMode && this.bgmAudio && this.bgmAudio.ended) {
      this.stopCurrentBgmAudio(true);
    }

    this.playBgmFromFiles(fileNames, volume, mode);
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsBgmMuted(): boolean {
    return this.isBgmMuted;
  }

  public getBgmMode(): 'none' | 'menu' | 'battle' {
    return this.currentBgmMode;
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
      this.pauseCurrentBgm();
      return this.isBgmMuted;
    }

    if (this.currentBgmMode === 'menu') {
      this.startMenuBGM();
    } else if (this.currentBgmMode === 'battle') {
      this.startBattleBGM();
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

  public playCorrectAnswer() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startT = now + idx * 0.055;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startT);

      gain.gain.setValueAtTime(0.28 * this.masterVolume, startT);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startT);
      osc.stop(startT + 0.36);
    });
  }

  public playHeal() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];

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
      { f: 523, d: 0.15 },
      { f: 659, d: 0.15 },
      { f: 784, d: 0.15 },
      { f: 1046, d: 0.4 },
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

  // ================= MENU BGM =================
  public startMenuBGM() {
    this.ensureBgmRunning(
      'menu',
      [
        'Merry Christmas.mp3',
        'Marry Christmas.mp3',
        'MarryChrismast.mp3',
      ],
      0.45
    );
  }

  // ================= BATTLE BGM =================
  public startBattleBGM() {
    this.ensureBgmRunning('battle', ['BattleCry.mp3'], 0.45);
  }

  // Backward compatibility
  public startBGM() {
    this.startBattleBGM();
  }

  public setBgmMode(mode: 'menu' | 'battle') {
    if (mode === 'battle') {
      this.startBattleBGM();
    } else {
      this.startMenuBGM();
    }
  }

  public stopBGM() {
    this.currentBgmMode = 'none';
    this.bgmLoadToken++;
    this.stopCurrentBgmAudio(true);
  }
}

export const soundEngine = new SoundEngine();