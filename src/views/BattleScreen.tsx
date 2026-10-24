import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MatchConfig, TeamState, Question, BuffType, DebuffType, BattleEventLog } from '../types/game';
import { ArenaBackground } from '../components/ArenaBackground';
import { HealthBar } from '../components/HealthBar';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { CHARACTERS } from '../data/characters';
import { ARENAS } from '../data/arenas';
import { generateDynamicQuestion, shuffleQuestionOptions } from '../data/questions';
import { getAllQuestions } from '../utils/gameStorage';
import { soundEngine } from '../utils/soundEngine';
import { Timer, Zap, Sparkles, Pause, Play, Award, Flame, RefreshCw, ArrowRight, Swords, LogOut, Maximize, Minimize, Volume2, VolumeX, Music } from 'lucide-react';

interface BattleScreenProps {
  config: MatchConfig;
  onMatchFinish: (matchSummary: {
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
  }) => void;
  onExit: () => void;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({ config, onMatchFinish, onExit }) => {
  // Arena info
  const arena = ARENAS.find((a) => a.id === config.arenaId) || ARENAS[0];

  // Team States
  const [teamA, setTeamA] = useState<TeamState>({
    id: 'A',
    name: config.teamAName,
    characterId: config.teamACharacter,
    hp: 100,
    maxHp: 100,
    ultimateGauge: 0,
    combo: 0,
    activeBuffs: [],
    activeDebuffs: [],
    players: config.teamAPlayers,
    currentTurnIndex: 0,
    stats: {
      correct: 0,
      wrong: 0,
      totalDamageDealt: 0,
      criticalHits: 0,
      ultimateUses: 0,
      maxCombo: 0,
      answerTimes: [],
      playerScores: {},
    },
  });

  const [teamB, setTeamB] = useState<TeamState>({
    id: 'B',
    name: config.teamBName,
    characterId: config.teamBCharacter,
    hp: 100,
    maxHp: 100,
    ultimateGauge: 0,
    combo: 0,
    activeBuffs: [],
    activeDebuffs: [],
    players: config.teamBPlayers,
    currentTurnIndex: 0,
    stats: {
      correct: 0,
      wrong: 0,
      totalDamageDealt: 0,
      criticalHits: 0,
      ultimateUses: 0,
      maxCombo: 0,
      answerTimes: [],
      playerScores: {},
    },
  });

  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [eventLogs, setEventLogs] = useState<BattleEventLog[]>([]);
  const [reviewedQuestions, setReviewedQuestions] = useState<Array<{
    question: Question;
    answeredBy: string;
    team: 'A' | 'B';
    isCorrect: boolean;
    chosenAnswer: string;
  }>>([]);

  // Question Pool & Current Question
  const [questionPool, setQuestionPool] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Lock status per team for current round (if a team answered wrongly)
  const [teamALocked, setTeamALocked] = useState<boolean>(false);
  const [teamBLocked, setTeamBLocked] = useState<boolean>(false);
  const [teamAChosen, setTeamAChosen] = useState<number | null>(null);
  const [teamBChosen, setTeamBChosen] = useState<number | null>(null);

  // Timer
  const [timeLeft, setTimeLeft] = useState<number>(config.timerSeconds);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const questionStartTimeRef = useRef<number>(Date.now());
  const matchStartTimeRef = useRef<number>(Date.now());

  // Battle Animation & Screen Shake States
  const [animStateA, setAnimStateA] = useState<'idle' | 'attack' | 'hit' | 'ultimate' | 'victory' | 'defeat'>('idle');
  const [animStateB, setAnimStateB] = useState<'idle' | 'attack' | 'hit' | 'ultimate' | 'victory' | 'defeat'>('idle');
  const [screenShake, setScreenShake] = useState<'none' | 'mild' | 'intense'>('none');
  const [floatingDamage, setFloatingDamage] = useState<{
    target: 'A' | 'B';
    amount: number | string;
    isCritical?: boolean;
    isUltimate?: boolean;
    isMiss?: boolean;
  } | null>(null);
  const [announcementText, setAnnouncementText] = useState<string>('');
  const [isRoundResolved, setIsRoundResolved] = useState<boolean>(false);

  // Fullscreen & Audio controls right in the Battle HUD
  const [isFullscreen, setIsFullscreen] = useState<boolean>(
    typeof document !== 'undefined' ? Boolean(document.fullscreenElement) : false
  );
  const [isBgmMuted, setIsBgmMuted] = useState<boolean>(soundEngine.getIsBgmMuted());

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

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

  const handleToggleBgm = () => {
    const muted = soundEngine.toggleBgmMute();
    setIsBgmMuted(muted);
  };

  // Initialize Question Pool with randomized option positions (so correct answer is never always A)
  useEffect(() => {
    const all = getAllQuestions();
    let filtered = all.filter((q) => {
      if (config.grade === 'ALL') return true;
      return q.grade === config.grade;
    });

    if (filtered.length === 0) filtered = all;

    const shuffled = [...filtered].sort(() => Math.random() - 0.5).map(shuffleQuestionOptions);
    setQuestionPool(shuffled);
    setCurrentQuestion(shuffled[0] || shuffleQuestionOptions(generateDynamicQuestion(config.grade, 'OPERASI_BILANGAN')));
    setTimeLeft(config.timerSeconds);
    questionStartTimeRef.current = Date.now();

    // Start epic battle music automatically
    soundEngine.startBGM();

    return () => {
      soundEngine.stopBGM();
    };
  }, [config.grade, config.timerSeconds]);

  // Pick Next Question
  const pickNextQuestion = useCallback(() => {
    setQuestionPool((prevPool) => {
      let pool = prevPool.slice(1);
      if (pool.length < 3) {
        const dyn = generateDynamicQuestion(
          config.grade,
          Math.random() > 0.5 ? 'OPERASI_BILANGAN' : 'LOGIKA_MATEMATIKA'
        );
        pool.push(shuffleQuestionOptions(dyn));
      }
      setCurrentQuestion(pool[0]);
      return pool;
    });

    setTimeLeft(config.timerSeconds);
    questionStartTimeRef.current = Date.now();
    setTeamALocked(false);
    setTeamBLocked(false);
    setTeamAChosen(null);
    setTeamBChosen(null);
    setIsRoundResolved(false);
  }, [config.grade, config.timerSeconds]);

  // Timer Tick
  useEffect(() => {
    if (isPaused || isRoundResolved || !currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        if (prev <= 4) {
          soundEngine.playTick(true);
        } else {
          soundEngine.playTick(false);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isRoundResolved, currentQuestion]);

  // Handle Timeout (Neither team answered correctly in time)
  const handleTimeOut = () => {
    if (isRoundResolved || !currentQuestion) return;
    setIsRoundResolved(true);

    soundEngine.playWrong();
    const studentA = teamA.players[teamA.currentTurnIndex] || 'Pemain A';
    const studentB = teamB.players[teamB.currentTurnIndex] || 'Pemain B';

    setReviewedQuestions((prev) => [
      ...prev,
      {
        question: currentQuestion,
        answeredBy: `${studentA} & ${studentB}`,
        team: 'A',
        isCorrect: false,
        chosenAnswer: 'Waktu Habis (Kedua tim tidak menjawab)',
      },
    ]);

    setAnnouncementText('WAKTU HABIS! Kedua tim terlambat menjawab.');
    setFloatingDamage({ target: 'A', amount: 'TIMEOUT!', isMiss: true });

    // Rotate students
    setTeamA((prev) => ({
      ...prev,
      combo: 0,
      currentTurnIndex: (prev.currentTurnIndex + 1) % prev.players.length,
      stats: { ...prev.stats, wrong: prev.stats.wrong + 1 },
    }));

    setTeamB((prev) => ({
      ...prev,
      combo: 0,
      currentTurnIndex: (prev.currentTurnIndex + 1) % prev.players.length,
      stats: { ...prev.stats, wrong: prev.stats.wrong + 1 },
    }));

    setTimeout(() => {
      setFloatingDamage(null);
      setAnnouncementText('');
      setRoundNumber((r) => r + 1);
      pickNextQuestion();
    }, 1600);
  };

  // Speed Duel: A team buzzes in an answer
  const handleSpeedAnswer = (teamId: 'A' | 'B', optionIndex: number) => {
    if (isRoundResolved || !currentQuestion) return;

    // Check if team is already locked out this round
    if (teamId === 'A' && teamALocked) return;
    if (teamId === 'B' && teamBLocked) return;

    const isCorrect = optionIndex === currentQuestion.correctAnswerIndex;
    const answerDuration = (Date.now() - questionStartTimeRef.current) / 1000;

    const isTeamA = teamId === 'A';
    const activeTeamObj = isTeamA ? teamA : teamB;
    const opponentTeamObj = isTeamA ? teamB : teamA;
    const currentStudent = activeTeamObj.players[activeTeamObj.currentTurnIndex] || `Pemain ${teamId}`;
    const chosenAnswer = currentQuestion.options[optionIndex] || `Opsi ${optionIndex + 1}`;

    if (isTeamA) setTeamAChosen(optionIndex);
    else setTeamBChosen(optionIndex);

    if (isCorrect) {
      // WINNER OF THIS QUESTION!
      setIsRoundResolved(true);

      const newCombo = activeTeamObj.combo + 1;
      let damage = 5;

      // Combo damage
      if (newCombo >= 5) damage = 10;
      else if (newCombo >= 3) damage = 8;
      else if (newCombo >= 2) damage = 6;

      // Active Buffs
      if (activeTeamObj.activeBuffs.includes('ATTACK_UP')) damage += 2;
      if (activeTeamObj.activeBuffs.includes('DOUBLE_DAMAGE')) damage *= 2;

      // Critical Hit
      const critChance = activeTeamObj.activeBuffs.includes('CRITICAL_BOOST') ? 0.4 : 0.12;
      const isCritical = Math.random() < critChance;
      if (isCritical) damage = Math.max(damage, 10);

      // Ultimate Skill
      const isUltimate = config.enableUltimates && activeTeamObj.ultimateGauge >= 5;
      if (isUltimate) damage = 12;

      // Shield Check
      const defenderHasShield = opponentTeamObj.activeBuffs.includes('SHIELD');
      if (defenderHasShield) damage = 0;

      // Visuals & Sound
      const charData = CHARACTERS.find((c) => c.id === activeTeamObj.characterId);
      const attackName = charData?.attackName || 'Serangan Cepat';
      const ultiName = charData?.ultimateName || 'Jurus Pamungkas';

      if (isUltimate) {
        soundEngine.playUltimate();
        soundEngine.playCorrectAnswer();
        setScreenShake('intense');
        setAnnouncementText(`JURUS PAMUNGKAS: ${ultiName}! ${currentStudent} (${activeTeamObj.name})!`);
      } else if (isCritical) {
        soundEngine.playCritical();
        soundEngine.playCorrectAnswer();
        setScreenShake('intense');
        setAnnouncementText(`SERANGAN KRITIS! ${currentStudent} mencetak ${damage} DMG!`);
      } else {
        soundEngine.playCorrectAnswer();
        soundEngine.playHit();
        soundEngine.playCombo(newCombo);
        setScreenShake('mild');
        setAnnouncementText(`${currentStudent} (${activeTeamObj.name}) lancarkan ${attackName}!`);
      }

      if (isTeamA) {
        setAnimStateA(isUltimate ? 'ultimate' : 'attack');
        setAnimStateB(defenderHasShield ? 'idle' : 'hit');
      } else {
        setAnimStateB(isUltimate ? 'ultimate' : 'attack');
        setAnimStateA(defenderHasShield ? 'idle' : 'hit');
      }

      setFloatingDamage({
        target: isTeamA ? 'B' : 'A',
        amount: defenderHasShield ? 'SHIELD BLOCKED!' : `-${damage} HP`,
        isCritical,
        isUltimate,
      });

      // Record Review
      setReviewedQuestions((prev) => [
        ...prev,
        {
          question: currentQuestion,
          answeredBy: currentStudent,
          team: teamId,
          isCorrect: true,
          chosenAnswer,
        },
      ]);

      const updatedOpponentHp = Math.max(0, opponentTeamObj.hp - damage);

      // Random buff trigger
      let earnedBuff: BuffType | null = null;
      if (config.enableBuffs && Math.random() < 0.22) {
        const buffs: BuffType[] = ['ATTACK_UP', 'CRITICAL_BOOST', 'SHIELD', 'HEAL', 'COMBO_SAVER', 'DOUBLE_DAMAGE'];
        earnedBuff = buffs[Math.floor(Math.random() * buffs.length)];
      }

      let healedHp = activeTeamObj.hp;
      if (earnedBuff === 'HEAL') {
        healedHp = Math.min(100, activeTeamObj.hp + 5);
        soundEngine.playHeal();
      }

      // State Updates
      const updateWinner = (prev: TeamState): TeamState => {
        let newActiveBuffs: BuffType[] = prev.activeBuffs.filter((b) => b !== 'DOUBLE_DAMAGE');
        if (earnedBuff && earnedBuff !== 'HEAL' && !newActiveBuffs.includes(earnedBuff)) {
          newActiveBuffs.push(earnedBuff);
        }

        const currentScore = prev.stats.playerScores[currentStudent] || { correct: 0, damage: 0 };

        return {
          ...prev,
          hp: healedHp,
          ultimateGauge: isUltimate ? 0 : Math.min(6, prev.ultimateGauge + 1),
          combo: newCombo,
          activeBuffs: newActiveBuffs,
          currentTurnIndex: (prev.currentTurnIndex + 1) % prev.players.length,
          stats: {
            ...prev.stats,
            correct: prev.stats.correct + 1,
            totalDamageDealt: prev.stats.totalDamageDealt + damage,
            criticalHits: prev.stats.criticalHits + (isCritical ? 1 : 0),
            ultimateUses: prev.stats.ultimateUses + (isUltimate ? 1 : 0),
            maxCombo: Math.max(prev.stats.maxCombo, newCombo),
            answerTimes: [...prev.stats.answerTimes, answerDuration],
            playerScores: {
              ...prev.stats.playerScores,
              [currentStudent]: {
                correct: currentScore.correct + 1,
                damage: currentScore.damage + damage,
              },
            },
          },
        };
      };

      const updateLoser = (prev: TeamState): TeamState => {
        let newBuffs = [...prev.activeBuffs];
        if (defenderHasShield) newBuffs = newBuffs.filter((b) => b !== 'SHIELD');

        return {
          ...prev,
          hp: updatedOpponentHp,
          activeBuffs: newBuffs,
          currentTurnIndex: (prev.currentTurnIndex + 1) % prev.players.length,
        };
      };

      if (isTeamA) {
        setTeamA(updateWinner);
        setTeamB(updateLoser);
      } else {
        setTeamB(updateWinner);
        setTeamA(updateLoser);
      }

      // Check Victory Condition
      if (updatedOpponentHp <= 0) {
        setTimeout(() => {
          endMatch(teamId);
        }, 1800);
        return;
      }

      // Next Round
      setTimeout(() => {
        setAnimStateA('idle');
        setAnimStateB('idle');
        setScreenShake('none');
        setFloatingDamage(null);
        setAnnouncementText('');
        setRoundNumber((r) => r + 1);
        pickNextQuestion();
      }, 1800);
    } else {
      // WRONG ANSWER FROM THIS TEAM!
      soundEngine.playWrong();
      setAnnouncementText(`${currentStudent} (${activeTeamObj.name}) SALAH! Kesempatan untuk lawan!`);

      // Lock out this team for the rest of the question
      if (isTeamA) {
        setTeamALocked(true);
        setTeamA((prev) => ({
          ...prev,
          combo: prev.activeBuffs.includes('COMBO_SAVER') ? prev.combo : 0,
          activeBuffs: prev.activeBuffs.filter((b) => b !== 'COMBO_SAVER'),
          stats: { ...prev.stats, wrong: prev.stats.wrong + 1 },
        }));
      } else {
        setTeamBLocked(true);
        setTeamB((prev) => ({
          ...prev,
          combo: prev.activeBuffs.includes('COMBO_SAVER') ? prev.combo : 0,
          activeBuffs: prev.activeBuffs.filter((b) => b !== 'COMBO_SAVER'),
          stats: { ...prev.stats, wrong: prev.stats.wrong + 1 },
        }));
      }

      // If BOTH teams locked out -> end this question
      if ((isTeamA && teamBLocked) || (!isTeamA && teamALocked)) {
        setIsRoundResolved(true);
        setAnnouncementText('Kedua tim menjawab salah!');
        setTimeout(() => {
          setTeamA((prev) => ({ ...prev, currentTurnIndex: (prev.currentTurnIndex + 1) % prev.players.length }));
          setTeamB((prev) => ({ ...prev, currentTurnIndex: (prev.currentTurnIndex + 1) % prev.players.length }));
          setRoundNumber((r) => r + 1);
          pickNextQuestion();
        }, 1600);
      }
    }
  };

  // Keyboard controls for speed duel:
  // Team Kiri (Team A): 1, 2, 3, 4 (or Q, W, E, R)
  // Team Kanan (Team B): 7, 8, 9, 0 (or U, I, O, P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || isRoundResolved || !currentQuestion) return;

      const key = e.key.toLowerCase();
      // Team A keys: 1, 2, 3, 4 or q, w, e, r
      if (key === '1' || key === 'q') handleSpeedAnswer('A', 0);
      else if (key === '2' || key === 'w') handleSpeedAnswer('A', 1);
      else if (key === '3' || key === 'e') handleSpeedAnswer('A', 2);
      else if (key === '4' || key === 'r') handleSpeedAnswer('A', 3);

      // Team B keys: 7, 8, 9, 0 or u, i, o, p
      else if (key === '7' || key === 'u') handleSpeedAnswer('B', 0);
      else if (key === '8' || key === 'i') handleSpeedAnswer('B', 1);
      else if (key === '9' || key === 'o') handleSpeedAnswer('B', 2);
      else if (key === '0' || key === 'p') handleSpeedAnswer('B', 3);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, isRoundResolved, currentQuestion, teamALocked, teamBLocked]);

  const endMatch = (winner: 'A' | 'B') => {
    const winnerName = winner === 'A' ? teamA.name : teamB.name;
    const duration = Math.round((Date.now() - matchStartTimeRef.current) / 1000);

    onMatchFinish({
      winner,
      winnerTeamName: winnerName,
      teamAState: teamA,
      teamBState: teamB,
      totalQuestions: roundNumber,
      eventLogs,
      durationSeconds: duration,
      reviewedQuestions,
    });
  };

  const studentA = teamA.players[teamA.currentTurnIndex] || 'Pemain A';
  const studentB = teamB.players[teamB.currentTurnIndex] || 'Pemain B';

  return (
    <ArenaBackground arenaId={config.arenaId} intensity={screenShake === 'intense' ? 'intense' : 'normal'}>
      <div
        className={`w-full h-screen max-h-screen flex flex-col justify-between p-2 sm:p-3 overflow-hidden select-none transition-transform ${
          screenShake === 'mild' ? 'animate-shake-mild' : screenShake === 'intense' ? 'animate-shake-intense' : ''
        }`}
      >
        {/* ================= TOP HUD: HP & MATCH HEADER ================= */}
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-1.5 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 items-stretch">
            {/* Team Kiri HP (Rata Kiri, Snug fit tanpa ruang kosong) */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/90 border-2 border-blue-500/80 shadow-[0_0_15px_rgba(37,99,235,0.2)] backdrop-blur-md flex flex-col justify-center">
              <HealthBar
                team="A"
                teamName={teamA.name}
                characterName={CHARACTERS.find((c) => c.id === teamA.characterId)?.name || 'Knight'}
                hp={teamA.hp}
                maxHp={teamA.maxHp}
                ultimateGauge={teamA.ultimateGauge}
                combo={teamA.combo}
                activeBuffs={teamA.activeBuffs}
                activeDebuffs={teamA.activeDebuffs}
                currentPlayer={studentA}
                playerIndex={teamA.currentTurnIndex}
                totalPlayers={teamA.players.length}
              />
            </div>

            {/* Team Kanan HP (Rata Kanan, Seimbang, Snug fit tanpa ruang kosong) */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/90 border-2 border-red-500/80 shadow-[0_0_15px_rgba(220,38,38,0.2)] backdrop-blur-md flex flex-col justify-center text-right">
              <HealthBar
                team="B"
                teamName={teamB.name}
                characterName={CHARACTERS.find((c) => c.id === teamB.characterId)?.name || 'Mage'}
                hp={teamB.hp}
                maxHp={teamB.maxHp}
                ultimateGauge={teamB.ultimateGauge}
                combo={teamB.combo}
                activeBuffs={teamB.activeBuffs}
                activeDebuffs={teamB.activeDebuffs}
                currentPlayer={studentB}
                playerIndex={teamB.currentTurnIndex}
                totalPlayers={teamB.players.length}
              />
            </div>
          </div>

          {/* DUEL ANNOUNCEMENT BANNER WITH FULLSCREEN & SOUND CONTROLS */}
          <div className="flex items-center justify-between px-3 py-1 rounded-xl bg-slate-950/90 border border-slate-800 text-xs h-8 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-mono font-bold text-[11px] sm:text-xs">SOAL #{roundNumber}</span>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5 text-slate-300 text-[11px] sm:text-xs">
                <span className="text-blue-400 font-bold">{studentA}</span>
                <span className="text-amber-400 font-black text-[10px]">VS</span>
                <span className="text-red-400 font-bold">{studentB}</span>
                <span className="text-slate-500 text-[10px] hidden sm:inline">(Cepat-cepatan Menjawab!)</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Fullscreen Button */}
              <button
                onClick={handleToggleFullscreen}
                className="px-2 py-0.5 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh (F11)'}
              >
                {isFullscreen ? <Minimize className="w-3 h-3 text-amber-400" /> : <Maximize className="w-3 h-3 text-slate-300" />}
                <span className="hidden md:inline">{isFullscreen ? 'Normal' : 'Layar Penuh'}</span>
              </button>

              {/* BGM Toggle */}
              <button
                onClick={handleToggleBgm}
                className="p-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                title={isBgmMuted ? 'Nyalakan Musik' : 'Matikan Musik'}
              >
                <Music className={`w-3.5 h-3.5 ${isBgmMuted ? 'text-slate-500' : 'text-amber-400 animate-pulse'}`} />
              </button>

              {/* Pause / Resume */}
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setIsPaused(!isPaused);
                }}
                className="px-2 py-0.5 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
                <span className="hidden sm:inline">{isPaused ? 'Lanjut' : 'Jeda'}</span>
              </button>

              {/* Exit Match */}
              <button
                onClick={() => {
                  soundEngine.playClick();
                  soundEngine.stopBGM();
                  onExit();
                }}
                className="px-2 py-0.5 text-[11px] font-bold text-red-300 hover:text-white bg-red-950/80 hover:bg-red-900 rounded-lg border border-red-700/60 flex items-center gap-1 cursor-pointer transition-colors"
                title="Keluar dari pertandingan ke menu utama"
              >
                <LogOut className="w-3 h-3 text-red-400" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= CENTER STAGE: CHARACTERS & FLOATING DAMAGE ================= */}
        <div className="relative w-full max-w-6xl mx-auto grid grid-cols-12 items-center gap-2 sm:gap-4 px-2 my-auto shrink-0">
          {/* TEAM KIRI (CHARACTER PORTRAIT) - EXACT LEFT 3 COLUMNS */}
          <div className="col-span-3 flex flex-col items-center justify-center relative">
            <CharacterAvatar
              characterId={teamA.characterId}
              team="A"
              size="hero"
              state={animStateA}
              hasShield={teamA.activeBuffs.includes('SHIELD')}
            />
            {teamALocked && (
              <div className="absolute top-2 inset-x-2 py-1 rounded bg-red-950/90 border border-red-500 text-red-300 font-bold text-xs text-center animate-pulse z-30">
                SALAH! TERKUNCI
              </div>
            )}
            {floatingDamage && floatingDamage.target === 'A' && (
              <div
                className={`absolute -top-12 z-40 font-mono font-black text-2xl sm:text-4xl animate-damage-float select-none drop-shadow-md ${
                  floatingDamage.isMiss
                    ? 'text-slate-400'
                    : floatingDamage.isCritical || floatingDamage.isUltimate
                    ? 'text-yellow-300 scale-125'
                    : 'text-rose-500'
                }`}
              >
                {floatingDamage.amount}
              </div>
            )}
          </div>

