// Optional AI grading of long translations (Certified Mastery / level exams).
// Runs only when the learner is online and has entered their own Claude API key.
// The key stays on the phone; only the exam text is sent.
import type { LangCode } from '../data/types';
import { LANG_NAMES } from '../data/types';

export interface AiGrade {
  score: number; // 0..100
  passed: boolean;
  accuracy: number;
  grammar: number;
  orthography: number; // tone marks / accents / characters
  register: number;
  summary: string;
  errors: { quote: string; problem: string; fix: string }[];
}

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['score', 'accuracy', 'grammar', 'orthography', 'register', 'summary', 'errors'],
  properties: {
    score: { type: 'integer', description: 'Overall 0-100' },
    accuracy: { type: 'integer', description: 'Meaning preserved, nothing omitted or added, 0-100' },
    grammar: { type: 'integer', description: '0-100' },
    orthography: { type: 'integer', description: 'Spelling, accents, Yoruba tone marks and underdots, correct Chinese characters, 0-100' },
    register: { type: 'integer', description: 'Formality / honorifics appropriate to the passage, 0-100' },
    summary: { type: 'string', description: 'Two or three sentences of feedback for the learner' },
    errors: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['quote', 'problem', 'fix'],
        properties: { quote: { type: 'string' }, problem: { type: 'string' }, fix: { type: 'string' } },
      },
    },
  },
} as const;

export async function gradeWithAi(opts: {
  apiKey: string;
  model: string;
  lang: LangCode;
  direction: 'to-english' | 'to-target';
  source: string;
  reference: string;
  learner: string;
  passMark: number;
}): Promise<AiGrade> {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey: opts.apiKey, dangerouslyAllowBrowser: true });
  const langName = LANG_NAMES[opts.lang];
  const targetName = opts.direction === 'to-english' ? 'English' : langName;
  const system =
    `You are a strict, fair examiner certifying reading and writing mastery in ${langName}. ` +
    `Grade the learner's translation into ${targetName}. A reference translation is provided as one acceptable version; other wordings are fine if the meaning is fully preserved. ` +
    (opts.lang === 'yo' ? 'For Yoruba, every tone mark and underdot matters: a wrong or missing mark is an orthography error, and using familiar forms (o, ó, rẹ) where respect forms (ẹ, wọ́n, yín) are required is a register error. ' : '') +
    (opts.lang === 'zh' ? 'For Chinese, judge characters (Simplified); wrong characters with the same sound are orthography errors. ' : '') +
    'Every sentence of the source must be translated: omissions reduce accuracy heavily. Quote specific mistakes. Respond only with the JSON object.';
  const user = `SOURCE TEXT:\n${opts.source}\n\nREFERENCE TRANSLATION:\n${opts.reference}\n\nLEARNER'S TRANSLATION:\n${opts.learner}`;

  const response = await client.beta.messages.create({
    model: opts.model || 'claude-opus-5-5',
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'high', format: { type: 'json_schema', schema: SCHEMA as unknown as Record<string, unknown> } },
    system,
    messages: [{ role: 'user', content: user }],
  } as any);

  if (response.stop_reason === 'refusal') throw new Error('The AI grader declined this request. Your result will be marked self-verified.');
  if (response.stop_reason === 'max_tokens') throw new Error('The AI grader’s answer was cut off. Please try again.');
  const text = (response.content as any[]).filter((b) => b.type === 'text').map((b) => b.text).join('');
  const parsed = JSON.parse(text) as Omit<AiGrade, 'passed'>;
  return { ...parsed, passed: parsed.score >= opts.passMark };
}

export function aiErrorMessage(e: unknown): string {
  const anyE = e as { status?: number; message?: string };
  if (anyE?.status === 401) return 'Your API key was rejected. Check it in Settings.';
  if (anyE?.status === 429) return 'Rate limited. Try again in a minute.';
  if (typeof navigator !== 'undefined' && !navigator.onLine) return 'You’re offline. AI grading needs internet.';
  return anyE?.message ?? 'AI grading failed.';
}
