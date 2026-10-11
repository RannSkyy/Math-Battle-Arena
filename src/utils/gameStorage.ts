import { Question, MatchHistoryRecord } from '../types/game';
import { BUILT_IN_QUESTIONS } from '../data/questions';

const CUSTOM_QUESTIONS_KEY = 'mba_custom_questions';
const EDITED_BUILTIN_QUESTIONS_KEY = 'mba_edited_builtin_questions';
const DELETED_QUESTION_IDS_KEY = 'mba_deleted_question_ids';
const MATCH_HISTORY_KEY = 'mba_match_history';
const ROSTER_PRESET_KEY = 'mba_roster_preset';

export function getAllQuestions(): Question[] {
  try {
    const deletedRaw = localStorage.getItem(DELETED_QUESTION_IDS_KEY);
    const deletedIds: Set<string> = new Set(deletedRaw ? JSON.parse(deletedRaw) : []);

    const editedBuiltInRaw = localStorage.getItem(EDITED_BUILTIN_QUESTIONS_KEY);
    const editedBuiltIn: Record<string, Question> = editedBuiltInRaw ? JSON.parse(editedBuiltInRaw) : {};

    const customRaw = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
    const custom: Question[] = customRaw ? JSON.parse(customRaw) : [];

    // Map built-in questions, applying any edits and excluding deleted
    const baseBuiltIn = BUILT_IN_QUESTIONS
      .filter((q) => !deletedIds.has(q.id))
      .map((q) => editedBuiltIn[q.id] || q);

    const activeCustom = custom.filter((q) => !deletedIds.has(q.id));

    return [...baseBuiltIn, ...activeCustom];
  } catch (e) {
    console.error('Failed to load questions from storage', e);
    return BUILT_IN_QUESTIONS;
  }
}

export function saveCustomQuestion(question: Question): void {
  try {
    const raw = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
    const custom: Question[] = raw ? JSON.parse(raw) : [];
    custom.push(question);
    localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(custom));
  } catch (e) {
    console.error('Failed to save question', e);
  }
}

export function updateQuestion(updated: Question): void {
  try {
    const customRaw = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
    const custom: Question[] = customRaw ? JSON.parse(customRaw) : [];
    const customIndex = custom.findIndex((q) => q.id === updated.id);

    if (customIndex >= 0) {
      custom[customIndex] = updated;
      localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(custom));
    } else {
      // It's a built-in question
      const editedRaw = localStorage.getItem(EDITED_BUILTIN_QUESTIONS_KEY);
      const edited: Record<string, Question> = editedRaw ? JSON.parse(editedRaw) : {};
      edited[updated.id] = updated;
      localStorage.setItem(EDITED_BUILTIN_QUESTIONS_KEY, JSON.stringify(edited));
    }
  } catch (e) {
    console.error('Failed to update question', e);
  }
}

export function deleteQuestion(id: string): void {
  try {
    // Delete from custom questions if present
    const customRaw = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
    if (customRaw) {
      const custom: Question[] = JSON.parse(customRaw);
      const filtered = custom.filter((q) => q.id !== id);
      localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(filtered));
    }

    // Mark as deleted so built-in can also be removed if user wishes
    const deletedRaw = localStorage.getItem(DELETED_QUESTION_IDS_KEY);
    const deletedList: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
    if (!deletedList.includes(id)) {
      deletedList.push(id);
      localStorage.setItem(DELETED_QUESTION_IDS_KEY, JSON.stringify(deletedList));
    }
  } catch (e) {
    console.error('Failed to delete question', e);
  }
}

export function deleteCustomQuestion(id: string): void {
  deleteQuestion(id);
}

export function exportQuestionsToJson(): string {
  const all = getAllQuestions();
  return JSON.stringify(all, null, 2);
}

export function importQuestionsFromJson(jsonStr: string): { success: boolean; count: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) throw new Error('Data harus berupa array soal');
    
    // Validate basic question structure
    const validQuestions: Question[] = parsed.filter(item => 
      item.prompt && Array.isArray(item.options) && typeof item.correctAnswerIndex === 'number'
    );

    const raw = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
    const existing: Question[] = raw ? JSON.parse(raw) : [];
    
    // Merge without duplicates by ID
    const existingIds = new Set(existing.map(q => q.id));
    const toAdd = validQuestions.filter(q => !existingIds.has(q.id));
    
    const combined = [...existing, ...toAdd];
    localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(combined));

    return { success: true, count: toAdd.length };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Format JSON tidak valid';
    return { success: false, count: 0, error: message };
  }
}

export function getMatchHistory(): MatchHistoryRecord[] {
  try {
    const raw = localStorage.getItem(MATCH_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveMatchRecord(record: MatchHistoryRecord): void {
  try {
    const list = getMatchHistory();
    list.unshift(record);
    // keep up to 50 matches
    localStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(list.slice(0, 50)));
  } catch (e) {
    console.error('Failed to save match history', e);
  }
}

export function clearMatchHistory(): void {
  try {
    localStorage.removeItem(MATCH_HISTORY_KEY);
  } catch {}
}

export function deleteMatchRecord(id: string): void {
  try {
    const list = getMatchHistory();
    const filtered = list.filter((item) => item.id !== id);
    localStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete match record', e);
  }
}

export function deleteMultipleMatchRecords(ids: string[]): void {
  try {
    const idSet = new Set(ids);
    const list = getMatchHistory();
    const filtered = list.filter((item) => !idSet.has(item.id));
    localStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete match records', e);
  }
}

export function saveRosterPreset(team: 'A' | 'B', roster: string[]): void {
  try {
    localStorage.setItem(`${ROSTER_PRESET_KEY}_${team}`, JSON.stringify(roster));
  } catch {}
}

export function getRosterPreset(team: 'A' | 'B'): string[] | null {
  try {
    const raw = localStorage.getItem(`${ROSTER_PRESET_KEY}_${team}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function downloadMatchCsv(record: MatchHistoryRecord): void {
  const headers = ['ID', 'Tanggal', 'Arena', 'Kelas', 'Pemenang', 'Karakter', 'Skor Team A', 'Skor Team B', 'Nama Team A', 'Nama Team B', 'Total Soal', 'Akurasi A (%)', 'Akurasi B (%)', 'MVP Siswa', 'Durasi (Menit)'];
  const row = [
    record.id,
    record.date,
    record.arenaName,
    record.grade,
    record.winnerTeam,
    record.winnerCharacter,
    record.scoreA,
    record.scoreB,
    `"${record.teamAName}"`,
    `"${record.teamBName}"`,
    record.totalQuestions,
    record.accuracyA,
    record.accuracyB,
    `"${record.mvpPlayer}"`,
    record.durationMinutes,
  ];

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), row.join(',')].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `math_battle_${record.id}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
