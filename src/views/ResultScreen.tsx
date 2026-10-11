import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { TeamState, Question, BattleEventLog, MatchHistoryRecord } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { saveMatchRecord, downloadMatchCsv } from '../utils/gameStorage';
import { soundEngine } from '../utils/soundEngine';
import { Trophy, Award, Download, RotateCcw, Home, CheckCircle2, XCircle, Flame, Zap, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface ResultScreenProps {
  summary: {
    winner: 'A' | 'B';
    winnerTeamName: string;
    teamAState: TeamState;
    teamBState: TeamState;
    totalQuestions: number;
    eventLogs: BattleEventLog[];
    durationSeconds: number;
    reviewedQuestions: Array<{
      question: Question;
      answeredBy: string;
      team: 'A' | 'B';
      isCorrect: boolean;
      chosenAnswer: string;
    }>;
  };
  onRematch: () => void;
  onHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ summary, onRematch, onHome }) => {
  const { winner, winnerTeamName, teamAState, teamBState, totalQuestions, durationSeconds, reviewedQuestions } = summary;

  const [showReview, setShowReview] = useState(false);
  const [matchRecord, setMatchRecord] = useState<MatchHistoryRecord | null>(null);

  // Calculate Accuracies
  const totalA = teamAState.stats.correct + teamAState.stats.wrong;
  const accA = totalA > 0 ? Math.round((teamAState.stats.correct / totalA) * 100) : 0;

  const totalB = teamBState.stats.correct + teamBState.stats.wrong;
  const accB = totalB > 0 ? Math.round((teamBState.stats.correct / totalB) * 100) : 0;

  // Calculate MVP
  const findMvp = () => {
    let topPlayer = 'Semua Siswa';
    let topTeam = winnerTeamName;
    let maxDamage = 0;

    const winningTeamState = winner === 'A' ? teamAState : teamBState;
    Object.entries(winningTeamState.stats.playerScores).forEach(([name, score]) => {
      if (score.damage > maxDamage) {
        maxDamage = score.damage;
        topPlayer = name;
        topTeam = winningTeamState.name;
      }
    });

    return { player: topPlayer, team: topTeam, damage: maxDamage };
  };

  const mvp = findMvp();

  // Save to history and fire confetti on mount
  useEffect(() => {
    soundEngine.playVictory();

    // Fire Confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}

    const record: MatchHistoryRecord = {
      id: `match-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      arenaName: 'Arena Battle',
      grade: 'SMP',
      winnerTeam: winnerTeamName,
      winnerCharacter: CHARACTERS.find((c) => c.id === (winner === 'A' ? teamAState.characterId : teamBState.characterId))?.name || '',
      scoreA: teamAState.stats.correct,
      scoreB: teamBState.stats.correct,
      teamAName: teamAState.name,
      teamBName: teamBState.name,
      totalQuestions,
      accuracyA: accA,
      accuracyB: accB,
      mvpPlayer: mvp.player,
      mvpTeam: mvp.team,
      durationMinutes: Math.round(durationSeconds / 60) || 1,
    };

    setMatchRecord(record);
    saveMatchRecord(record);
  }, []);

  const handleDownloadCsv = () => {
    if (matchRecord) {
      soundEngine.playClick();
      downloadMatchCsv(matchRecord);
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] p-4 sm:p-8 max-w-5xl mx-auto flex flex-col justify-between">
      {/* ================= WINNER BANNER ================= */}
      <div className="text-center my-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
          <Trophy className="w-4 h-4 text-amber-400" />
          Pertandingan Selesai
        </div>

        <h1
          className="text-4xl sm:text-6xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 drop-shadow-[0_4px_16px_rgba(245,158,11,0.5)]"
          style={{ fontFamily: 'var(--font-cinzel), serif' }}
        >
          {winnerTeamName} Menang!
        </h1>

        <p className="text-sm text-slate-300 mt-2 font-medium">
          Selamat kepada seluruh anggota tim atas kemenangan dan dedikasi logika matematika yang luar biasa!
        </p>
      </div>

      {/* ================= MVP SPOTLIGHT ================= */}
      <div className="my-4 p-5 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-orange-950/70 border-2 border-amber-500/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
              Most Valuable Player (MVP Siswa)
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {mvp.player}
            </div>
            <div className="text-xs text-slate-400">
              {mvp.team} · Menghasilkan damage tertinggi ({mvp.damage} HP)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CharacterAvatar
            characterId={winner === 'A' ? teamAState.characterId : teamBState.characterId}
            team={winner}
            size="md"
            state="victory"
          />
        </div>
      </div>

      {/* ================= DETAILED TEAM STATS COMPARISON ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 font-mono">
        {/* TEAM A STATS */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-blue-500/30">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <span className="font-sans font-bold text-base text-blue-400">{teamAState.name}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              Akurasi: {accA}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Jawaban Benar / Salah</span>
              <span className="text-emerald-400 font-bold text-sm">{teamAState.stats.correct}</span>
              <span className="text-slate-500 text-xs"> / {teamAState.stats.wrong}</span>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Total Damage Diberikan</span>
              <span className="text-amber-400 font-bold text-sm">{teamAState.stats.totalDamageDealt} HP</span>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Critical / Ultimate</span>
              <span className="text-rose-400 font-bold text-sm">{teamAState.stats.criticalHits}</span>
              <span className="text-slate-500"> / {teamAState.stats.ultimateUses}</span>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Combo Terpanjang</span>
              <span className="text-cyan-400 font-bold text-sm">{teamAState.stats.maxCombo}x Hit</span>
            </div>
          </div>
        </div>

        {/* TEAM B STATS */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-red-500/30">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <span className="font-sans font-bold text-base text-red-400">{teamBState.name}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
              Akurasi: {accB}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Jawaban Benar / Salah</span>
              <span className="text-emerald-400 font-bold text-sm">{teamBState.stats.correct}</span>
              <span className="text-slate-500 text-xs"> / {teamBState.stats.wrong}</span>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Total Damage Diberikan</span>
              <span className="text-amber-400 font-bold text-sm">{teamBState.stats.totalDamageDealt} HP</span>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Critical / Ultimate</span>
              <span className="text-rose-400 font-bold text-sm">{teamBState.stats.criticalHits}</span>
              <span className="text-slate-500"> / {teamBState.stats.ultimateUses}</span>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Combo Terpanjang</span>
              <span className="text-cyan-400 font-bold text-sm">{teamBState.stats.maxCombo}x Hit</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= QUESTION REVIEW ACCORDION ================= */}
      <div className="my-3">
        <button
          onClick={() => setShowReview(!showReview)}
          className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-xs font-bold text-slate-300 transition-colors cursor-pointer"
        >
          <span>Review Pembahasan Soal Bersama Kelas ({reviewedQuestions.length} Soal Dimainkan)</span>
          {showReview ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-amber-400" />}
        </button>

        {showReview && (
          <div className="mt-3 space-y-3 max-h-80 overflow-y-auto pr-1">
            {reviewedQuestions.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs ${
                  item.isCorrect
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                    : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 font-sans">
                  <div className="flex items-center gap-2">
                    {item.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span className="font-bold text-white">Soal #{idx + 1}</span>
                    <span className="text-slate-400">({item.answeredBy} · {item.team === 'A' ? teamAState.name : teamBState.name})</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{item.question.topic}</span>
                </div>

                <div className="text-slate-100 font-semibold mb-1">
                  {item.question.prompt}
                </div>

                <div className="text-[11px] text-slate-400">
                  Jawaban siswa: <span className={item.isCorrect ? 'text-emerald-300 font-bold' : 'text-rose-300 line-through'}>{item.chosenAnswer}</span>
                  {!item.isCorrect && (
                    <span className="ml-2 text-emerald-300 font-bold">
                      · Jawaban benar: {item.question.options[item.question.correctAnswerIndex]}
                    </span>
                  )}
                </div>

                <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-[11px] text-slate-300 italic">
                  💡 Pembahasan: {item.question.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= ACTIONS BAR ================= */}
      <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={handleDownloadCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Unduh Laporan Match (CSV)</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEngine.playClick();
              onHome();
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Ke Beranda</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onRematch();
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Main Lagi (Rematch)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
