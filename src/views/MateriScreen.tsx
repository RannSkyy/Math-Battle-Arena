import React, { useState } from 'react';
import { GradeLevel } from '../types/game';
import { soundEngine } from '../utils/soundEngine';
import { BookOpen, Calculator, Compass, Layers, CheckCircle } from 'lucide-react';

interface TopicItem {
  title: string;
  grade: GradeLevel;
  formula: string;
  summary: string;
  example: string;
}

const MATERI_LIST: TopicItem[] = [
  // KELAS VII
  {
    title: 'Operasi Bilangan Bulat & Campuran',
    grade: 'VII',
    formula: '(+) × (+) = (+) · (−) × (−) = (+) · (+) × (−) = (−)',
    summary: 'Dahulukan operasi di dalam tanda kurung, kemudian perkalian/pembagian, lalu penjumlahan/pengurangan.',
    example: 'Hitung: 9 × (6 + 2) − 15 = 9 × 8 − 15 = 72 − 15 = 57.',
  },
  {
    title: 'Aljabar & Persamaan Linear Satu Variabel (PLSV)',
    grade: 'VII',
    formula: 'ax + b = c  =>  x = (c − b) / a',
    summary: 'Pindahkan suku sejenis ke satu ruas dengan membalik tanda operasi.',
    example: '3x + 7 = 28  =>  3x = 21  =>  x = 7.',
  },
  {
    title: 'Aritmetika Sosial (Diskon & Keuntungan)',
    grade: 'VII',
    formula: 'Harga Bersih = Harga Awal − (Persen Diskon × Harga Awal)',
    summary: 'Untung = Harga Jual − Harga Beli. Rugi = Harga Beli − Harga Jual.',
    example: 'Barang Rp 150.000 diskon 20%: Potongan = 20% × 150.000 = 30.000. Bayar = Rp 120.000.',
  },
  {
    title: 'Perbandingan Senilai & Berbalik Nilai',
    grade: 'VII',
    formula: 'Senilai: a1/b1 = a2/b2 · Berbalik: a1 × b1 = a2 × b2',
    summary: 'Perbandingan senilai bertambah searah. Perbandingan berbalik nilai: jika pekerja bertambah, waktu berkurang.',
    example: '4 pekerja selesai 15 hari. 6 pekerja: (4 × 15) / 6 = 10 hari.',
  },

  // KELAS VIII
  {
    title: 'Pola Bilangan & Barisan Aritmetika',
    grade: 'VIII',
    formula: 'Un = a + (n − 1)b  ·  Sn = n/2 (2a + (n − 1)b)',
    summary: 'a = suku pertama, b = beda selisih antar suku, n = nomor suku.',
    example: 'Barisan 5, 9, 13, 17... (a=5, b=4). Suku ke-10: U10 = 5 + 9(4) = 41.',
  },
  {
    title: 'Teorema Pythagoras & Tripel Pythagoras',
    grade: 'VIII',
    formula: 'c² = a² + b²  =>  c = √(a² + b²)',
    summary: 'Berlaku pada segitiga siku-siku. Tripel terkenal: (3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25).',
    example: 'Alas 9 cm, tinggi 12 cm. Sisi miring = √(9² + 12²) = √(81 + 144) = √225 = 15 cm.',
  },
  {
    title: 'Gradien & Persamaan Garis Lurus',
    grade: 'VIII',
    formula: 'm = (y2 − y1) / (x2 − x1)  ·  y − y1 = m(x − x1)',
    summary: 'Gradien m menyatakan tingkat kemiringan garis. Garis sejajar: m1 = m2. Garis tegak lurus: m1 × m2 = −1.',
    example: 'Titik (2, 3) dan (6, 11) => m = (11 − 3) / (6 − 2) = 8 / 4 = 2.',
  },
  {
    title: 'Sistem Persamaan Linear Dua Variabel (SPLDV)',
    grade: 'VIII',
    formula: 'ax + by = c  dan  dx + ey = f',
    summary: 'Selesaikan dengan metode eliminasi (menyamakan koefisien) atau substitusi.',
    example: 'x + y = 10 dan x − y = 4 => 2x = 14 => x = 7, y = 3.',
  },

  // KELAS IX
  {
    title: 'Perpangkatan & Bentuk Akar',
    grade: 'IX',
    formula: 'a^m × a^n = a^(m+n)  ·  a^m / a^n = a^(m−n)  ·  √(a²b) = a√b',
    summary: 'Pangkat nol: a⁰ = 1. Pangkat negatif: a^(−n) = 1 / a^n.',
    example: '√75 + √48 − √27 = 5√3 + 4√3 − 3√3 = 6√3.',
  },
  {
    title: 'Persamaan Kuadrat & Akar-Akar',
    grade: 'IX',
    formula: 'x = (−b ± √(b² − 4ac)) / (2a)',
    summary: 'Diskriminan D = b² − 4ac. Jika D > 0 memiliki 2 akar real berlainan.',
    example: 'x² − 5x + 6 = 0 => (x − 2)(x − 3) = 0 => x = 2 atau x = 3.',
  },
  {
    title: 'Transformasi Geometri (Refleksi & Translasi)',
    grade: 'IX',
    formula: 'Sumbu X: (x, −y) · Sumbu Y: (−x, y) · Garis y=x: (y, x)',
    summary: 'Translasi T(a, b) menggeser titik menjadi (x + a, y + b).',
    example: 'Titik (3, −4) dicerminkan terhadap sumbu X menghasilkan (3, 4).',
  },
  {
    title: 'Bangun Ruang Sisi Lengkung (Tabung, Kerucut, Bola)',
    grade: 'IX',
    formula: 'V_tabung = πr²t  ·  V_kerucut = 1/3 πr²t  ·  V_bola = 4/3 πr³',
    summary: 'Gunakan π = 22/7 untuk jari-jari kelipatan 7, atau π = 3,14.',
    example: 'Tabung r=7, t=10 => V = 22/7 × 7 × 7 × 10 = 1.540 cm³.',
  },
];

export const MateriScreen: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('ALL');

  const filtered = MATERI_LIST.filter((m) => {
    if (selectedGrade === 'ALL') return true;
    return m.grade === selectedGrade;
  });

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] p-4 sm:p-8 max-w-6xl mx-auto flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Rangkuman Rumus & Materi
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
            Buku Panduan Matematika SMP
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gunakan rangkuman rumus ini sebagai bahan belajar dan persiapan strategi sebelum bertanding di arena!
          </p>
        </div>

        {/* Grade Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {(['ALL', 'VII', 'VIII', 'IX'] as GradeLevel[]).map((g) => (
            <button
              key={g}
              onClick={() => {
                soundEngine.playClick();
                setSelectedGrade(g);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                selectedGrade === g ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {g === 'ALL' ? 'Semua' : `Kelas ${g}`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {filtered.map((topic, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-amber-400 font-sans">{topic.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                  Kelas {topic.grade}
                </span>
              </div>

              {/* Formula Badge */}
              <div className="p-3 my-2.5 rounded-xl bg-slate-950 border border-amber-500/20 font-mono text-xs text-amber-300 font-bold tracking-wide">
                {topic.formula}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {topic.summary}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/40 text-[11px] text-blue-200">
              <span className="font-bold text-blue-400 block mb-0.5">Contoh Soal & Solusi:</span>
              {topic.example}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 text-center">
        Materi disesuaikan dengan Capaian Pembelajaran Kurikulum Merdeka Matematika Fase D (SMP).
      </div>
    </div>
  );
};
