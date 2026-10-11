import { Question, GradeLevel, QuestionCategory } from '../types/game';

export const BUILT_IN_QUESTIONS: Question[] = [
  // ==========================================
  // OPERASI HITUNG CEPAT (+, −, ×, :)
  // ==========================================
  {
    id: 'q-sim-add-1',
    grade: 'VII',
    category: 'OPERASI_BILANGAN',
    type: 'fast_count',
    prompt: 'Berapakah hasil dari: 27 + 38 = ?',
    options: ['65', '55', '63', '75'],
    correctAnswerIndex: 0,
    explanation: '27 + 38 = 65.',
    difficulty: 'EASY',
    topic: 'Penjumlahan (+)',
  },
  {
    id: 'q-sim-sub-1',
    grade: 'VII',
    category: 'OPERASI_BILANGAN',
    type: 'fast_count',
    prompt: 'Berapakah hasil dari: 82 − 37 = ?',
    options: ['45', '55', '43', '47'],
    correctAnswerIndex: 0,
    explanation: '82 − 37 = 45.',
    difficulty: 'EASY',
    topic: 'Pengurangan (−)',
  },
  {
    id: 'q-sim-mul-1',
    grade: 'VII',
    category: 'OPERASI_BILANGAN',
    type: 'fast_count',
    prompt: 'Berapakah hasil dari: 8 × 7 = ?',
    options: ['56', '54', '64', '48'],
    correctAnswerIndex: 0,
    explanation: '8 × 7 = 56.',
    difficulty: 'EASY',
    topic: 'Perkalian (×)',
  },
  {
    id: 'q-sim-div-1',
    grade: 'VII',
    category: 'OPERASI_BILANGAN',
    type: 'fast_count',
    prompt: 'Berapakah hasil dari: 72 : 8 = ?',
    options: ['9', '8', '7', '6'],
    correctAnswerIndex: 0,
    explanation: '72 : 8 = 9.',
    difficulty: 'EASY',
    topic: 'Pembagian (:)',
  },
  {
    id: 'q-sim-add-2',
    grade: 'VII',
    category: 'OPERASI_BILANGAN',
    type: 'fast_count',
    prompt: 'Hitung cepat: 45 + 39 = ?',
    options: ['84', '74', '86', '94'],
    correctAnswerIndex: 0,
    explanation: '45 + 39 = 84.',
    difficulty: 'EASY',
    topic: 'Penjumlahan (+)',
  },
  {
    id: 'q-sim-sub-2',
    grade: 'VII',
    category: 'OPERASI_BILANGAN',
    type: 'fast_count',
    prompt: 'Hitung cepat: 100 − 46 = ?',
    options: ['54', '64', '56', '44'],
    correctAnswerIndex: 0,
    explanation: '100 − 46 = 54.',
    difficulty: 'EASY',
    topic: 'Pengurangan (−)',
  },
  {
    id: 'q-sim-mul-2',
    grade: 'VII',
    category: 'OPERASI_BILANGAN',
    type: 'fast_count',
    prompt: 'Hitung cepat: 12 × 6 = ?',
    options: ['72', '68', '74', '62'],
    correctAnswerIndex: 0,
    explanation: '12 × 6 = 72.',
    difficulty: 'EASY',
    topic: 'Perkalian (×)',
  },
  {
    id: 'q-sim-div-2',
    grade: 'VII',
    category: 'OPERASI_BILANGAN',
    type: 'fast_count',
    prompt: 'Hitung cepat: 84 : 7 = ?',
    options: ['12', '14', '11', '13'],
    correctAnswerIndex: 0,
    explanation: '84 : 7 = 12.',
    difficulty: 'EASY',
    topic: 'Pembagian (:)',
  },
  {
    id: 'q-sim-mix-1',
    grade: 'VII',
    category: 'OPERASI_BILANGAN',
    type: 'multiple_choice',
    prompt: 'Hasil dari: 6 × 5 + 14 = ?',
    options: ['44', '34', '54', '42'],
    correctAnswerIndex: 0,
    explanation: '6 × 5 = 30, lalu 30 + 14 = 44.',
    difficulty: 'EASY',
    topic: 'Operasi Campuran',
  },
  {
    id: 'q-sim-mix-2',
    grade: 'VII',
    category: 'OPERASI_BILANGAN',
    type: 'multiple_choice',
    prompt: 'Hasil dari: 40 : 5 + 17 = ?',
    options: ['25', '23', '27', '30'],
    correctAnswerIndex: 0,
    explanation: '40 : 5 = 8, lalu 8 + 17 = 25.',
    difficulty: 'EASY',
    topic: 'Operasi Campuran',
  },
  {
    id: 'q-sim-mix-3',
    grade: 'VII',
    category: 'OPERASI_BILANGAN',
    type: 'multiple_choice',
    prompt: 'Hasil dari: 50 − 4 × 8 = ?',
    options: ['18', '22', '16', '24'],
    correctAnswerIndex: 0,
    explanation: '4 × 8 = 32, lalu 50 − 32 = 18.',
    difficulty: 'EASY',
    topic: 'Operasi Campuran',
  },
  {
    id: 'q-sim-mix-4',
    grade: 'VII',
    category: 'OPERASI_BILANGAN',
    type: 'multiple_choice',
    prompt: 'Hasil dari: 9 × (5 + 3) = ?',
    options: ['72', '64', '81', '68'],
    correctAnswerIndex: 0,
    explanation: '5 + 3 = 8, lalu 9 × 8 = 72.',
    difficulty: 'EASY',
    topic: 'Operasi Campuran',
  },
  {
    id: 'q-sim-mul-3',
    grade: 'VIII',
    category: 'OPERASI_BILANGAN',
    type: 'fast_count',
    prompt: 'Hitung cepat: 15 × 6 = ?',
    options: ['90', '85', '95', '80'],
    correctAnswerIndex: 0,
    explanation: '15 × 6 = 90.',
    difficulty: 'EASY',
    topic: 'Perkalian (×)',
  },
  {
    id: 'q-sim-div-3',
    grade: 'VIII',
    category: 'OPERASI_BILANGAN',
    type: 'fast_count',
    prompt: 'Hitung cepat: 96 : 6 = ?',
    options: ['16', '14', '18', '12'],
    correctAnswerIndex: 0,
    explanation: '96 : 6 = 16.',
    difficulty: 'EASY',
    topic: 'Pembagian (:)',
  },
  {
    id: 'q-sim-frac-1',
    grade: 'VII',
    category: 'OPERASI_BILANGAN',
    type: 'fast_count',
    prompt: 'Berapakah 1/2 dari 90?',
    options: ['45', '40', '50', '35'],
    correctAnswerIndex: 0,
    explanation: '90 : 2 = 45.',
    difficulty: 'EASY',
    topic: 'Pecahan',
  },
  {
    id: 'q-sim-frac-2',
    grade: 'VII',
    category: 'OPERASI_BILANGAN',
    type: 'fast_count',
    prompt: 'Berapakah 1/4 dari 80?',
    options: ['20', '25', '15', '30'],
    correctAnswerIndex: 0,
    explanation: '80 : 4 = 20.',
    difficulty: 'EASY',
    topic: 'Pecahan',
  },

  // ==========================================
  // LOGIKA MATEMATIKA SEDERHANA - MENENGAH
  // ==========================================
  {
    id: 'q-sim-log-1',
    grade: 'VII',
    category: 'LOGIKA_MATEMATIKA',
    type: 'missing_number',
    prompt: 'Lanjutkan pola bilangan: 4, 8, 12, 16, [ ? ]',
    options: ['20', '24', '18', '22'],
    correctAnswerIndex: 0,
    explanation: 'Setiap angka bertambah 4: 16 + 4 = 20.',
    difficulty: 'EASY',
    topic: 'Pola Bilangan',
  },
  {
    id: 'q-sim-log-2',
    grade: 'VII',
    category: 'LOGIKA_MATEMATIKA',
    type: 'missing_number',
    prompt: 'Lanjutkan pola bilangan: 3, 6, 12, 24, [ ? ]',
    options: ['48', '36', '42', '50'],
    correctAnswerIndex: 0,
    explanation: 'Setiap angka dikali 2: 24 × 2 = 48.',
    difficulty: 'EASY',
    topic: 'Pola Bilangan',
  },
  {
    id: 'q-sim-log-3',
    grade: 'VII',
    category: 'LOGIKA_MATEMATIKA',
    type: 'word_problem',
    prompt: 'Jika hari ini adalah hari Senin, hari apakah 3 hari lagi?',
    options: ['Kamis', 'Rabu', 'Jumat', 'Selasa'],
    correctAnswerIndex: 0,
    explanation: 'Senin + 3 hari = Kamis.',
    difficulty: 'EASY',
    topic: 'Logika Hari',
  },
  {
    id: 'q-sim-log-4',
    grade: 'VII',
    category: 'LOGIKA_MATEMATIKA',
    type: 'word_problem',
    prompt: 'Jika hari ini adalah hari Jumat, kemarin lusa adalah hari...',
    options: ['Rabu', 'Kamis', 'Selasa', 'Sabtu'],
    correctAnswerIndex: 0,
    explanation: 'Kemarin lusa = mundur 2 hari. Jumat − 2 hari = Rabu.',
    difficulty: 'EASY',
    topic: 'Logika Hari',
  },
  {
    id: 'q-sim-log-5',
    grade: 'VII',
    category: 'LOGIKA_MATEMATIKA',
    type: 'word_problem',
    prompt: 'Andi lebih tua dari Budi. Budi lebih tua dari Cici. Siapa yang paling tua?',
    options: ['Andi', 'Budi', 'Cici', 'Sama tua'],
    correctAnswerIndex: 0,
    explanation: 'Urutan usia: Andi > Budi > Cici. Jadi Andi paling tua.',
    difficulty: 'EASY',
    topic: 'Logika Urutan',
  },
  {
    id: 'q-sim-log-6',
    grade: 'VII',
    category: 'LOGIKA_MATEMATIKA',
    type: 'word_problem',
    prompt: 'Rina punya 15 apel. Diberikan ke adiknya 6 apel, lalu dibeli lagi 10 apel. Berapa apel Rina sekarang?',
    options: ['19', '21', '18', '20'],
    correctAnswerIndex: 0,
    explanation: '15 − 6 = 9. Lalu 9 + 10 = 19 apel.',
    difficulty: 'EASY',
    topic: 'Cerita Logika',
  },
  {
    id: 'q-sim-log-7',
    grade: 'VIII',
    category: 'LOGIKA_MATEMATIKA',
    type: 'missing_number',
    prompt: 'Lanjutkan pola bilangan: 2, 5, 8, 11, 14, [ ? ]',
    options: ['17', '16', '18', '19'],
    correctAnswerIndex: 0,
    explanation: 'Pola bertambah 3: 14 + 3 = 17.',
    difficulty: 'EASY',
    topic: 'Pola Bilangan',
  },
  {
    id: 'q-sim-log-8',
    grade: 'VIII',
    category: 'LOGIKA_MATEMATIKA',
    type: 'missing_number',
    prompt: 'Lanjutkan pola bilangan kuadrat: 1, 4, 9, 16, 25, [ ? ]',
    options: ['36', '30', '35', '49'],
    correctAnswerIndex: 0,
    explanation: '1², 2², 3², 4², 5², berikutnya 6² = 36.',
    difficulty: 'MEDIUM',
    topic: 'Pola Bilangan',
  },

  // ==========================================
  // PERBANDINGAN NILAI CEPAT
  // ==========================================
  {
    id: 'q-sim-cmp-1',
    grade: 'VII',
    category: 'PERBANDINGAN',
    type: 'compare',
    prompt: 'Mana yang lebih besar: (8 × 7) atau (9 × 6) ?',
    options: ['8 × 7', '9 × 6', 'Sama Besar', 'Tidak Dapat Ditentukan'],
    correctAnswerIndex: 0,
    explanation: '8 × 7 = 56 sedangkan 9 × 6 = 54. 56 lebih besar dari 54.',
    difficulty: 'EASY',
    topic: 'Perbandingan Cepat',
  },
  {
    id: 'q-sim-cmp-2',
    grade: 'VII',
    category: 'PERBANDINGAN',
    type: 'compare',
    prompt: 'Bandingkan nilai: 45 + 35 ... 100 − 20',
    options: ['=', '>', '<', '≠'],
    correctAnswerIndex: 0,
    explanation: '45 + 35 = 80 dan 100 − 20 = 80. Hasilnya sama besar (=).',
    difficulty: 'EASY',
    topic: 'Perbandingan Cepat',
  },
  {
    id: 'q-sim-cmp-3',
    grade: 'VII',
    category: 'PERBANDINGAN',
    type: 'compare',
    prompt: 'Mana yang lebih kecil: 1/2 atau 1/4 ?',
    options: ['1/4', '1/2', 'Sama Besar', 'Keduanya Sama Nol'],
    correctAnswerIndex: 0,
    explanation: '1/4 bernilai 0,25, yang mana lebih kecil dari 1/2 (0,50).',
    difficulty: 'EASY',
    topic: 'Pecahan',
  },
  {
    id: 'q-sim-cmp-4',
    grade: 'VIII',
    category: 'PERBANDINGAN',
    type: 'compare',
    prompt: 'Bandingkan nilai: 6² ... 5 × 7',
    options: ['>', '<', '=', '≠'],
    correctAnswerIndex: 0,
    explanation: '6² = 36, sedangkan 5 × 7 = 35. Maka 36 > 35.',
    difficulty: 'EASY',
    topic: 'Perbandingan Cepat',
  },
];

