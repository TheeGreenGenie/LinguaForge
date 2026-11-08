# Contributing to LinguaForge

Thank you for helping! LinguaForge teaches reading and writing in Portuguese, Yorùbá, Mandarin, Spanish and French. Most of its lessons were written by one person with AI help and are marked **unverified**. The most valuable thing you can give is a native speaker's eye.

You do **not** need to know how to code to contribute.

## Ways to help

### 1. Fix content from your phone (no coding)

If you speak one of the languages well:

1. Install the app (see the [README](README.md)) and study as normal.
2. When something is wrong (a tone mark, a translation, an unnatural sentence, a register mistake), tap **✎ Fix this** and correct it. The app uses your fix straight away.
3. When you have a few fixes, go to **Settings → Help improve LinguaForge**:
   - **Export my corrections** saves a CSV file.
   - **Send them on GitHub** opens a pre-filled issue. Attach the CSV.

A maintainer merges the fixes into the bundled lessons, so every learner gets them.

### 2. Review a whole language (no coding)

**Settings → Export native-speaker review sheet** produces a CSV of everything written for the app (not taken from a checked corpus) in the current language. Mark each row OK or give the fix, then attach it to a [Content correction issue](../../issues/new?template=content-correction.yml). Reviewed items are switched to `verified: true` with your name in the credits, if you'd like.

Yorùbá reviewers are especially welcome. The tone marks, the respect system (ẹ/o, wọ́n) and the grammatical-tone lessons most need expert review.

### 3. Report bugs or suggest features

Use the [issue templates](../../issues/new/choose). Include your phone model and iOS version for app bugs.

### 4. Write code or lessons

See below.

## Development setup

Requires Node 22 or later.

```bash
git clone https://github.com/<you>/<fork>.git
cd <fork>
npm install
npm run dev           # http://localhost:5173
npm test              # unit tests (Vitest)
npx tsc --noEmit      # type check
npx playwright install webkit && npx playwright test   # end-to-end, iPhone emulation
```

The built language packs are committed in `public/packs/`, so you don't need the large raw data to work on the app. To rebuild packs, download the raw data listed in the README and run `npm run build:packs`.

### Project map

| Folder | What's in it |
|---|---|
| `content/` | Hand-written lessons. `yo.ts`, `zh.ts`, `romance.ts` hold Level 0 and core material. `lessons/<lang>.ts` hold Levels 1–5. |
| `src/lang/` | Tone- and accent-aware text comparison, pinyin, Yorùbá input, IPA respelling |
| `src/srs/` | FSRS scheduling and session building |
| `src/exercises/`, `src/screens/`, `src/ui/` | Preact UI |
| `src/data/` | IndexedDB (Dexie), packs, the corrections overlay, backups |
| `src/progress/` | Levels, coverage, chrF grading, optional AI grading |
| `tools/` | Node scripts that build packs, audio and icons |
| `ROADMAP.md` | The design, the research behind it and the open-items checklist |

### Writing lessons

Lessons are TypeScript objects built with the helpers in `content/helpers.ts`. Look at an existing lesson in `content/lessons/` and copy its shape. Rules:

- **Tone marks and diacritics are never optional.** Yorùbá text needs full tone marks and underdots. Chinese needs tone-marked pinyin. `npm test` checks that every typed-answer exercise grades correctly under strict rules.
- **Say where facts come from** in the lesson's `sources`. Wiktionary, MENYO-20k, UD treebanks or a published grammar (checked against, not copied).
- **Never copy copyrighted text** from textbooks, courses or websites (see [LICENSES.md](LICENSES.md)).
- New authored items stay `verified: false` until a second native speaker checks them. Don't mark your own writing as verified.
- Follow the method: frequency order, short explanations and plenty of retrieval practice (Paul Nation's Four Strands).

### Adding a language

Open an issue first so we can agree on the data sources. Usually you need: a kaikki.org dictionary or similar, a frequency list, a sentence corpus with English translations, Level 0 script and sound lessons, a `SPEECH_LOCALE` entry in `src/data/types.ts`, an IPA respelling table in `src/lang/respell.ts` and a pack entry in `tools/build-packs.ts`.

## Pull requests

1. Fork the repository, then create a branch from `main`.
2. Keep each pull request focused on one thing.
3. Run `npx tsc --noEmit` and `npm test`. CI runs both on every pull request.
4. Explain *why* in the description. For content changes, give your source or say you're a native speaker.
5. A maintainer reviews it. Small fixes are usually merged quickly.

Merged changes to `main` are deployed automatically. Learners see "Update available" next time they open the app online.

## Code of conduct

Everyone is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Be patient with learners. Correcting a language is not correcting a person.
