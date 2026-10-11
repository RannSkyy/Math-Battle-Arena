import React, { useState } from 'react';
import { Swords, UserCheck, BookOpen, Settings, Trophy, HelpCircle, Shield, Sparkles, Flame, Play, X, Zap } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface HomeScreenProps {
  onSelectMode: (mode: 'setup' | 'practice' | 'materi' | 'dashboard' | 'history') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectMode }) => {
  const [showRulesModal, setShowRulesModal] = useState(false);

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] flex flex-col justify-between p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Pilih Mode Permainan
        </div>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wide text-slate-100" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
          Arena Pertempuran
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Siapkan timmu, pilih karakter legendaris, dan buktikan ketangkasan logika matematika di hadapan seluruh kelas!
        </p>
      </div>

      {/* Main Mode Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
        {/* Card 1: BATTLE TEAM (PRIMARY HERO) */}
        <div className="relative group rounded-2xl p-6 bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/50 hover:border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_0_45px_rgba(245,158,11,0.3)] transition-all flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Swords className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded bg-amber-500 text-slate-950 tracking-wider">
                Mode Utama
              </span>
            </div>
            
            <h3 className="text-2xl font-black text-white tracking-wide mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              Battle Team (Kelas)
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Dua tim (5–20 siswa per tim) bertarung secara bergantian dalam 1 layar. Siswa bergantian menjawab soal untuk menghabisi 100 HP lawan!
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-amber-300/80 font-medium">
              <span>• 100 HP Tim</span>
              <span>• 8 Karakter RPG</span>
              <span>• 9 Arena</span>
              <span>• Combo & Ultimate</span>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectMode('setup');
            }}
            className="mt-6 w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Mulai Pertandingan
          </button>
        </div>

        {/* Card 2: LATIHAN MANDIRI (PRACTICE) */}
        <div className="relative group rounded-2xl p-6 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <UserCheck className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                Latihan Santai
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white tracking-wide mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              Latihan Mandiri
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Uji kemampuan tanpa batasan timer atau tekanan HP tim. Dilengkapi pembahasan lengkap step-by-step untuk setiap soal matematika SMP.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-blue-300/80 font-medium">
              <span>• Kelas VII, VIII, IX</span>
              <span>• Pembahasan Instan</span>
              <span>• Bebas Timer</span>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectMode('practice');
            }}
            className="mt-6 w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Masuk Latihan
          </button>
        </div>

        {/* Card 3: DASHBOARD GURU & MATERI */}
        <div className="relative group rounded-2xl p-6 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Settings className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                Alat Pengajar
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white tracking-wide mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              Dashboard Guru
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Kelola bank soal, buat soal kustom atau generate soal dengan AI Gemini, unduh laporan pertandingan kelas (CSV), dan atur konfigurasi game.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-emerald-300/80 font-medium">
              <span>• Bank Soal Kustom</span>
              <span>• AI Question Generator</span>
              <span>• Laporan Hasil Belajar</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                onSelectMode('dashboard');
              }}
              className="py-2.5 px-3 rounded-xl font-bold text-[11px] tracking-wider uppercase text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                onSelectMode('materi');
              }}
              className="py-2.5 px-3 rounded-xl font-bold text-[11px] tracking-wider uppercase text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              Materi SMP
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Row: Quick Actions & Rules Guide */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowRulesModal(true);
            }}
            className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Lihat Panduan & Aturan Damage Battle</span>
          </button>
          <span className="text-slate-600">·</span>
          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectMode('history');
            }}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white font-semibold cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>Riwayat Pertandingan & MVP</span>
          </button>
        </div>

        <div className="text-slate-500 text-xs">
          Ideal dimainkan di laptop guru dengan proyeksi ke layar kelas.
        </div>
      </div>

      {/* RULES & DAMAGE SYSTEM MODAL */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setShowRulesModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black text-amber-400 uppercase tracking-wide mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              Aturan & Mekanisme Pertempuran
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-1 text-amber-400">1. Konsep Adu Cepat (Speed Duel)</h4>
                <p>
                  Kedua tim (Tim Kiri vs Tim Kanan) bertanding serentak untuk setiap soal matematika! Masing-masing tim memiliki 4 tombol jawaban di sisi layar (Tombol Kiri: 1, 2, 3, 4 / Q, W, E, R dan Tombol Kanan: 7, 8, 9, 0 / U, I, O, P). Tim yang menjawab <strong>paling cepat dan benar</strong> akan melancarkan serangan damage ke HP lawan!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-2 text-rose-400">2. Sistem Damage RPG</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Jawaban Benar</div>
                    <div className="text-amber-400 font-bold text-sm">5 HP Damage</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Critical Hit (~10%)</div>
                    <div className="text-rose-400 font-bold text-sm">10 HP Damage</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Ultimate Skill (6 Soal)</div>
                    <div className="text-yellow-400 font-bold text-sm">12 HP Damage</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Combo x2</div>
                    <div className="text-cyan-400 font-bold text-sm">6 HP Damage</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Combo x3 / x5</div>
                    <div className="text-purple-400 font-bold text-sm">8 / 10 HP Damage</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Heal Buff</div>
                    <div className="text-emerald-400 font-bold text-sm">+5 HP Tim</div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-1 text-sky-400">3. Pergantian Pemain & Timer</h4>
                <p>
                  Setelah satu soal selesai (benar atau salah), pemain berikutnya otomatis maju sesuai daftar giliran. Jika waktu timer habis (5s/8s/10s/15s), jawaban dianggap salah dan combo terhenti.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-1 text-purple-400">4. Kemenangan</h4>
                <p>
                  Pertandingan berakhir saat HP salah satu tim menjadi 0. Tim pemenang diumumkan dengan analisis statistik akurasi dan penghargaan Siswa MVP!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
            >
              Mengerti, Tutup Panduan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
