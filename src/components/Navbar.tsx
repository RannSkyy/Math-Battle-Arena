import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Maximize, Minimize, LogOut } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  inBattle?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, inBattle = false }) => {
  const [sfxMuted, setSfxMuted] = useState(soundEngine.getIsMuted());
  const [bgmMuted, setBgmMuted] = useState(soundEngine.getIsBgmMuted());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleToggleSfx = () => {
    const newState = soundEngine.toggleMute();
    setSfxMuted(newState);
  };

  const handleToggleBgm = () => {
    const newState = soundEngine.toggleBgmMute();
    setBgmMuted(newState);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <header className="relative z-30 flex items-center justify-between px-6 py-3 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      {/* Zone 1: Wordmark in modern display font */}
      <button
        onClick={() => {
          soundEngine.playClick();
          onNavigate('home');
        }}
        className="text-lg md:text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 hover:opacity-90 transition-opacity uppercase text-left whitespace-nowrap shrink-0 cursor-pointer"
        style={{ fontFamily: 'var(--font-heading), sans-serif' }}
      >
        Math Battle Arena
      </button>

      {/* Zone 2: Navigation links with stable width to prevent glitch */}
      <nav className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
        <button
          onClick={() => {
            soundEngine.playClick();
            onNavigate('setup');
          }}
          className={`px-3 py-1.5 rounded-lg border transition-all duration-150 whitespace-nowrap cursor-pointer ${
            currentView === 'setup' || currentView === 'battle'
              ? 'text-amber-400 bg-amber-500/15 border-amber-500/40 shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-900 border-transparent'
          }`}
        >
          Pertandingan
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            onNavigate('practice');
          }}
          className={`px-3 py-1.5 rounded-lg border transition-all duration-150 whitespace-nowrap cursor-pointer ${
            currentView === 'practice'
              ? 'text-amber-400 bg-amber-500/15 border-amber-500/40 shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-900 border-transparent'
          }`}
        >
          Latihan Mandiri
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            onNavigate('materi');
          }}
          className={`px-3 py-1.5 rounded-lg border transition-all duration-150 whitespace-nowrap cursor-pointer ${
            currentView === 'materi'
              ? 'text-amber-400 bg-amber-500/15 border-amber-500/40 shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-900 border-transparent'
          }`}
        >
          Materi SMP
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            onNavigate('dashboard');
          }}
          className={`px-3 py-1.5 rounded-lg border transition-all duration-150 whitespace-nowrap cursor-pointer ${
            currentView === 'dashboard'
              ? 'text-amber-400 bg-amber-500/15 border-amber-500/40 shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-900 border-transparent'
          }`}
        >
          Dashboard Guru
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            onNavigate('history');
          }}
          className={`px-3 py-1.5 rounded-lg border transition-all duration-150 whitespace-nowrap cursor-pointer ${
            currentView === 'history'
              ? 'text-amber-400 bg-amber-500/15 border-amber-500/40 shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-900 border-transparent'
          }`}
        >
          Riwayat & Hall of Fame
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions (Audio & Fullscreen / Battle controls) */}
      <div className="flex items-center gap-2">
        {/* SFX Toggle */}
        <button
          onClick={handleToggleSfx}
          title={sfxMuted ? 'Nyalakan Efek Suara' : 'Matikan Efek Suara'}
          className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors"
          aria-label="Toggle SFX"
        >
          {sfxMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* BGM Loop Toggle */}
        <button
          onClick={handleToggleBgm}
          title={bgmMuted ? 'Nyalakan Musik (BGM)' : 'Matikan Musik (BGM)'}
          className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors"
          aria-label="Toggle BGM"
        >
          <Music className={`w-4 h-4 ${bgmMuted ? 'text-slate-500' : 'text-amber-400 animate-pulse'}`} />
        </button>

        {/* Fullscreen Toggle for classroom projector */}
        <button
          onClick={handleToggleFullscreen}
          title="Layar Penuh (Cocok untuk Proyektor Kelas)"
          className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors hidden sm:block"
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-4 h-4 text-amber-400" /> : <Maximize className="w-4 h-4" />}
        </button>

        {inBattle && (
          <button
            onClick={() => {
              soundEngine.playClick();
              soundEngine.stopBGM();
              onNavigate('home');
            }}
            title="Keluar dari pertandingan ke menu utama"
            className="px-3 py-1.5 text-xs font-bold text-red-300 hover:text-white bg-red-950/80 hover:bg-red-900 rounded-lg border border-red-700/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Keluar Pertandingan</span>
          </button>
        )}
      </div>
    </header>
  );
};
