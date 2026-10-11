import React, { useState, useEffect } from 'react';
import { Question, GradeLevel, QuestionCategory, QuestionType, MatchHistoryRecord } from '../types/game';
import { getAllQuestions, saveCustomQuestion, updateQuestion, deleteQuestion, exportQuestionsToJson, importQuestionsFromJson, getMatchHistory, clearMatchHistory, downloadMatchCsv } from '../utils/gameStorage';
import { generateAiMathQuestions } from '../services/aiQuestionService';
import { soundEngine } from '../utils/soundEngine';
import { Settings, Plus, Sparkles, Download, Upload, Trash2, Pencil, BookOpen, Clock, Users, History, FileText, Check, AlertCircle, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const TeacherDashboardScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bank' | 'ai' | 'history' | 'settings'>('bank');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [matchHistory, setMatchHistory] = useState<MatchHistoryRecord[]>([]);

  // Filter state for Question Bank
  const [filterGrade, setFilterGrade] = useState<GradeLevel>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // New Question Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');
  const [newGrade, setNewGrade] = useState<GradeLevel>('VII');
  const [newCategory, setNewCategory] = useState<QuestionCategory>('OPERASI_BILANGAN');
  const [newTopic, setNewTopic] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrectIdx, setNewCorrectIdx] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');

  // Edit Question Form state
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [editGrade, setEditGrade] = useState<GradeLevel>('VII');
  const [editCategory, setEditCategory] = useState<QuestionCategory>('OPERASI_BILANGAN');
  const [editTopic, setEditTopic] = useState('');
  const [editOptions, setEditOptions] = useState<string[]>(['', '', '', '']);
  const [editCorrectIdx, setEditCorrectIdx] = useState(0);
  const [editExplanation, setEditExplanation] = useState('');
  const [editDifficulty, setEditDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY');

  // AI Generator state
  const [aiTopic, setAiTopic] = useState('Teorema Pythagoras dan Tripel Pythagoras');
  const [aiGrade, setAiGrade] = useState<GradeLevel>('VIII');
  const [aiCount, setAiCount] = useState(3);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiGeneratedList, setAiGeneratedList] = useState<Question[]>([]);
  const [aiMessage, setAiMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Import / Export state
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirmQuestionId, setDeleteConfirmQuestionId] = useState<string | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setQuestions(getAllQuestions());
    setMatchHistory(getMatchHistory());
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrompt.trim() || newOptions.some((o) => !o.trim())) {
      showToast('Mohon isi semua pertanyaan dan pilihan jawaban.', 'error');
      return;
    }

    const q: Question = {
      id: `custom-${Date.now()}`,
      grade: newGrade,
      category: newCategory,
      type: 'multiple_choice',
      prompt: newPrompt.trim(),
      options: newOptions.map((o) => o.trim()),
      correctAnswerIndex: newCorrectIdx,
      explanation: newExplanation.trim() || 'Pembahasan terverifikasi guru.',
      difficulty: 'MEDIUM',
      topic: newTopic.trim() || 'Matematika SMP',
    };

    saveCustomQuestion(q);
    soundEngine.playClick();
    setShowAddModal(false);
    showToast('Soal baru berhasil ditambahkan!');
    // Reset
    setNewPrompt('');
    setNewOptions(['', '', '', '']);
    setNewExplanation('');
    loadData();
  };

  const handleOpenEdit = (q: Question) => {
    soundEngine.playClick();
    setEditingQuestion(q);
    setEditPrompt(q.prompt);
    setEditGrade(q.grade);
    setEditCategory(q.category);
    setEditTopic(q.topic);
    const opts = q.options.length === 4 ? [...q.options] : [...q.options, '', '', ''].slice(0, 4);
    setEditOptions(opts);
    setEditCorrectIdx(q.correctAnswerIndex);
    setEditExplanation(q.explanation || '');
    setEditDifficulty(q.difficulty || 'EASY');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    if (!editPrompt.trim() || editOptions.some((o) => !o.trim())) {
      showToast('Mohon isi semua pertanyaan dan 4 pilihan jawaban.', 'error');
      return;
    }

    const updated: Question = {
      ...editingQuestion,
      prompt: editPrompt.trim(),
      grade: editGrade,
      category: editCategory,
      topic: editTopic.trim() || 'Matematika SMP',
      options: editOptions.map((o) => o.trim()),
      correctAnswerIndex: editCorrectIdx,
      explanation: editExplanation.trim() || 'Pembahasan terverifikasi guru.',
      difficulty: editDifficulty,
    };

    updateQuestion(updated);
    soundEngine.playVictory();
    setEditingQuestion(null);
    showToast('Perubahan soal berhasil disimpan!');
    loadData();
  };

  const handleDeleteQuestion = (id: string) => {
    soundEngine.playClick();
    setDeleteConfirmQuestionId(id);
  };

  const handleConfirmDeleteQuestion = () => {
    if (!deleteConfirmQuestionId) return;
    deleteQuestion(deleteConfirmQuestionId);
    soundEngine.playClick();
    showToast('Soal berhasil dihapus dari bank soal.');
    setDeleteConfirmQuestionId(null);
    loadData();
  };

  const handleExportJson = () => {
    soundEngine.playClick();
    const data = exportQuestionsToJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bank_soal_matematika_smp_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importQuestionsFromJson(content);
      if (res.success) {
        soundEngine.playVictory();
        setImportStatus(`Berhasil mengimpor ${res.count} soal baru!`);
        loadData();
      } else {
        soundEngine.playWrong();
        setImportStatus(`Gagal impor: ${res.error}`);
      }
    };
    reader.readAsText(file);
  };

  const handleRunAiGenerator = async () => {
    if (!aiTopic.trim()) return;
    setIsGeneratingAi(true);
    setAiMessage(null);
    soundEngine.playClick();

    try {
      const results = await generateAiMathQuestions(aiTopic.trim(), aiGrade, aiCount);
      setAiGeneratedList(results);
      setAiMessage({ text: `Berhasil membuat ${results.length} soal dengan Gemini AI!`, type: 'success' });
      soundEngine.playVictory();
    } catch (err: unknown) {
      setAiMessage({
        text: 'Gagal membuat soal via AI: Pastikan koneksi atau kuota API tersedia. Soal tetap dapat dibuat manual.',
        type: 'error',
      });
      soundEngine.playWrong();
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSaveAiQuestions = () => {
    aiGeneratedList.forEach((q) => saveCustomQuestion(q));
    soundEngine.playVictory();
    showToast(`Berhasil menyimpan ${aiGeneratedList.length} soal AI ke bank soal!`);
    setAiGeneratedList([]);
    loadData();
  };

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    if (filterGrade !== 'ALL' && q.grade !== filterGrade) return false;
    if (filterCategory !== 'ALL' && q.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] p-4 sm:p-8 max-w-6xl mx-auto flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Dashboard Guru
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pusat kendali bank soal, integrasi generator AI, dan manajemen riwayat pertandingan kelas.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('bank');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'bank' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bank Soal ({questions.length})
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('ai');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'ai' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            AI Generator
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('history');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'history' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Riwayat ({matchHistory.length})
          </button>
        </div>
      </div>

      {/* ================= TAB 1: BANK SOAL ================= */}
      {activeTab === 'bank' && (
        <div className="my-6 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Filter:</span>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value as GradeLevel)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200"
              >
                <option value="ALL">Semua Kelas</option>
                <option value="VII">Kelas VII</option>
                <option value="VIII">Kelas VIII</option>
                <option value="IX">Kelas IX</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="OPERASI_BILANGAN">Operasi Bilangan (50%)</option>
                <option value="LOGIKA_MATEMATIKA">Logika Matematika (30%)</option>
                <option value="PERBANDINGAN">Perbandingan (20%)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJson}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Ekspor JSON
              </button>

              <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                Impor JSON
                <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
              </label>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setShowAddModal(true);
                }}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Soal
              </button>
            </div>
          </div>

          {importStatus && (
            <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-700/60 text-xs text-blue-200">
              {importStatus}
            </div>
          )}

          {/* Question List */}
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-[11px] flex-wrap">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                      q.id.startsWith('custom')
                        ? 'bg-purple-950/40 text-purple-300 border-purple-500/30'
                        : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {q.id.startsWith('custom') ? 'Soal Kustom' : 'Soal Bawaan'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                      Kelas {q.grade}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-400">{q.topic}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 font-mono">[{q.category}]</span>
                  </div>

                  <p className="text-sm font-bold text-white">{q.prompt}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2 rounded-lg border text-center ${
                          oIdx === q.correctAnswerIndex
                            ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 font-bold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-400 italic pt-1">
                    💡 Pembahasan: {q.explanation}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-950/70 hover:bg-blue-900 border border-blue-600/70 text-blue-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                    title="Edit Soal Ini (Bawaan atau Kustom)"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Hapus Soal Ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: AI QUESTION GENERATOR ================= */}
      {activeTab === 'ai' && (
        <div className="my-6 space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              Generator Soal Cerdas Berbasis Gemini AI
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Buat Soal Matematika SMP Sesuai Kurikulum Otomatis
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl mb-6">
              Masukkan materi atau indikator pembelajaran yang sedang dibahas di kelas. AI akan menghasilkan soal lengkap dengan opsi jawaban dan pembahasan terperinci.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Materi / Topik Pembelajaran
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Misal: Aritmetika Sosial Diskon dan Bunga, atau Teorema Pythagoras"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-medium focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Jenjang Kelas SMP
                </label>
                <select
                  value={aiGrade}
                  onChange={(e) => setAiGrade(e.target.value as GradeLevel)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="VII">Kelas VII (Mudah)</option>
                  <option value="VIII">Kelas VIII (Menengah)</option>
                  <option value="IX">Kelas IX (Sulit)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Jumlah Soal:</span>
                {[3, 5, 8].map((c) => (
                  <button
                    key={c}
                    onClick={() => setAiCount(c)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${
                      aiCount === c ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <button
                disabled={isGeneratingAi}
                onClick={handleRunAiGenerator}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {isGeneratingAi ? 'Sedang Membuat Soal...' : 'Generate Soal dengan AI'}
              </button>
            </div>
          </div>

          {aiMessage && (
            <div
              className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
                aiMessage.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-700 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-700 text-rose-200'
              }`}
            >
              {aiMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{aiMessage.text}</span>
            </div>
          )}

          {/* AI Result Cards */}
          {aiGeneratedList.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  Preview Soal Hasil AI ({aiGeneratedList.length} Soal)
                </span>
                <button
                  onClick={handleSaveAiQuestions}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase"
                >
                  Simpan Semua ke Bank Soal
                </button>
              </div>

              <div className="space-y-3">
                {aiGeneratedList.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
                    <div className="text-xs font-bold text-amber-300">
                      Soal #{idx + 1} · {q.topic} (Kelas {q.grade})
                    </div>
                    <div className="text-sm font-semibold text-white">{q.prompt}</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded border text-center ${
                            oIdx === q.correctAnswerIndex
                              ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                    <div className="text-[11px] text-slate-400 italic">💡 {q.explanation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: MATCH HISTORY ================= */}
      {activeTab === 'history' && (
        <div className="my-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white">Riwayat Pertandingan Kelas</div>
              <div className="text-[11px] text-slate-400">Total {matchHistory.length} sesi pertempuran tersimpan</div>
            </div>

            {matchHistory.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Hapus seluruh riwayat pertandingan?')) {
                    clearMatchHistory();
                    loadData();
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-bold border border-red-800/60"
              >
                Bersihkan Riwayat
              </button>
            )}
          </div>

          {matchHistory.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
              Belum ada riwayat pertandingan. Mainkan mode Battle Team untuk mencatat sesi kelas!
            </div>
          ) : (
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              {matchHistory.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                      <span>Pemenang: {rec.winnerTeam}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 font-normal">{rec.date}</span>
                    </div>

                    <div className="text-xs text-slate-300 mt-1">
                      {rec.teamAName} (Akurasi {rec.accuracyA}%) vs {rec.teamBName} (Akurasi {rec.accuracyB}%)
                    </div>

                    <div className="text-[11px] text-slate-400 mt-0.5">
                      MVP: <span className="text-white font-semibold">{rec.mvpPlayer}</span> · Durasi: {rec.durationMinutes} menit · {rec.totalQuestions} Soal
                    </div>
                  </div>

                  <button
                    onClick={() => downloadMatchCsv(rec)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    Unduh CSV
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: TAMBAH SOAL MANUAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Tambah Soal Matematika Baru</h3>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Jenjang Kelas</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value as GradeLevel)}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="VII">Kelas VII</option>
                    <option value="VIII">Kelas VIII</option>
                    <option value="IX">Kelas IX</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Kategori Soal</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as QuestionCategory)}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="OPERASI_BILANGAN">Operasi Bilangan (50%)</option>
                    <option value="LOGIKA_MATEMATIKA">Logika Matematika (30%)</option>
                    <option value="PERBANDINGAN">Perbandingan (20%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Materi / Topik Soal</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Misal: Aljabar Dasar / Pythagoras"
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Pertanyaan</label>
                <textarea
                  rows={3}
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  placeholder="Tuliskan soal matematika..."
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-2">4 Opsi Jawaban (Pilih Opsi yang Benar)</label>
                <div className="space-y-2">
                  {newOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={newCorrectIdx === idx}
                        onChange={() => setNewCorrectIdx(idx)}
                        className="accent-amber-400"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const copy = [...newOptions];
                          copy[idx] = e.target.value;
                          setNewOptions(copy);
                        }}
                        placeholder={`Pilihan ${idx + 1}`}
                        className="flex-1 p-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Pembahasan / Solusi</label>
                <textarea
                  rows={2}
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Penjelasan langkah penyelesaian..."
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Simpan Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* EDIT QUESTION MODAL */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-blue-400" />
                <h3 className="text-lg font-bold text-white">
                  Edit Soal ({editingQuestion.id.startsWith('custom') ? 'Soal Kustom' : 'Soal Bawaan'})
                </h3>
              </div>
              <button
                onClick={() => setEditingQuestion(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Kelas</label>
                  <select
                    value={editGrade}
                    onChange={(e) => setEditGrade(e.target.value as GradeLevel)}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="VII">Kelas VII</option>
                    <option value="VIII">Kelas VIII</option>
                    <option value="IX">Kelas IX</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Kategori</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as QuestionCategory)}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="OPERASI_BILANGAN">Operasi Bilangan (+, −, ×, :)</option>
                    <option value="LOGIKA_MATEMATIKA">Logika Matematika (Pola/Cerita)</option>
                    <option value="PERBANDINGAN">Perbandingan Nilai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Materi / Topik Soal</label>
                <input
                  type="text"
                  value={editTopic}
                  onChange={(e) => setEditTopic(e.target.value)}
                  placeholder="Misal: Penjumlahan (+) / Teorema Pythagoras"
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Pertanyaan / Soal</label>
                <textarea
                  rows={3}
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="Tuliskan soal matematika..."
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-2 flex items-center justify-between">
                  <span>4 Opsi Jawaban</span>
                  <span className="text-emerald-400 font-normal">Pilih radio untuk Jawaban Benar</span>
                </label>
                <div className="space-y-2">
                  {editOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="editCorrectAnswer"
                        checked={editCorrectIdx === idx}
                        onChange={() => setEditCorrectIdx(idx)}
                        className="accent-emerald-400 w-4 h-4 cursor-pointer"
                        title="Tandai sebagai jawaban benar"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const copy = [...editOptions];
                          copy[idx] = e.target.value;
                          setEditOptions(copy);
                        }}
                        placeholder={`Pilihan ${idx + 1}`}
                        className={`flex-1 p-2 rounded-lg bg-slate-950 border text-white font-medium ${
                          editCorrectIdx === idx ? 'border-emerald-500 bg-emerald-950/20' : 'border-slate-700'
                        }`}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Pembahasan / Solusi Langkah Pengerjaan</label>
                <textarea
                  rows={2}
                  value={editExplanation}
                  onChange={(e) => setEditExplanation(e.target.value)}
                  placeholder="Penjelasan langkah penyelesaian..."
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer shadow-md"
                >
                  Simpan Perubahan Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Delete Question Confirmation Modal */}
      {deleteConfirmQuestionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-slate-900 border-2 border-red-500/60 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500 flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black uppercase tracking-wider text-white">
              Hapus Soal dari Bank Soal?
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus soal ini dari perputaran bank soal? Tindakan ini dapat dibatalkan dengan mereset bank soal di menu pengaturan jika diperlukan.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setDeleteConfirmQuestionId(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteQuestion}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Soal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-16 right-4 sm:right-8 z-50 px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 animate-bounce ${
          toastMessage.type === 'error'
            ? 'bg-slate-900 border-red-500 text-red-300'
            : 'bg-slate-900 border-emerald-500 text-emerald-300'
        }`}>
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
};
