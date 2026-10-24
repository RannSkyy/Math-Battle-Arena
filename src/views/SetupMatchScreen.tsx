import React, { useState } from 'react';
import { MatchConfig, CharacterId, ArenaId, GradeLevel } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { ARENAS } from '../data/arenas';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { soundEngine } from '../utils/soundEngine';
import { Users, Timer, Sparkles, Swords, Shuffle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface SetupMatchScreenProps {
  onStartMatch: (config: MatchConfig) => void;
  onCancel: () => void;
}

export const SetupMatchScreen: React.FC<SetupMatchScreenProps> = ({ onStartMatch, onCancel }) => {
  // Team Names
  const [teamAName, setTeamAName] = useState('Tim Garuda');
  const [teamBName, setTeamBName] = useState('Tim Rajawali');

  // Characters
  const [teamAChar, setTeamAChar] = useState<CharacterId>('knight');
  const [teamBChar, setTeamBChar] = useState<CharacterId>('mage');

  // Player count & rosters
  const [playerCount, setPlayerCount] = useState<number>(10);
  const [teamAPlayersText, setTeamAPlayersText] = useState('');
  const [teamBPlayersText, setTeamBPlayersText] = useState('');
  const [showRosterModal, setShowRosterModal] = useState(false);

  // Match options
  const [arenaId, setArenaId] = useState<ArenaId>('castle');
  const [grade, setGrade] = useState<GradeLevel>('VII');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD' | 'ADAPTIVE'>('EASY');
  const [timerSeconds, setTimerSeconds] = useState<8 | 10 | 15 | 20>(10);
  const [enableBuffs, setEnableBuffs] = useState(true);
  const [enableUltimates, setEnableUltimates] = useState(true);

  // Auto-generate players list
  const getProcessedPlayers = (customText: string, prefix: string): string[] => {
    const lines = customText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const result: string[] = [];
    for (let i = 0; i < playerCount; i++) {
      if (lines[i]) {
        result.push(lines[i]);
      } else {
        result.push(`${prefix} ${i + 1}`);
      }
    }
    return result;
  };

  const handleRandomizeTeams = () => {
    soundEngine.playClick();
    const charIds = CHARACTERS.map((c) => c.id);
    const randomA = charIds[Math.floor(Math.random() * charIds.length)];
    let randomB = charIds[Math.floor(Math.random() * charIds.length)];
    if (randomB === randomA) {
      randomB = charIds[(charIds.indexOf(randomA) + 1) % charIds.length];
    }
    setTeamAChar(randomA);
    setTeamBChar(randomB);

    const arenaList = ARENAS.map((a) => a.id);
    setArenaId(arenaList[Math.floor(Math.random() * arenaList.length)]);
  };

  const handleStart = () => {
    soundEngine.playClick();
    const teamAPlayers = getProcessedPlayers(teamAPlayersText, 'Pemain A');
    const teamBPlayers = getProcessedPlayers(teamBPlayersText, 'Pemain B');

    const config: MatchConfig = {
      teamAName: teamAName.trim() || 'Tim A',
      teamBName: teamBName.trim() || 'Tim B',
      teamACharacter: teamAChar,
      teamBCharacter: teamBChar,
      teamAPlayers,
      teamBPlayers,
      arenaId,
      grade,
      difficulty,
      timerSeconds,
      enableBuffs,
      enableUltimates,
    };

    onStartMatch(config);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] p-4 md:p-8 max-w-6xl mx-auto flex flex-col justify-between">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
            Konfigurasi Pertandingan
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Atur parameter tim, pilih karakter, arena, dan materi matematika sebelum pertandingan dimulai.
          </p>
        </div>

        <button
          onClick={handleRandomizeTeams}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold border border-slate-700 transition-colors cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5 text-amber-400" />
          Acak Karakter & Arena
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
        {/* LEFT COLUMN: TEAM A & TEAM B SETUP (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* TEAM A CARD */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-600 text-white uppercase tracking-wider">
                TIM A (KIRI)
              </span>
              <span className="text-xs text-slate-400 font-medium">100 HP Pertahanan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Nama Tim A
                </label>
                <input
                  type="text"
                  value={teamAName}
                  onChange={(e) => setTeamAName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-blue-500"
                  placeholder="Contoh: Tim Garuda"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Pilih Karakter
                </label>
                <select
                  value={teamAChar}
                  onChange={(e) => setTeamAChar(e.target.value as CharacterId)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-hidden focus:border-blue-500"
                >
                  {CHARACTERS.map((char) => (
                    <option key={char.id} value={char.id}>
                      {char.name} ({char.attackName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Character Preview Strip */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-4">
              <div className="w-32 shrink-0 flex flex-col items-center justify-center text-center">
                <CharacterAvatar characterId={teamAChar} team="A" size="md" />
              </div>
              <div className="text-xs space-y-1.5 flex-1 min-w-0">
                <div className="font-extrabold text-blue-300 text-sm">
                  {CHARACTERS.find((c) => c.id === teamAChar)?.title}
                </div>
                <div className="text-slate-300 text-xs">
                  <span className="text-slate-400 font-medium">Senjata:</span>{' '}
                  <span className="text-slate-100 font-semibold">{CHARACTERS.find((c) => c.id === teamAChar)?.weapon}</span>
                </div>
                <div className="text-slate-300 text-xs flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950/70 border border-blue-500/40 text-[11px] font-semibold text-blue-200">
                    <span className="text-blue-400 font-bold">Jurus:</span> {CHARACTERS.find((c) => c.id === teamAChar)?.attackName}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/70 border border-amber-500/40 text-[11px] font-bold text-amber-300">
                    <span className="text-amber-400 font-extrabold">Ulti:</span> {CHARACTERS.find((c) => c.id === teamAChar)?.ultimateName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* TEAM B CARD */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/60 to-slate-900 border border-red-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-600 text-white uppercase tracking-wider">
                TIM B (KANAN)
              </span>
              <span className="text-xs text-slate-400 font-medium">100 HP Pertahanan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Nama Tim B
                </label>
                <input
                  type="text"
                  value={teamBName}
                  onChange={(e) => setTeamBName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-red-500"
                  placeholder="Contoh: Tim Rajawali"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Pilih Karakter
                </label>
                <select
                  value={teamBChar}
                  onChange={(e) => setTeamBChar(e.target.value as CharacterId)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-hidden focus:border-red-500"
                >
                  {CHARACTERS.map((char) => (
                    <option key={char.id} value={char.id}>
                      {char.name} ({char.attackName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Character Preview Strip */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-4">
              <div className="w-32 shrink-0 flex flex-col items-center justify-center text-center">
                <CharacterAvatar characterId={teamBChar} team="B" size="md" />
              </div>
              <div className="text-xs space-y-1.5 flex-1 min-w-0">
                <div className="font-extrabold text-rose-300 text-sm">
                  {CHARACTERS.find((c) => c.id === teamBChar)?.title}
                </div>
                <div className="text-slate-300 text-xs">
                  <span className="text-slate-400 font-medium">Senjata:</span>{' '}
                  <span className="text-slate-100 font-semibold">{CHARACTERS.find((c) => c.id === teamBChar)?.weapon}</span>
                </div>
                <div className="text-slate-300 text-xs flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-950/70 border border-rose-500/40 text-[11px] font-semibold text-rose-200">
                    <span className="text-rose-400 font-bold">Jurus:</span> {CHARACTERS.find((c) => c.id === teamBChar)?.attackName}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/70 border border-amber-500/40 text-[11px] font-bold text-amber-300">
                    <span className="text-amber-400 font-extrabold">Ulti:</span> {CHARACTERS.find((c) => c.id === teamBChar)?.ultimateName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PLAYER ROSTER SECTION */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-white">
                  Jumlah Siswa: {playerCount} Siswa per Tim ({playerCount * 2} Siswa Total)
                </div>
                <div className="text-[11px] text-slate-400">
                  Siswa bergantian menjawab soal otomatis per nomor
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="range"
                min="5"
                max="20"
                value={playerCount}
                onChange={(e) => setPlayerCount(Number(e.target.value))}
                className="w-24 accent-amber-400"
              />
              <button
                onClick={() => setShowRosterModal(true)}
                className="px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
              >
                Atur Daftar Nama
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ARENA, GRADE, TIMER & SETTINGS (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* ARENA SELECT */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Pilih Arena Pertarungan (9 Arena Lengkap)
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {ARENAS.map((ar) => {
                const selected = ar.id === arenaId;
                return (
                  <button
                    key={ar.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setArenaId(ar.id);
                    }}
                    className={`relative p-1.5 rounded-xl text-left border transition-all cursor-pointer overflow-hidden group ${
                      selected
                        ? 'border-amber-400 bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.4)] ring-2 ring-amber-400/50'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    {ar.bgImagePath && (
                      <div className="w-full h-12 rounded-lg overflow-hidden mb-1 relative">
                        <img
                          src={ar.bgImagePath}
                          alt={ar.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-slate-950/20" />
                      </div>
                    )}
                    <div className="text-[11px] font-bold text-white truncate">{ar.name}</div>
                    <div className="text-[9px] text-slate-400 truncate">{ar.subtitle}</div>
                  </button>
                );
              })}
            </div>

            {/* Selected Arena Banner Preview */}
            {ARENAS.find((a) => a.id === arenaId) && (
              <div className="mt-3 relative h-16 rounded-xl overflow-hidden border border-amber-500/40">
                <img
                  src={ARENAS.find((a) => a.id === arenaId)?.bgImagePath}
                  alt={ARENAS.find((a) => a.id === arenaId)?.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter brightness-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex items-end p-2 justify-between">
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Arena Terpilih</span>
                    <span className="text-xs font-black text-white">{ARENAS.find((a) => a.id === arenaId)?.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-300 italic">{ARENAS.find((a) => a.id === arenaId)?.subtitle}</span>
                </div>
              </div>
            )}
          </div>

          {/* GRADE & DIFFICULTY */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Jenjang Kelas SMP
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['VII', 'VIII', 'IX', 'ALL'] as GradeLevel[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      soundEngine.playClick();
                      setGrade(g);
                      if (g === 'VII') setDifficulty('EASY');
                      if (g === 'VIII') setDifficulty('MEDIUM');
                      if (g === 'IX') setDifficulty('HARD');
                    }}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      grade === g
                        ? 'border-amber-400 bg-amber-500 text-slate-950 shadow-md'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {g === 'ALL' ? 'Campuran' : `Kelas ${g}`}
                  </button>
                ))}
              </div>
            </div>

            {/* TIMER SELECTION: 8, 10, 15, 20 DETIK */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center justify-between">
                <span>Timer Per Soal</span>
                <span className="text-amber-400 font-mono font-normal">{timerSeconds} Detik</span>
              </label>
              <div className="grid grid-cols-4 gap-2 font-mono">
                {([8, 10, 15, 20] as const).map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      soundEngine.playClick();
                      setTimerSeconds(sec);
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      timerSeconds === sec
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-sm'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {sec} dtk
                  </button>
                ))}
              </div>
            </div>

            {/* BUFF & ULTIMATE TOGGLES */}
            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableBuffs}
                  onChange={(e) => setEnableBuffs(e.target.checked)}
                  className="accent-amber-400 rounded"
                />
                <span className="text-slate-300 font-medium">Sistem Buff</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableUltimates}
                  onChange={(e) => setEnableUltimates(e.target.checked)}
                  className="accent-amber-400 rounded"
                />
                <span className="text-slate-300 font-medium">Jurus Ultimate</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={() => {
            soundEngine.playClick();
            onCancel();
          }}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Kembali ke Menu
        </button>

        <button
          onClick={handleStart}
          className="group px-8 py-3.5 rounded-xl font-black text-sm tracking-widest uppercase text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-[0_0_24px_rgba(245,158,11,0.4)] hover:shadow-[0_0_36px_rgba(245,158,11,0.7)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Swords className="w-5 h-5 text-slate-950 transition-transform group-hover:scale-110" />
          <span>Mulai Pertandingan!</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* ROSTER MODAL */}
      {showRosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              Daftar Nama Siswa (1 Baris = 1 Siswa)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Anda dapat menyalin (paste) daftar absen kelas di sini. Jika baris dikosongkan, nama akan otomatis terisi "Pemain 1..N".
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-blue-400 block mb-1">
                  Nama Siswa {teamAName} ({playerCount} Siswa)
                </label>
                <textarea
                  rows={8}
                  value={teamAPlayersText}
                  onChange={(e) => setTeamAPlayersText(e.target.value)}
                  placeholder={`Budi\nSiti\nAndi\nDewi\n...`}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-red-400 block mb-1">
                  Nama Siswa {teamBName} ({playerCount} Siswa)
                </label>
                <textarea
                  rows={8}
                  value={teamBPlayersText}
                  onChange={(e) => setTeamBPlayersText(e.target.value)}
                  placeholder={`Rian\nNisa\nFajar\nLina\n...`}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-hidden focus:border-red-500"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowRosterModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400"
              >
                Simpan & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
