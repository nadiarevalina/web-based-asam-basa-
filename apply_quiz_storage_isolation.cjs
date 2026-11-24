const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'services', 'quizStorage.ts');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Update imports to include getCurrentUser
if (!code.includes('getCurrentUser')) {
  code = code.replace(
    "import { addQuizExperimentRecord } from './authStorage'",
    "import { addQuizExperimentRecord, getCurrentUser } from './authStorage'"
  );
}

// 2. Add dynamic storage key functions
const keyDefs = `const DRAFT_STORAGE_KEY = 'asambasa_quiz_m1_draft_v2'
const HISTORY_STORAGE_KEY = 'asambasa_quiz_m1_history_v2'

export function getQuizDraftKey(userId?: string): string {
  const uid = userId || getCurrentUser()?.id
  return uid ? \`asambasa_quiz_m1_draft_v2_\${uid}\` : DRAFT_STORAGE_KEY
}

export function getQuizHistoryKey(userId?: string): string {
  const uid = userId || getCurrentUser()?.id
  return uid ? \`asambasa_quiz_m1_history_v2_\${uid}\` : HISTORY_STORAGE_KEY
}`;

code = code.replace(
  `const DRAFT_STORAGE_KEY = 'asambasa_quiz_m1_draft_v2'\nconst HISTORY_STORAGE_KEY = 'asambasa_quiz_m1_history_v2'`,
  keyDefs
);

// 3. Update loadQuizDraft signature and implementation
code = code.replace(
  `export function loadQuizDraft(questions: (QuizQuestion | Module1QuizQuestion)[]): {`,
  `export function loadQuizDraft(
  questions: (QuizQuestion | Module1QuizQuestion)[],
  userId?: string,
): {`
);
code = code.replace(
  `const raw = readRawStorage(DRAFT_STORAGE_KEY)`,
  `const raw = readRawStorage(getQuizDraftKey(userId))`
);

// 4. Update saveQuizDraft signature and implementation
code = code.replace(
  `export function saveQuizDraft(draft: QuizDraftSession): { success: boolean; error: string | null } {`,
  `export function saveQuizDraft(
  draft: QuizDraftSession,
  userId?: string,
): { success: boolean; error: string | null } {`
);
code = code.replace(
  `return writeRawStorage(DRAFT_STORAGE_KEY, serialized)`,
  `return writeRawStorage(getQuizDraftKey(userId), serialized)`
);

// 5. Update resetQuizDraft signature and implementation
code = code.replace(
  `export function resetQuizDraft(questions: (QuizQuestion | Module1QuizQuestion)[]): {`,
  `export function resetQuizDraft(
  questions: (QuizQuestion | Module1QuizQuestion)[],
  userId?: string,
): {`
);
code = code.replace(
  `const removeRes = removeRawStorage(DRAFT_STORAGE_KEY)\n  const freshDraft = createInitialDraft(questions)\n  const saveRes = saveQuizDraft(freshDraft)`,
  `const removeRes = removeRawStorage(getQuizDraftKey(userId))\n  const freshDraft = createInitialDraft(questions)\n  const saveRes = saveQuizDraft(freshDraft, userId)`
);

// 6. Update loadQuizHistory signature and implementation
code = code.replace(
  `export function loadQuizHistory(): {`,
  `export function loadQuizHistory(userId?: string): {`
);
code = code.replace(
  `const raw = readRawStorage(HISTORY_STORAGE_KEY)`,
  `const raw = readRawStorage(getQuizHistoryKey(userId))`
);

// 7. Update saveCompletedAttempt signature and implementation
code = code.replace(
  `export function saveCompletedAttempt(attempt: QuizAttemptHistory): {`,
  `export function saveCompletedAttempt(
  attempt: QuizAttemptHistory,
  userId?: string,
): {`
);
code = code.replace(
  `const { history } = loadQuizHistory()`,
  `const { history } = loadQuizHistory(userId)`
);
code = code.replace(
  `const writeRes = writeRawStorage(HISTORY_STORAGE_KEY, serialized)`,
  `const writeRes = writeRawStorage(getQuizHistoryKey(userId), serialized)`
);
code = code.replace(
  `removeRawStorage(DRAFT_STORAGE_KEY)`,
  `removeRawStorage(getQuizDraftKey(userId))`
);

// 8. Update clearQuizHistory signature and implementation
code = code.replace(
  `export function clearQuizHistory(): { success: boolean; error: string | null } {\n  return removeRawStorage(HISTORY_STORAGE_KEY)\n}`,
  `export function clearQuizHistory(userId?: string): { success: boolean; error: string | null } {\n  return removeRawStorage(getQuizHistoryKey(userId))\n}`
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully updated src/services/quizStorage.ts with user isolation keys');
