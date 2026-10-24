import React, { useState, useEffect } from 'react';
import { Question, GradeLevel, QuestionCategory } from '../types/game';
import { generateDynamicQuestion, shuffleQuestionOptions } from '../data/questions';
import { getAllQuestions } from '../utils/gameStorage';
import { soundEngine } from '../utils/soundEngine';
import { UserCheck, CheckCircle2, XCircle, ArrowRight, RotateCcw, Lightbulb, HelpCircle } from 'lucide-react';

export const PracticeScreen: React.FC = () => {
  const [grade, setGrade] = useState<GradeLevel>('ALL');
  const [category, setCategory] = useState<string>('ALL');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    loadNextQuestion();
  }, [grade, category]);

  const loadNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);

    const all = getAllQuestions();
    let filtered = all.filter((q) => {
      if (grade !== 'ALL' && q.grade !== grade) return false;
      if (category !== 'ALL' && q.category !== category) return false;
      return true;
    });

    if (filtered.length > 0) {
      const randomQ = filtered[Math.floor(Math.random() * filtered.length)];
      setCurrentQuestion(shuffleQuestionOptions(randomQ));
    } else {
      const fallbackCat = (category !== 'ALL' ? category : 'OPERASI_BILANGAN') as QuestionCategory;
      const dyn = generateDynamicQuestion(grade, fallbackCat);
      setCurrentQuestion(shuffleQuestionOptions(dyn));
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !currentQuestion) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      soundEngine.playHit();
    } else {
      soundEngine.playWrong();
    }

    setStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] p-4 sm:p-8 max-w-4xl mx-auto flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            Mode Latihan Mandiri
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
            Latihan Soal Matematika
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Berlatih tanpa batasan waktu untuk memperdalam pemahaman konsep dan logika matematika SMP.
          </p>
        </div>

        {/* Score tracker */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
          <div className="text-slate-400">
            Skor: <span className="font-bold text-emerald-400 text-sm">{stats.correct}</span> / {stats.total}
          </div>
          {stats.total > 0 && (
            <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-slate-800">
              {Math.round((stats.correct / stats.total) * 100)}%
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 my-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Jenjang:</span>
          {(['ALL', 'VII', 'VIII', 'IX'] as GradeLevel[]).map((g) => (
            <button
              key={g}
              onClick={() => {
                soundEngine.playClick();
                setGrade(g);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                grade === g ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              {g === 'ALL' ? 'Semua' : `Kelas ${g}`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-slate-400 font-semibold">Kategori:</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-200"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="OPERASI_BILANGAN">Operasi Bilangan</option>
            <option value="LOGIKA_MATEMATIKA">Logika Matematika</option>
            <option value="PERBANDINGAN">Perbandingan</option>
          </select>
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="my-auto p-6 sm:p-8 rounded-2xl bg-slate-900/90 border-2 border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span className="text-amber-400 font-bold">{currentQuestion.topic}</span>
            <span className="font-mono">Kelas {currentQuestion.grade}</span>
          </div>

          <h3 className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
            {currentQuestion.prompt}
          </h3>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuestion.options.map((opt, idx) => {
              let btnStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
              if (isAnswered) {
                if (idx === currentQuestion.correctAnswerIndex) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                } else if (idx === selectedAnswer) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold';
                } else {
                  btnStyle = 'bg-slate-950/40 border-slate-900 opacity-50 text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-slate-800/80 text-xs font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswered && idx === currentQuestion.correctAnswerIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && idx === selectedAnswer && idx !== currentQuestion.correctAnswerIndex && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation reveal */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1 animate-fade-in">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Lightbulb className="w-4 h-4" />
                <span>Pembahasan Langkah:</span>
              </div>
              <p className="leading-relaxed pl-5">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer next button */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={() => setStats({ correct: 0, total: 0 })}
          className="text-xs text-slate-500 hover:text-slate-400 cursor-pointer"
        >
          Reset Skor Latihan
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            loadNextQuestion();
          }}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
        >
          <span>Soal Berikutnya</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
