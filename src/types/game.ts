export type GradeLevel = 'VII' | 'VIII' | 'IX' | 'ALL';

export type QuestionCategory = 
  | 'OPERASI_BILANGAN'   // 50%
  | 'LOGIKA_MATEMATIKA'  // 30%
  | 'PERBANDINGAN';      // 20%

export type QuestionType = 
  | 'multiple_choice' 
  | 'true_false' 
  | 'missing_number' 
  | 'compare' 
  | 'word_problem' 
  | 'fast_count';

export interface Question {
  id: string;
  grade: GradeLevel;
  category: QuestionCategory;
  type: QuestionType;
  prompt: string;
  subPrompt?: string;
  options: string[]; // 2 for true/false or compare, 4 for multiple choice
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topic: string; // e.g. "Aljabar", "Aritmetika Sosial", "Teorema Pythagoras", "Pola Bilangan"
}

export type CharacterId = 
  | 'knight' 
  | 'mage' 
  | 'samurai' 
  | 'robot' 
  | 'ninja' 
  | 'pirate' 
  | 'archer' 
  | 'guardian';

export interface CharacterDef {
  id: CharacterId;
  name: string;
  title: string;
  description: string;
  weapon: string;
  attackName: string;
  ultimateName: string;
  elementColor: string;
  badgeBg: string;
  iconName: string;
}

export type ArenaId = 
  | 'castle' 
  | 'forest' 
  | 'volcano' 
  | 'cyber_city' 
  | 'desert' 
  | 'temple' 
  | 'snow' 
  | 'space' 
  | 'ocean';

export interface ArenaDef {
  id: ArenaId;
  name: string;
  subtitle: string;
  bgImagePath?: string;
  colorScheme: string;
  ambientType: 'dust' | 'leaves' | 'embers' | 'cyber' | 'snow' | 'stars' | 'bubbles';
}

export type BuffType = 
  | 'ATTACK_UP'       // +2 damage
  | 'CRITICAL_BOOST'  // +30% crit chance
  | 'SHIELD'          // Absorb next damage
  | 'HEAL'            // +5 HP immediately
  | 'COMBO_SAVER'     // Doesn't reset combo on 1 wrong answer
  | 'DOUBLE_DAMAGE';  // x2 damage next hit

export type DebuffType = 
  | 'FREEZE'          // Reduced timer by 3s
  | 'POISON'          // Lose 2 HP
  | 'BLIND'           // Text scrambled slightly for 1.5s
  | 'DAMAGE_DOWN'     // -2 damage dealt
  | 'COMBO_BREAK';    // Instantly breaks current combo

export interface TeamState {
  id: 'A' | 'B';
  name: string;
  characterId: CharacterId;
  hp: number;
  maxHp: number;
  ultimateGauge: number; // 0 - 6
  combo: number;
  activeBuffs: BuffType[];
  activeDebuffs: DebuffType[];
  players: string[];
  currentTurnIndex: number;
  stats: {
    correct: number;
    wrong: number;
    totalDamageDealt: number;
    criticalHits: number;
    ultimateUses: number;
    maxCombo: number;
    answerTimes: number[];
    playerScores: Record<string, { correct: number; damage: number }>;
  };
}

export interface MatchConfig {
  teamAName: string;
  teamBName: string;
  teamACharacter: CharacterId;
  teamBCharacter: CharacterId;
  teamAPlayers: string[];
  teamBPlayers: string[];
  arenaId: ArenaId;
  grade: GradeLevel;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'ADAPTIVE';
  timerSeconds: 8 | 10 | 15 | 20;
  enableBuffs: boolean;
  enableUltimates: boolean;
  maxRounds?: number; // optional, default unlimited until HP=0
}

export interface BattleEventLog {
  id: string;
  timestamp: number;
  team: 'A' | 'B';
  playerName: string;
  action: 'CORRECT' | 'WRONG' | 'TIMEOUT' | 'CRITICAL' | 'ULTIMATE' | 'HEAL' | 'BUFF' | 'DEBUFF';
  damage: number;
  details: string;
}

export interface MatchHistoryRecord {
  id: string;
  date: string;
  arenaName: string;
  grade: string;
  winnerTeam: string;
  winnerCharacter: string;
  scoreA: number;
  scoreB: number;
  teamAName: string;
  teamBName: string;
  totalQuestions: number;
  accuracyA: number;
  accuracyB: number;
  mvpPlayer: string;
  mvpTeam: string;
  durationMinutes: number;
}