          {/* CENTER QUESTION CARD & CLOCK - EXACT MIDDLE 6 COLUMNS */}
          <div className="col-span-6 flex flex-col items-center justify-center text-center z-20 px-1">
            {/* Countdown Clock (Fixed dimensions) */}
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 mb-1 flex items-center justify-center shrink-0">
              <div
                className={`w-full h-full rounded-full border-2 sm:border-3 flex flex-col items-center justify-center shadow-xl backdrop-blur-md transition-colors ${
                  timeLeft <= 3
                    ? 'border-red-500 bg-red-950/80 animate-ping-mild shadow-red-500/50'
                    : 'border-amber-400 bg-slate-950/90 shadow-amber-500/20'
                }`}
              >
                <span className="font-mono font-black text-base sm:text-lg text-white tabular-nums leading-none">
                  {timeLeft}
                </span>
                <span className="text-[6px] sm:text-[7px] uppercase tracking-wider text-slate-400 font-bold -mt-0.5">
                  DETIK
                </span>
              </div>
            </div>

            {/* Question Text Box (Harmonized fixed height so it matches character avatar and answer decks) */}
            <div className="w-full h-22 sm:h-26 md:h-28 p-2.5 sm:p-3 rounded-2xl bg-slate-950/95 border-2 border-amber-500/60 shadow-2xl backdrop-blur-xl flex flex-col justify-center items-center overflow-hidden shrink-0">
              {currentQuestion ? (
                <>
                  <div className="text-[10px] sm:text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-0.5">
                    {currentQuestion.topic} · SMP Kelas {currentQuestion.grade}
                  </div>
                  <h3 className="text-xs sm:text-base md:text-lg font-black text-white leading-snug tracking-wide py-0.5 drop-shadow-md text-center line-clamp-2">
                    {currentQuestion.prompt}
                  </h3>
                </>
              ) : (
                <div className="text-slate-400 text-xs animate-pulse">Menyiapkan soal...</div>
              )}
            </div>

