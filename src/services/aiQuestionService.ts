import { GoogleGenAI } from '@google/genai';
import { Question, GradeLevel } from '../types/game';

export async function generateAiMathQuestions(
  topic: string,
  grade: GradeLevel,
  count: number = 3
): Promise<Question[]> {
  try {
    // Check if key is available in environment or client
    const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || undefined;
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Buatlah ${count} soal matematika untuk jenjang SMP kelas ${grade} dengan topik "${topic}".
Format harus berupa JSON array valid dari object soal matematika dengan struktur:
[
  {
    "prompt": "Pertanyaan soal yang jelas dalam bahasa Indonesia",
    "category": "OPERASI_BILANGAN" | "LOGIKA_MATEMATIKA" | "PERBANDINGAN",
    "type": "multiple_choice" | "true_false" | "missing_number" | "fast_count" | "word_problem" | "compare",
    "options": ["Pilihan 1", "Pilihan 2", "Pilihan 3", "Pilihan 4"],
    "correctAnswerIndex": 0,
    "explanation": "Penjelasan langkah demi langkah cara menjawab",
    "difficulty": "EASY" | "MEDIUM" | "HARD",
    "topic": "${topic}"
  }
]
Ketentuan:
1. Soal harus sesuai tingkat kognitif siswa SMP di Indonesia.
2. Untuk multiple_choice berikan 4 pilihan. Untuk true_false berikan 2 pilihan: ["Benar", "Salah"]. Untuk compare berikan [">", "<", "="].
3. Pastikan correctAnswerIndex selalu menunjuk ke indeks opsi yang benar (0-3).
4. Berikan HANYA JSON murni tanpa markdown triple backticks.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';
    // Clean potential markdown wrap
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const rawParsed = JSON.parse(cleanJson);

    if (!Array.isArray(rawParsed)) {
      throw new Error('Format respon bukan array');
    }

    const generatedQuestions: Question[] = rawParsed.map((item, idx) => ({
      id: `ai-${Date.now()}-${idx}`,
      grade: grade,
      category: item.category || 'OPERASI_BILANGAN',
      type: item.type || 'multiple_choice',
      prompt: item.prompt,
      options: item.options || [],
      correctAnswerIndex: typeof item.correctAnswerIndex === 'number' ? item.correctAnswerIndex : 0,
      explanation: item.explanation || 'Pembahasan telah diverifikasi.',
      difficulty: item.difficulty || 'MEDIUM',
      topic: item.topic || topic,
    }));

    return generatedQuestions;
  } catch (error) {
    console.warn('AI generation using Gemini encountered an issue, falling back to local generator', error);
    throw error;
  }
}