/**
 * Endless Dynamic Question Generator (+, -, x, :, dan pola logika sederhana)
 */
export function generateDynamicQuestion(grade: GradeLevel, category: QuestionCategory): Question {
  const seed = Math.floor(Math.random() * 100000);
  const opType = Math.floor(Math.random() * 5); // 0: +, 1: -, 2: x, 3: :, 4: mix/logic

  if (opType === 0) {
    // Penjumlahan (+)
    const a = Math.floor(Math.random() * 45) + 12;
    const b = Math.floor(Math.random() * 45) + 12;
    const ans = a + b;
    const d1 = ans + 2;
    const d2 = ans - 2;
    const d3 = ans + 10;
    const options = [String(ans), String(d1), String(d2), String(d3)].sort(() => Math.random() - 0.5);

    return {
      id: `dyn-add-${seed}`,
      grade: 'VII',
      category: 'OPERASI_BILANGAN',
      type: 'fast_count',
      prompt: `Berapakah hasil dari: ${a} + ${b} = ?`,
      options,
      correctAnswerIndex: options.indexOf(String(ans)),
      explanation: `${a} + ${b} = ${ans}.`,
      difficulty: 'EASY',
      topic: 'Penjumlahan (+)',
    };
  } else if (opType === 1) {
    // Pengurangan (-)
    const a = Math.floor(Math.random() * 50) + 40;
    const b = Math.floor(Math.random() * 35) + 10;
    const ans = a - b;
    const d1 = ans + 2;
    const d2 = ans - 3;
    const d3 = ans + 10;
    const options = [String(ans), String(d1), String(d2), String(d3)].sort(() => Math.random() - 0.5);

    return {
      id: `dyn-sub-${seed}`,
      grade: 'VII',
      category: 'OPERASI_BILANGAN',
      type: 'fast_count',
      prompt: `Berapakah hasil dari: ${a} − ${b} = ?`,
      options,
      correctAnswerIndex: options.indexOf(String(ans)),
      explanation: `${a} − ${b} = ${ans}.`,
      difficulty: 'EASY',
      topic: 'Pengurangan (−)',
    };
  } else if (opType === 2) {
    // Perkalian (x)
    const a = Math.floor(Math.random() * 8) + 6; // 6 - 13
    const b = Math.floor(Math.random() * 7) + 4; // 4 - 10
    const ans = a * b;
    const d1 = ans + 4;
    const d2 = ans - 6;
    const d3 = ans + 10;
    const options = [String(ans), String(d1), String(d2), String(d3)].sort(() => Math.random() - 0.5);

    return {
      id: `dyn-mul-${seed}`,
      grade: 'VII',
      category: 'OPERASI_BILANGAN',
      type: 'fast_count',
      prompt: `Berapakah hasil dari: ${a} × ${b} = ?`,
      options,
      correctAnswerIndex: options.indexOf(String(ans)),
      explanation: `${a} × ${b} = ${ans}.`,
      difficulty: 'EASY',
      topic: 'Perkalian (×)',
    };
  } else if (opType === 3) {
    // Pembagian (:)
    const divisor = Math.floor(Math.random() * 6) + 4; // 4 - 9
    const quotient = Math.floor(Math.random() * 8) + 5; // 5 - 12
    const dividend = divisor * quotient;
    const ans = quotient;
    const d1 = ans + 1;
    const d2 = ans - 1;
    const d3 = ans + 2;
    const options = [String(ans), String(d1), String(d2), String(d3)].sort(() => Math.random() - 0.5);

    return {
      id: `dyn-div-${seed}`,
      grade: 'VII',
      category: 'OPERASI_BILANGAN',
      type: 'fast_count',
      prompt: `Berapakah hasil dari: ${dividend} : ${divisor} = ?`,
      options,
      correctAnswerIndex: options.indexOf(String(ans)),
      explanation: `${dividend} : ${divisor} = ${ans}.`,
      difficulty: 'EASY',
      topic: 'Pembagian (:)',
    };
  } else {
    // Pola bilangan sederhana (+diff)
    const diff = Math.floor(Math.random() * 4) + 2; // 2, 3, 4, 5
    const start = Math.floor(Math.random() * 8) + 2;
    const s1 = start;
    const s2 = s1 + diff;
    const s3 = s2 + diff;
    const s4 = s3 + diff;
    const ans = s4 + diff;
    const options = [String(ans), String(ans + 2), String(ans - 2), String(ans + diff + 1)].sort(() => Math.random() - 0.5);

    return {
      id: `dyn-pat-${seed}`,
      grade: 'VII',
      category: 'LOGIKA_MATEMATIKA',
      type: 'missing_number',
      prompt: `Lanjutkan pola bilangan: ${s1}, ${s2}, ${s3}, ${s4}, [ ? ]`,
      options,
      correctAnswerIndex: options.indexOf(String(ans)),
      explanation: `Setiap angka bertambah ${diff}. Maka ${s4} + ${diff} = ${ans}.`,
      difficulty: 'EASY',
      topic: 'Pola Bilangan',
    };
  }
}
