import { test, expect, type Page } from '@playwright/test';

async function setupYoruba(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Yorùbá' }).click();
  await expect(page.getByRole('button', { name: /Study now/ })).toBeVisible({ timeout: 60_000 });
}

test('first run → Yoruba tone lesson with tone-aware grading', async ({ page }) => {
  await setupYoruba(page);
  await page.getByRole('button', { name: 'Lessons', exact: true }).first().click();
  await page.getByRole('button', { name: /The three tones/ }).click();
  await expect(page.getByText('three level tones')).toBeVisible();
  await page.getByRole('button', { name: /Practice/ }).click();
  // first exercise: tone pattern of ọkọ̀ → mid-low; a native recording is offered
  await expect(page.getByText('Native speaker, in a sentence:')).toBeVisible();
  const clip = page.locator('.pron button', { hasText: /Ọkọ̀/ }).first();
  await expect(clip).toBeVisible();
  // the referenced audio file is actually served (and therefore cached for offline use)
  const pack = await (await page.request.get('/packs/yo.json')).json();
  const src = pack.words.find((w: any) => w.lemma === 'ọkọ̀'.normalize('NFC')).clips[0].src;
  expect((await page.request.get(src.replace('./', '/'))).ok()).toBeTruthy();
  await page.getByRole('button', { name: 'mid-low', exact: true }).click();
  await expect(page.getByText('Correct!')).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();
  // second: ọkọ́ → choose wrong answer → tone error message
  await page.getByRole('button', { name: 'mid-low', exact: true }).click();
  await expect(page.getByText(/wrong tone/)).toBeVisible();
  await page.screenshot({ path: 'e2e/out/lesson.png' });
});

test('study session, ✎ Fix this accept-my-answer, corrections list', async ({ page }) => {
  await setupYoruba(page);
  await page.getByRole('button', { name: /Study now/ }).click();
  await expect(page.getByText('New word')).toBeVisible();
  await page.screenshot({ path: 'e2e/out/intro.png' });
  await page.getByRole('button', { name: 'Got it' }).click();
  // answer whatever comes until a typed/MC question appears; pick first option if MC
  for (let i = 0; i < 6; i++) {
    if (await page.getByRole('button', { name: 'Got it' }).isVisible()) { await page.getByRole('button', { name: 'Got it' }).click(); continue; }
    const opts = page.locator('.options button');
    if (await opts.count()) { await opts.first().click(); break; }
  }
  await page.getByRole('button', { name: /Fix this/ }).click();
  await expect(page.getByRole('dialog', { name: 'Fix this' })).toBeVisible();
  await page.screenshot({ path: 'e2e/out/fix.png' });
  const accept = page.getByRole('button', { name: /was right: accept it|should NOT be accepted/ });
  await accept.click();
  await page.getByRole('button', { name: 'Quit session' }).click();
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: /My corrections/ }).click();
  await expect(page.locator('.pill', { hasText: /accept|reject/ }).first()).toBeVisible();
});

test('settings, progress, read screens render', async ({ page }) => {
  await setupYoruba(page);
  await page.getByRole('button', { name: 'Progress' }).click();
  await expect(page.getByText('Mastery path')).toBeVisible();
  await page.screenshot({ path: 'e2e/out/progress.png', fullPage: true });
  await page.getByRole('button', { name: 'Read', exact: true }).last().click();
  await expect(page.getByRole('heading', { name: 'Read' })).toBeVisible();
  await page.locator('main .card').first().click();
  await expect(page.getByRole('button', { name: "I've read it" })).toBeVisible();
  await page.screenshot({ path: 'e2e/out/passage.png' });
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByText('AI grading (optional)')).toBeVisible();
});

test('works offline after the first visit (service worker + IndexedDB)', async ({ page, context }) => {
  await setupYoruba(page);
  const hasSW = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false;
    await navigator.serviceWorker.ready;
    // wait until the precache has finished installing
    for (let i = 0; i < 40 && !navigator.serviceWorker.controller; i++) await new Promise((r) => setTimeout(r, 250));
    return true;
  });
  test.skip(!hasSW, 'Service workers unavailable in this browser build');
  await page.reload(); // ensure the page is controlled by the SW
  await expect(page.getByRole('button', { name: /Study now/ })).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('button', { name: /Study now/ })).toBeVisible({ timeout: 20_000 });
  await page.getByRole('button', { name: 'Lessons', exact: true }).first().click();
  await expect(page.getByText('The three tones')).toBeVisible();
});

test('every language pack installs and its first lesson opens', async ({ page }) => {
  test.setTimeout(240_000);
  const NAMES: Record<string, string> = { zh: 'Mandarin Chinese', es: 'Spanish', fr: 'French', pt: 'Portuguese (Brazil)', yo: 'Yorùbá' };
  await page.goto('/');
  await page.getByRole('button', { name: 'Mandarin Chinese' }).click();
  await expect(page.getByRole('button', { name: /Study now/ })).toBeVisible({ timeout: 60_000 });
  for (const [code, title] of [['zh', 'The four tones'], ['es', 'Spanish letters and sounds'], ['fr', 'French letters and sounds'], ['pt', 'Portuguese letters and sounds'], ['yo', 'The Yorùbá alphabet']] as const) {
    await page.getByRole('button', { name: 'Home' }).click();
    await page.getByLabel('Switch language').selectOption(code);
    await expect(page.getByRole('heading', { name: NAMES[code], level: 1 })).toBeVisible({ timeout: 60_000 });
    await page.getByRole('button', { name: 'Lessons', exact: true }).first().click();
    await page.getByRole('button', { name: new RegExp(title) }).click();
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  }
});
