import React from 'react';
import { Swords, Play, Sparkles, BookOpen, ShieldAlert } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface SplashScreenProps {
  onStart: () => void;
  onOpenGuide: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart, onOpenGuide }) => {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 overflow-hidden text-center">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Hero Badge */}
      <div className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        Media Pembelajaran Matematika SMP Kelas VII · VIII · IX
      </div>

      {/* Main Game Title */}
      <div className="relative z-10 max-w-3xl mb-4">
        <h1
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-orange-600 drop-shadow-[0_4px_16px_rgba(245,158,11,0.4)]"
          style={{ fontFamily: 'var(--font-heading), sans-serif' }}
        >
          Math Battle Arena
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
          Pertarungan RPG antartim berbasis matematika. Jawab cepat, lancarkan kombo serangan, kalahkan HP lawan, dan pimpin timmu menuju kemenangan!
        </p>
      </div>

      {/* Feature Pillars */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl my-6 text-left">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="font-bold text-amber-400">100 HP Tim</div>
          <div className="text-slate-400 mt-0.5">Kerja sama seluruh anggota tim</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="font-bold text-rose-400">Combo & Critical</div>
          <div className="text-slate-400 mt-0.5">Damage berlipat ganda & efek guncang</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="font-bold text-sky-400">Ultimate Skill</div>
          <div className="text-slate-400 mt-0.5">Jawab 6 benar untuk jurus pamungkas</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="font-bold text-emerald-400">100% Offline</div>
          <div className="text-slate-400 mt-0.5">Cukup 1 laptop dan proyektor kelas</div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 mt-2">
        <button
          onClick={() => {
            soundEngine.playClick();
            soundEngine.startBGM();
            onStart();
          }}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-black text-sm tracking-widest uppercase text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 hover:from-amber-300 hover:to-orange-300 transition-all shadow-[0_0_24px_rgba(245,158,11,0.5)] hover:shadow-[0_0_36px_rgba(245,158,11,0.8)] hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Swords className="w-5 h-5 text-slate-950 transition-transform group-hover:rotate-12" />
          <span>Masuk Arena Pertandingan</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenGuide();
          }}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-colors cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-slate-400" />
          <span>Petunjuk & Aturan Main</span>
        </button>
      </div>

      {/* Footer Info */}
      <footer className="relative z-10 mt-12 text-xs text-slate-500">
        Dirancang khusus untuk pembelajaran interaktif kelas SMP (Kurikulum Merdeka / K13)
      </footer>
    </div>
  );
};