            {/* Live Announcer Banner (Dedicated fixed height slot so layout never shifts) */}
            <div className="w-full h-5 mt-1 flex items-center justify-center shrink-0">
              {announcementText && (
                <div className="px-2.5 py-0.5 rounded-full bg-slate-950/95 border border-amber-400 text-amber-300 text-[10px] sm:text-xs font-black tracking-wide uppercase shadow-xl animate-bounce">
                  {announcementText}
                </div>
              )}
            </div>
          </div>

          {/* TEAM KANAN (CHARACTER PORTRAIT) - EXACT RIGHT 3 COLUMNS */}
          <div className="col-span-3 flex flex-col items-center justify-center relative">
            <CharacterAvatar
              characterId={teamB.characterId}
              team="B"
              size="hero"
              state={animStateB}
              hasShield={teamB.activeBuffs.includes('SHIELD')}
            />
            {teamBLocked && (
              <div className="absolute top-2 inset-x-2 py-1 rounded bg-red-950/90 border border-red-500 text-red-300 font-bold text-xs text-center animate-pulse z-30">
                SALAH! TERKUNCI
              </div>
            )}
            {floatingDamage && floatingDamage.target === 'B' && (
              <div
                className={`absolute -top-12 z-40 font-mono font-black text-2xl sm:text-4xl animate-damage-float select-none drop-shadow-md ${
                  floatingDamage.isMiss
                    ? 'text-slate-400'
                    : floatingDamage.isCritical || floatingDamage.isUltimate
                    ? 'text-yellow-300 scale-125'
                    : 'text-rose-500'
                }`}
              >
                {floatingDamage.amount}
              </div>
            )}
          </div>
        </div>

