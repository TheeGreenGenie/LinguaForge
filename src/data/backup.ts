// Progress backup: export to a file (save to Files / iCloud Drive) and restore.
import { db } from './db';

const TABLES = ['cards', 'reviews', 'corrections', 'days', 'lessonProgress', 'certs', 'meta'] as const;

export async function exportBackup(): Promise<Blob> {
  const out: Record<string, unknown> = { app: 'linguaforge', version: 1, exportedAt: new Date().toISOString() };
  for (const t of TABLES) {
    let rows = await (db as any)[t].toArray();
    if (t === 'meta') rows = rows.map((r: any) => (r.key === 'settings' ? { ...r, value: { ...r.value, apiKey: '' } } : r));
    out[t] = rows;
  }
  return new Blob([JSON.stringify(out)], { type: 'application/json' });
}

export async function importBackup(file: File): Promise<{ cards: number; corrections: number }> {
  const data = JSON.parse(await file.text());
  if (data?.app !== 'linguaforge') throw new Error('This is not a LinguaForge backup file.');
  const keep = (await db.meta.get('settings'))?.value as { apiKey?: string } | undefined;
  await db.transaction('rw', TABLES.map((t) => (db as any)[t]), async () => {
    for (const t of TABLES) {
      await (db as any)[t].clear();
      if (Array.isArray(data[t])) await (db as any)[t].bulkPut(data[t]);
    }
  });
  // keep the API key that is on this phone (it is never written to backups)
  if (keep?.apiKey) {
    const s = (await db.meta.get('settings'))?.value as Record<string, unknown> | undefined;
    await db.meta.put({ key: 'settings', value: { ...(s ?? {}), apiKey: keep.apiKey } });
  }
  await db.meta.put({ key: 'lastBackup', value: Date.now() });
  return { cards: data.cards?.length ?? 0, corrections: data.corrections?.length ?? 0 };
}

/** Save or share a file. On iPhone the share sheet offers "Save to Files". */
export async function saveFile(blob: Blob, name: string): Promise<void> {
  const file = new File([blob], name, { type: blob.type });
  const nav = navigator as Navigator & { canShare?: (d: unknown) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try { await nav.share({ files: [file], title: name }); return; } catch (e) { if ((e as Error).name === 'AbortError') return; }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
