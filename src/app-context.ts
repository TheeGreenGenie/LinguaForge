import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import type { LangData, Settings } from './data/repo';
import type { LangCode } from './data/types';

export type Screen =
  | { name: 'home' }
  | { name: 'learn' }
  | { name: 'lesson'; id: string }
  | { name: 'session' }
  | { name: 'read' }
  | { name: 'passage'; id: string; fluency?: boolean }
  | { name: 'progress' }
  | { name: 'exam'; level: number }
  | { name: 'certify' }
  | { name: 'settings' }
  | { name: 'corrections' }
  | { name: 'setup' };

export interface AppCtx {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => Promise<void>;
  lang: LangCode | null;
  data: LangData | null;
  reload: () => Promise<void>;
  go: (s: Screen) => void;
  toast: (msg: string) => void;
}

export const Ctx = createContext<AppCtx>(null as unknown as AppCtx);
export const useApp = () => useContext(Ctx);