        {/* ================= BOTTOM SPLIT DECK: 4 BUTTONS LEFT & 4 BUTTONS RIGHT ================= */}
        {/* Desain ringkas dan seimbang agar tidak mendominasi/memenuhi halaman, sejajar dengan karakter */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 z-20 items-stretch shrink-0">
          {/* ================= TEAM KIRI 4 BUTTONS (RATA KIRI) ================= */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-950/90 to-slate-950/90 border-2 border-blue-500/80 shadow-[0_0_20px_rgba(37,99,235,0.2)] backdrop-blur-md flex flex-col justify-between shrink-0 p-2 sm:p-2.5 transition-all duration-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-blue-800/60 pb-1 mb-1.5 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="font-extrabold uppercase text-blue-300 text-[11px] sm:text-xs">
                  Tombol {teamA.name}
                </span>
              </div>
              <span className="font-mono text-slate-400 truncate ml-2 text-[9px] sm:text-[10px]">
                Pemain: <strong className="text-white">{studentA}</strong> (Keys: 1, 2, 3, 4 / Q, W, E, R)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 flex-1 items-stretch">
              {currentQuestion?.options.map((optionText, idx) => {
                const teamAKeyLabels = ['[1] Q', '[2] W', '[3] E', '[4] R'];
                const isSelected = teamAChosen === idx;
                return (
                  <button
                    key={`A-${idx}`}
                    disabled={isRoundResolved || teamALocked || isPaused}
                    onClick={() => handleSpeedAnswer('A', idx)}
                    className={`rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer shadow-md select-none overflow-hidden min-h-[36px] sm:min-h-[40px] md:min-h-[44px] px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-bold ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-400 scale-102'
                        : teamALocked
                        ? 'bg-slate-950/60 border-slate-800 opacity-40 text-slate-500'
                        : 'bg-slate-900/90 hover:bg-blue-900/50 hover:border-blue-400 text-slate-100 border-slate-700/80 active:scale-95'
                    }`}
                  >
                    <span className="truncate pr-1.5 flex-1 leading-tight">{optionText}</span>
                    <span className="font-mono rounded bg-blue-950 text-blue-300 border border-blue-700/50 shrink-0 text-[9px] sm:text-[10px] px-1.5 py-0.5">
                      {teamAKeyLabels[idx] || idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================= TEAM KANAN 4 BUTTONS (RATA KANAN & SEIMBANG) ================= */}
          <div className="rounded-2xl bg-gradient-to-l from-red-950/90 to-slate-950/90 border-2 border-red-500/80 shadow-[0_0_20px_rgba(220,38,38,0.2)] backdrop-blur-md flex flex-col justify-between shrink-0 p-2 sm:p-2.5 text-right transition-all duration-200 overflow-hidden">
            <div className="flex items-center justify-between flex-row-reverse border-b border-red-800/60 pb-1 mb-1.5 text-right shrink-0">
              <div className="flex items-center gap-1.5 flex-row-reverse">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-extrabold uppercase text-red-300 text-[11px] sm:text-xs">
                  Tombol {teamB.name}
                </span>
              </div>
              <span className="font-mono text-slate-400 truncate mr-2 text-[9px] sm:text-[10px]">
                (Keys: 7, 8, 9, 0 / U, I, O, P) <strong className="text-white">{studentB}</strong> :Pemain
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 flex-1 items-stretch">
              {currentQuestion?.options.map((optionText, idx) => {
                const teamBKeyLabels = ['[7] U', '[8] I', '[9] O', '[0] P'];
                const isSelected = teamBChosen === idx;
                return (
                  <button
                    key={`B-${idx}`}
                    disabled={isRoundResolved || teamBLocked || isPaused}
                    onClick={() => handleSpeedAnswer('B', idx)}
                    className={`rounded-xl border flex items-center justify-between flex-row-reverse transition-all cursor-pointer shadow-md select-none overflow-hidden min-h-[36px] sm:min-h-[40px] md:min-h-[44px] px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-bold ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-400 scale-102'
                        : teamBLocked
                        ? 'bg-slate-950/60 border-slate-800 opacity-40 text-slate-500'
                        : 'bg-slate-900/90 hover:bg-red-900/50 hover:border-red-400 text-slate-100 border-slate-700/80 active:scale-95'
                    }`}
                  >
                    <span className="truncate pl-1.5 flex-1 leading-tight text-right">{optionText}</span>
                    <span className="font-mono rounded bg-red-950 text-red-300 border border-red-700/50 shrink-0 text-[9px] sm:text-[10px] px-1.5 py-0.5">
                      {teamBKeyLabels[idx] || idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* TEACHER PAUSE MODAL */}
        {isPaused && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 text-center shadow-2xl">
              <h3 className="text-xl font-black text-amber-400 uppercase tracking-wide mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Pertandingan Dijeda
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Kedua tim dapat berdiskusi. Tekan tombol di bawah untuk melanjutkan atau mengganti soal.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setIsPaused(false);
                  }}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Lanjutkan Pertandingan
                </button>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setIsPaused(false);
                    pickNextQuestion();
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                  Ganti Soal Baru
                </button>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setIsPaused(false);
                    endMatch(teamA.hp >= teamB.hp ? 'A' : 'B');
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/50 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Selesaikan Pertandingan & Lihat Skor
                </button>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    soundEngine.stopBGM();
                    setIsPaused(false);
                    onExit();
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-900/80 hover:bg-red-800 text-white font-bold text-xs border border-red-600 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-300" />
                  Keluar Pertandingan ke Menu Utama
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ArenaBackground>
  );
};
