import React, { useState, useEffect } from 'react';
import { MatchHistoryRecord } from '../types/game';
import { getMatchHistory, clearMatchHistory, deleteMatchRecord, deleteMultipleMatchRecords, downloadMatchCsv } from '../utils/gameStorage';
import { soundEngine } from '../utils/soundEngine';
import { Trophy, Award, Download, Trash2, ArrowLeft, Swords, CheckSquare, Square, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface HistoryScreenProps {
  onBack: () => void;
  onNewMatch: () => void;
}

type ConfirmModalState = {
  isOpen: boolean;
  type: 'single' | 'selected' | 'all';
  targetId?: string;
  count?: number;
};

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack, onNewMatch }) => {
  const [history, setHistory] = useState<MatchHistoryRecord[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getMatchHistory());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleToggleSelectionMode = () => {
    soundEngine.playClick();
    setIsSelectionMode((prev) => !prev);
    setSelectedIds([]);
  };

  const handleToggleSelect = (id: string) => {
    soundEngine.playClick();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    soundEngine.playClick();
    if (selectedIds.length === history.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(history.map((h) => h.id));
    }
  };

  // Open modal triggers
  const promptDeleteSingle = (id: string) => {
    soundEngine.playClick();
    setConfirmModal({
      isOpen: true,
      type: 'single',
      targetId: id,
    });
  };

  const promptDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    soundEngine.playClick();
    setConfirmModal({
      isOpen: true,
      type: 'selected',
      count: selectedIds.length,
    });
  };

  const promptClearAll = () => {
    soundEngine.playClick();
    setConfirmModal({
      isOpen: true,
      type: 'all',
      count: history.length,
    });
  };

  // Confirm delete execution (No native window.confirm!)
  const handleExecuteDelete = () => {
    if (!confirmModal) return;

    soundEngine.playClick();

    if (confirmModal.type === 'single' && confirmModal.targetId) {
      deleteMatchRecord(confirmModal.targetId);
      const updated = history.filter((h) => h.id !== confirmModal.targetId);
      setHistory(updated);
      setSelectedIds((prev) => prev.filter((item) => item !== confirmModal.targetId));
      if (updated.length === 0) setIsSelectionMode(false);
      showToast('1 catatan riwayat pertandingan berhasil dihapus.');
    } else if (confirmModal.type === 'selected') {
      deleteMultipleMatchRecords(selectedIds);
      const updated = history.filter((h) => !selectedIds.includes(h.id));
      setHistory(updated);
      showToast(`${selectedIds.length} catatan riwayat terpilih berhasil dihapus.`);
      setSelectedIds([]);
      if (updated.length === 0) setIsSelectionMode(false);
    } else if (confirmModal.type === 'all') {
      clearMatchHistory();
      setHistory([]);
      setSelectedIds([]);
      setIsSelectionMode(false);
      showToast('Semua catatan riwayat pertandingan berhasil dibersihkan.');
    }

    setConfirmModal(null);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] p-4 sm:p-8 max-w-5xl mx-auto flex flex-col justify-between">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 sm:right-8 z-50 px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500 text-emerald-300 text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Trophy className="w-3.5 h-3.5" />
              Catatan Pertandingan & MVP
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
              Riwayat Pertandingan
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Rekam jejak pertempuran antartim kelas dan siswa-siswa paling berprestasi.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {history.length > 0 && (
              <button
                onClick={handleToggleSelectionMode}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-all shadow-md ${
                  isSelectionMode
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-red-950/70 hover:bg-red-900 text-red-200 border-red-700/70'
                }`}
                title="Pilih pertandingan tertentu untuk dihapus"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isSelectionMode ? 'Selesai / Tutup Pilihan' : 'Pilih Riwayat untuk Dihapus'}</span>
              </button>
            )}

            <button
              onClick={() => {
                soundEngine.playClick();
                onNewMatch();
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              <Swords className="w-4 h-4" />
              <span>Mainkan Match Baru</span>
            </button>
          </div>
        </div>

        {/* Selection Mode Toolbar */}
        {isSelectionMode && history.length > 0 && (
          <div className="my-3 p-3.5 rounded-2xl bg-slate-900/95 border-2 border-amber-500/50 shadow-xl flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {selectedIds.length === history.length ? (
                  <>
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                    <span>Batal Pilih Semua</span>
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4 text-slate-400" />
                    <span>Pilih Semua ({history.length})</span>
                  </>
                )}
              </button>

              <span className="text-xs font-mono text-amber-300 font-bold">
                {selectedIds.length} dari {history.length} dipilih
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                disabled={selectedIds.length === 0}
                onClick={promptDeleteSelected}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus {selectedIds.length} Terpilih</span>
              </button>

              <button
                onClick={promptClearAll}
                className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/80 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Semua Riwayat</span>
              </button>
            </div>
          </div>
        )}

        {/* History List */}
        <div className="my-4 space-y-3">
          {history.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <div className="font-bold text-white text-base mb-1">Belum Ada Riwayat Pertandingan</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Mainkan mode Battle Team untuk mulai mencatat pertandingan antartim dan statistik MVP kelas!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((rec) => {
                const isSelected = selectedIds.includes(rec.id);
                return (
                  <div
                    key={rec.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md ${
                      isSelected
                        ? 'bg-amber-950/30 border-amber-500/80 ring-1 ring-amber-500/50'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Checkbox for selective delete */}
                      {isSelectionMode && (
                        <button
                          onClick={() => handleToggleSelect(rec.id)}
                          className="mt-1 p-1 rounded-lg text-slate-300 hover:text-white cursor-pointer transition-colors"
                          title={isSelected ? 'Batalkan pilihan' : 'Pilih catatan ini untuk dihapus'}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                          )}
                        </button>
                      )}

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs flex-wrap">
                          <span className="font-black text-amber-400 font-sans text-sm">
                            Pemenang: {rec.winnerTeam}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400 font-mono text-[11px]">{rec.date}</span>
                        </div>

                        <div className="text-xs text-slate-300 font-mono">
                          {rec.teamAName} ({rec.scoreA} Benar · Akurasi {rec.accuracyA}%) vs {rec.teamBName} ({rec.scoreB} Benar · Akurasi {rec.accuracyB}%)
                        </div>

                        <div className="text-xs text-slate-400 flex items-center gap-2 pt-1 font-sans flex-wrap">
                          <Award className="w-3.5 h-3.5 text-yellow-500" />
                          <span>MVP Siswa: <strong className="text-white">{rec.mvpPlayer}</strong></span>
                          <span className="text-slate-600">·</span>
                          <span>Durasi: {rec.durationMinutes} menit</span>
                          <span className="text-slate-600">·</span>
                          <span>{rec.totalQuestions} Soal</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          downloadMatchCsv(rec);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        <span>Unduh Laporan</span>
                      </button>

                      <button
                        onClick={() => promptDeleteSingle(rec.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-700/60 transition-colors cursor-pointer"
                        title="Hapus riwayat pertandingan ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Back button */}
      <div className="pt-4 border-t border-slate-800 flex justify-start">
        <button
          onClick={() => {
            soundEngine.playClick();
            onBack();
          }}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Menu Utama</span>
        </button>
      </div>

      {/* In-App Confirmation Modal (No native confirm dialogs!) */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-slate-900 border-2 border-red-500/60 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500 flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black uppercase tracking-wider text-white">
              Konfirmasi Hapus Riwayat
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {confirmModal.type === 'single' && 'Apakah Anda yakin ingin menghapus catatan riwayat pertandingan ini?'}
              {confirmModal.type === 'selected' && `Apakah Anda yakin ingin menghapus ${confirmModal.count} catatan riwayat terpilih?`}
              {confirmModal.type === 'all' && `Apakah Anda yakin ingin menghapus seluruh ${confirmModal.count} catatan riwayat pertandingan? Data tidak dapat dipulihkan.`}
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setConfirmModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                onClick={handleExecuteDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
