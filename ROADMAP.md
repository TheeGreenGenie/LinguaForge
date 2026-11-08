# LinguaForge — Dictionary-Driven Language Learning App (Plan)

## Context
You want a self-built, offline-capable app that takes a dictionary file and uses it to teach **reading and writing** (not speaking) in Portuguese, Yoruba, Mandarin Chinese, Spanish and French. It should be built with Node, transferred to your **iPhone**, used entirely there, track mastery levels, and include Duolingo-style accountability. The final mastery level requires translating 2–3 paragraph passages in both directions, with every word covered, before you are certified.

The project folder `C:\Users\sgama\Desktop\languageLearn` is empty (Node v23.11 installed), so this is a new build. On approval, this plan is copied into the project as `ROADMAP.md`. The checkboxes in Part 6 are what I'll tick off as work is done.

---

## Part 1 — Is this realistic? (read before we start)

**Yes, with five honest caveats, all addressed in this plan:**

1. **A dictionary alone cannot teach a language.** It gives words, not grammar, sentences or passages. The app also needs (a) free sentence/passage corpora and (b) hand-written grammar, tone, script and register lessons. I'll write those lessons. The Yoruba material in particular **should be checked by a native speaker** before you trust it fully.
2. **Fully offline grading of paragraph translations isn't reliable.** You chose the hybrid approach. Offline, the app checks word coverage, scores similarity to a reference translation and runs a line-by-line self-grade. Optional Claude-API grading runs when you're online with your own key.
3. **Yoruba has far fewer free resources, but enough reliable ones exist (see §2.5).** The Wiktionary Yoruba dictionary has only ~4,900 headwords, mostly nouns, so it is supplemented with corpora and course material. iPhone has **no Yoruba text-to-speech voice**, so audio comes from **real native-speaker recordings**: Google's OpenSLR-86 corpus and the public-domain FSI tone drills. Where no recording exists, the app falls back to visual tone contours + IPA + respelling. The Yoruba "Certified Mastery" vocabulary target is capped by what the corpora contain.
4. **iPhone can't run Node or install sideloaded apps.** Node is only the *build* tool on the PC. The output is an offline web app (PWA) hosted free on GitHub Pages. You open the link once in Safari, tap *Add to Home Screen*, and from then on it runs offline like an app. (A PWA's offline engine needs HTTPS, so serving straight from your PC over Wi-Fi won't work.) **After that one install, the phone never needs your PC** (see Part 4 "Phone-only after install").
5. **iOS can't schedule local reminder notifications offline.** Workaround: the app exports a recurring daily reminder to your iPhone Calendar (.ics file), and the home-screen icon shows a badge with the number of reviews due.

---

## Part 2 — Research findings

### 2.1 Guiding expert: Paul Nation (Victoria University of Wellington)
Nation is the most-cited researcher on vocabulary acquisition and reading in a second language, which matches your read/write goal. His framework shapes the app:

| Nation principle | How the app applies it |
|---|---|
| **Four Strands**: balance meaning-focused input, meaning-focused output, language-focused study and fluency practice (~25% each) | Each daily session mixes reading (input), translating/writing (output), drills on tones/script/grammar (language-focused), and timed reading of already-known material (fluency). |
| **Learn by frequency**: the most frequent ~2,000 word families cover ~80–90% of most texts | Vocabulary is introduced in frequency order, not alphabetically or by topic. |
| **98% coverage for unassisted reading** (~8,000–9,000 word families for written text) | Mastery levels are defined by vocabulary coverage targets. The final level needs coverage of every word in the exam passages. |
| **Learning burden**: words that resemble ones you know are cheaper to learn | Cognates (e.g., French *nation*) are flagged and fast-tracked. Unfamiliar sounds and tones get extra drilling. |
| **Retrieval beats re-reading; spacing beats cramming** | Every item is scheduled with **FSRS**, a modern open-source spaced-repetition algorithm built on Wozniak's SuperMemo research and used in Anki. |

Supporting ideas: Krashen's *comprehensible input* (reading passages are kept at ~95%+ known words, i+1) and pronunciation-first study for tonal languages (script and tones are a gate before vocabulary, per Gabriel Wyner's *Fluent Forever*).

### 2.2 Dictionary format recommendation
**Primary: Wiktextract JSONL from kaikki.org.** It's free, has a ready download for every target language (Portuguese, Yoruba, Chinese, Spanish, French), and has one JSON object per line, so a large file can be streamed line by line. It includes headword, part of speech, English glosses, **IPA pronunciation**, inflected forms, example sentences and sometimes register tags ("formal", "informal", "honorific").

Also supported:
- **CC-CEDICT** (Chinese): the standard free Chinese–English dictionary, simple text lines `傳統 传统 [chuan2 tong3] /tradition/`. Gives simplified/traditional characters and pinyin tones.
- **Simple CSV/TSV template** for your own word lists: `word, translation, pos, ipa, register, notes`.

**Why not PDF/StarDict/XDXF?** PDFs can't be reliably parsed. StarDict is binary and inconsistent across sources. JSONL and CSV are trivial to parse.

### 2.3 Other free data sources

| Need | Source | License |
|---|---|---|
| Word frequency (pt/es/fr/zh) | hermitdave *FrequencyWords* (OpenSubtitles) | MIT / CC-BY-SA |
| Yoruba frequency | Counted from Yoruba corpora below | — |
| Sentences | **Tatoeba** (strong pt/es/fr/zh, thin Yoruba) | CC-BY 2.0 FR |
| Multi-sentence passages, **all 5 languages + English** | **FLORES-200** (consecutive sentences from Wikinews/Wikivoyage articles, so they form paragraphs) | CC-BY-SA 4.0 |
| Yoruba–English with correct tone marks | **MENYO-20k** | CC-BY-NC 4.0 (personal use OK) |
| Chinese stroke order + writing quiz | **hanzi-writer** + Make Me a Hanzi data | MIT / LGPL |
| Chinese word segmentation | `Intl.Segmenter` (built into Safari) on the phone, `jieba` at build time | — |
| Audio | iOS built-in speech (pt, es, fr, zh voices), Wikimedia Commons / Lingua Libre recordings for some Yoruba words | CC |

### 2.4 Language-specific requirements (your watch-outs)

**Tones (strict, never skipped)**
- *Mandarin:* 4 tones + neutral. Pinyin always shown with tone marks. Drills cover tone identification, tone pairs (all 20 combinations) and tone sandhi (3-3 → 2-3, 不 bù/bú, 一 yī/yí/yì). Typed answers accept tone marks or numbers (`ma3`). **A wrong tone is a wrong answer**, logged as its own error type: "right syllable, wrong tone".
- *Yoruba:* 3 tones: high (á), mid (unmarked), low (à). Underdots (ẹ ọ ṣ) are separate letters. Minimal-pair drills: *ọkọ́* hoe / *ọkọ̀* vehicle / *ọkọ* husband; *igbá* calabash / *igba* two hundred. Grading compares text after Unicode decomposition (NFD), so stacked marks like **ẹ́** compare correctly. A missing or wrong tone mark is wrong.

**Alphabet/script module (all languages, Level 0, gated)**
- Spanish/French/Portuguese: alphabet, accented letters (é è ê ç ñ ã õ …), letter–sound rules, silent letters (French).
- Yoruba: 25-letter alphabet (no c q v x z; includes **gb**, ẹ, ọ, ṣ), tone marking, nasal vowels (an, ẹn, in, ọn, un).
- Chinese: pinyin initials/finals, tone marks, ~50 core radicals, stroke rules and stroke-order drills. Characters are taught alongside words.

**Pronunciation in every test item**
Each word shows three layers:
1. **Official:** IPA (from Wiktionary). For Chinese also **pinyin**, the official romanization. For Yoruba the standard tone-marked spelling.
2. **English-style respelling**, generated from the IPA by per-language mapping tables, e.g. French *merci* /mɛʁ.si/ → "mair-SEE", Spanish *gracias* /ˈɡɾa.sjas/ → "GRAH-syahs", Yoruba *ọmọ* /ɔ̄.mɔ̄/ → "aw-maw (mid-mid)", Mandarin *妈* mā → "mah (high flat)".
3. **Audio button** where a voice or recording exists.

**Register / formality (built for all languages, deepest for Yoruba)**
- Yoruba respect system: **ẹ** (respectful/plural you) vs **o** (familiar you); honorific **wọn** for elders in the 3rd person; greetings *Ẹ káàárọ̀* (to elders) vs *Káàárọ̀* (to peers). Using the familiar form toward an elder is treated as an error, not a style choice.
- Also: French tu/vous, Spanish tú/usted, Portuguese você/o senhor (+ tu), Mandarin 你/您.
- Every lesson sentence and exercise carries a register tag (`formal | casual | honorific | neutral`). Exercises set a scene ("You're greeting your friend's grandmother") and require the correct form.

### 2.5 Yoruba deep dive — reliable sources and what the app takes from each

**Source reliability ladder** (the app prefers higher rows when sources conflict):

| Tier | Source | What we use it for | License / caveat |
|---|---|---|---|
| A | **FSI *Yoruba Basic Course*** (US Foreign Service Institute; ~380 pp + ~279 audio files, incl. *Tone Drills*) | Lesson sequence, tone drills, dialogues, **native audio for tone drills** | US government work → **public domain**. Download from the Live Lingua archive. 1960s, so some vocabulary is dated. |
| A | **MENYO-20k** (20,100 English–Yoruba sentence pairs; translations and **diacritics checked by professional translators and native speakers**) | Main source of Yoruba sentences, passages, frequency counts and translation-exam references | CC BY-NC 4.0 (fine for a personal, non-commercial app) |
| A | **OpenSLR-86** (Google; native volunteers reading tone-marked sentences; manually checked) | **Real recorded audio** for sentences + their tone-marked transcripts | CC BY-SA 4.0 |
| A | **Universal Dependencies Yoruba treebank (YTB)** | Lemmas, parts of speech, grammar examples for the lemma-coverage check | CC BY-SA 4.0 |
| B | **kaikki.org Yoruba** (Wiktionary; ~4,900 headwords, 10.7 MB JSONL) | Dictionary glosses, some IPA, register tags | CC BY-SA. Thin on function words. |
| B | **ÌròyìnSpeech** (news speech corpus) | Extra audio/sentences if OpenSLR coverage is thin | CC BY 4.0 |
| B | **FLORES-200 Yoruba** | Extra multi-paragraph passages | CC BY-SA. **No published Yoruba quality audit**, so passages must pass a diacritic validator (below) before use. |
| Ref | **Yorùbá Yé Mi** (Mosádomi, UT Austin/COERLL, 2012) | *Reference only* for curriculum order and cultural notes (greetings, respect). | CC BY-NC-**ND**: no derivatives allowed, so **link to it, don't copy it**. |
| Ref | Bamgbọ́ṣé *A Grammar of Yorùbá*; Awobuluyi *Essentials of Yorùbá Grammar*; Abraham *Dictionary of Modern Yoruba* | Checking grammar claims I write | Copyrighted. Used only to fact-check, never copied. |
| ✗ | Blogs/phrasebook sites | Not used as sources | Inconsistent tone marking |

**Diacritic validator (build step):** any Yoruba sentence whose vowels are mostly unmarked, or which uses non-standard characters, is excluded or flagged. Only text with full tone marks and underdots enters lessons and exams.

**Tone curriculum (Level 0 Yoruba)**
1. Three level tones: high **´**, mid (**unmarked** by convention), low **`**. Every syllable carries a tone.
2. Syllable types: V, CV, and **syllabic nasal** (N), which also carries tone: ń, ǹ, and mid written **n̄**. This is the one place mid tone *is* marked.
3. Gliding tones written on doubled vowels (e.g., *káàárọ̀*).
4. Minimal sets: **ọkọ** husband / **ọkọ́** hoe / **ọkọ̀** vehicle; **igbá** calabash / **igba** 200 / **ìgbà** time / **ìgbá** garden egg; **èdè** language / **edé** crayfish (from MENYO's paper).
5. Grammatical tone: 3rd-person subject **ó** is high; the high-tone syllable after a noun subject (*Adé ́ lọ* → pronounced *Adé é lọ*); negation **kò** and its contraction (*o kò lọ* → *o ò lọ*).
6. Vowel elision/assimilation in natural writing (e.g., *ra ẹja* → *rẹja*), introduced at B1 for reading, with the tone that survives explained. (Downstep is taught as reading awareness only.)
7. Each tone exercise has native audio when an FSI/OpenSLR clip exists, plus a pitch-contour graphic always.

**Orthography:** Standard Nigerian Yoruba orthography. 25 letters: a b d e ẹ f g gb h i j k l m n o ọ p r s ṣ t u w y. Nasal vowels an/ẹn/in/ọn/un. **Input leniency:** typing Benin-Republic style (ɛ, ɔ, sh) or e./o./s. shortcuts is converted to ẹ ọ ṣ automatically. Output is always Nigerian standard.

**Respect / formality system (taught as grammar, graded as errors)**
- 2nd person: **o / ìwọ / ọ** (familiar, singular) vs **ẹ / ẹ̀yin / yín** (plural *and* respectful singular).
- 3rd person: **ó / òun** (familiar) vs **wọ́n / àwọn** (honorific, used for one respected person).
- Seniority is by **age/status, not gender**. Even a sibling a few years older gets honorific forms.
- Elders are not addressed by first name. Use kinship/role terms: **Bàbá, Màmá, Ẹ̀gbọ́n** (older sibling), **Àbúrò** (younger), **Ọ̀gá**.
- Greetings: **Ẹ** + greeting to elders (*Ẹ káàárọ̀, Ẹ kú iṣẹ́, Ẹ kú àbọ̀*) vs bare form to peers/younger people (*Káàárọ̀*). Respect particles **mà / sà** (*Ẹ ṣé mà*).
- Formal writing (letters to elders, official texts) uses honorific forms throughout. Translation exams check that the register matches the passage context.
- App mechanics: every Yoruba sentence carries `addresseeSeniority: elder|peer|younger|group`. Register exercises present a scene ("Your friend's mother opens the door") and grade pronoun, greeting and particle choice. A **register error is its own error type** with its own accuracy stat on the progress screen.
- Dialects: teach **Standard Yoruba** (Ọ̀yọ́-based). Add a short note that dialects (e.g., Ondo) differ in pronoun forms.

**Yoruba audio strategy:** ship a curated, compressed set of OpenSLR-86 sentence clips (selected to cover the A1–B1 vocabulary and all tone minimal pairs) + FSI tone-drill excerpts, about 30–60 MB. It's cached offline. An optional on-phone Yoruba speech model (Meta MMS-TTS via Transformers.js, ~150 MB, CC BY-NC) is an **experimental later option**: tone accuracy is unverified, so it stays off until tested against the minimal pairs.

**Portuguese/Chinese variants:** default to **Brazilian Portuguese** and **Simplified Chinese** (most learning resources). A settings toggle (European Portuguese, Traditional characters) can come later.

---

## Part 3 — Mastery levels
Levels are aligned to CEFR (the international standard). Each has a vocabulary-coverage target plus a gated exam. Each language's targets are capped to what its dictionary and corpora can support (relevant for Yoruba).

| Level | Name | Requirements to pass |
|---|---|---|
| 0 | **Script & Sounds** | Alphabet, tones, diacritics, (zh) pinyin + radicals. ≥90% on a tone/script exam. |
| 1 | A1 Beginner | ~600 words (zh: + ~300 characters), basic grammar, greetings and register basics |
| 2 | A2 Elementary | ~1,200 words (zh ~600 chars); sentence translation both ways |
| 3 | B1 Intermediate | ~2,500 words (zh ~1,200 chars); short paragraph reading + writing |
| 4 | B2 Upper-Int. | ~4,500 words (zh ~2,000 chars); 1-paragraph translations both ways |
| 5 | C1 Advanced | ~8,000 words (zh ~3,000 chars) ≈ 98% coverage; 2-paragraph translations |
| 6 | **Certified Mastery** | Final exam (below) |

"Known word" = the word's FSRS memory stability is ≥ 21 days (mature) **in both directions** (recognize L2→English *and* produce English→L2).

**Certified Mastery exam (your spec, made concrete)**
- 3 passages language→English **and** 3 passages English→language, each **2–3 paragraphs**, drawn from FLORES-200 / MENYO-20k / curated texts you haven't seen.
- **Every-word rule, enforced twice:**
  1. *Unlock gate:* every word (lemma) in the passages must already be "known". If any isn't, the app sends you to drill it first.
  2. *Word-by-word review:* after translating, the app aligns the passage token by token. You must account for every single word: tap it, confirm its meaning and show where it appears in your translation. 100% coverage is required to submit.
- *Grading (hybrid):* offline score = reference similarity (chrF metric) + coverage + sentence-by-sentence self-grade against the reference. If online with an API key, Claude grades accuracy, tone marks, register and grammar with a rubric, and must score ≥ 85%. Without AI, certification is marked "self-verified". A pass can be re-verified with AI later.

---

## Part 4 — Architecture

**Stack:** Node 23 + Vite + **Preact** + TypeScript (small, fast on phone) · **Dexie** (IndexedDB) for progress · **vite-plugin-pwa** (offline service worker) · **ts-fsrs** (spaced repetition) · **hanzi-writer** (stroke quiz) · Vitest (unit) + Playwright with iPhone emulation (end-to-end tests).

```
languageLearn/
  ROADMAP.md                 ← this plan with checkboxes
  tools/                     ← Node CLI, runs on your PC
    import-dictionary.ts     ← streams kaikki JSONL / CC-CEDICT / CSV → compact pack
    build-frequency.ts       ← ranks words; counts Yoruba frequency from corpora
    build-corpus.ts          ← Tatoeba/FLORES/MENYO → sentences + passages per level
    ipa-respell/*.json       ← IPA → English-respelling tables per language
  content/<lang>/            ← hand-written lessons: script, tones, grammar, register (JSON)
  packs/<lang>.pack.json.gz  ← built output: vocab + sentences + passages + lessons
  src/
    data/      (db.ts, packLoader.ts, backup.ts)
    srs/       (scheduler.ts on ts-fsrs, itemTypes.ts)
    lang/      (normalize.ts NFD/tone compare, tokenize.ts, pinyin.ts, yorubaTones.ts)
    exercises/ (MultipleChoice, TypeAnswer, ToneId, TonePair, MinimalPair, StrokeQuiz,
                RegisterScene, SentenceBuild, PassageTranslate, WordByWordReview)
    ui/        (DiacriticKeyboard, PronunciationCard, ToneContour, Heatmap, LevelMap)
    progress/  (levels.ts, coverage.ts, certification.ts, grading/ chrF + ai.ts)
    motivation/(streaks.ts, xp.ts, league.ts, ics.ts, badge.ts)
```

**Dictionary flow:** the dictionary parsers are written once in shared TypeScript (`src/import/`) and run in **both** the Node CLI and the phone browser.
- *Bundled:* I build all 5 language packs during development (`npm run build:packs`), so they ship inside the app and you never have to import anything.
- *On the phone:* **Settings → Import dictionary** accepts a kaikki JSONL, CC-CEDICT or CSV file from the iPhone Files app / iCloud Drive / Safari downloads. It streams the file on the phone (`File.stream()`, so large files don't exhaust memory), ranks words with the bundled frequency lists, and merges them into that language's pack.

**Delivery to iPhone (one time):** `npm run deploy` publishes to GitHub Pages → open the URL in Safari → Share → *Add to Home Screen* → open once on Wi-Fi so every language pack and audio clip downloads → it works fully offline afterwards.

**Phone-only after install. Everything below happens on the iPhone, with no PC:**

| Task | How it works on the phone |
|---|---|
| Daily study, exams, certification | Fully offline from cached packs and IndexedDB |
| Add or replace a dictionary | In-app importer (Files app picker) |
| Backups / moving to a new phone | Export progress → save to Files/iCloud Drive. Import on the new phone after installing from the same link. |
| App updates | When online, the app checks for a new version and shows "Update available → tap to reload". Nothing to run on a PC. |
| AI grading | Phone calls the Claude API directly with your key (browser-direct mode) |
| Native-speaker review sheet, error reports | Generated on the phone, shared via the iOS share sheet (Messages, Mail, etc.) |
| Reminders | `.ics` file opened from the app → added to iPhone Calendar |
| Storage check | Settings shows space used and whether persistent storage is granted, with a "re-download packs" button if iOS cleared them |

**User corrections ("Fix this") — the app learns from you**
- Every sentence, word, gloss, pronunciation, tone mark, register tag and grading decision has a **✎ Fix this** button. It's available in lessons, reviews, reading mode and exam results.
- Correction types:
  1. **Edit content:** fix the target-language text (including tone marks), the English translation, the IPA/respelling, or the register tag, and optionally add a note on why.
  2. **Accept my answer:** your answer was right. It's added as an accepted alternative for that item from now on.
  3. **Reject an accepted answer:** the app accepted something wrong.
  4. **Remove item:** the sentence is bad or unnatural. It's hidden from all lessons and exams.
- Corrections are stored in a `corrections` table **on top of** the pack data. Pack updates never overwrite your fixes. If an update changes the same item, the app shows both versions and you choose.
- **What happens next time:**
  - The corrected version is shown everywhere that item appears: lessons, reviews, passages, distractor choices and dictionary lookups.
  - Grading uses your accepted and rejected answers.
  - If the content changed (e.g., a tone mark), the item's review card is **reset**, so you relearn the correct form instead of keeping the wrong one.
  - Corrections to a word spread to every sentence containing it, with a review list so you can confirm each one.
- Corrected items are marked *user-verified*. Correction history can be undone. Corrections are included in backups and can be exported to share with a native speaker or with me, to fold into the bundled packs later.
- **Exam integrity:** a correction made during or after a level/certification exam applies to future sessions immediately. Changing that exam's score is re-checked by AI grading when available, or recorded as "self-corrected" on the certificate.

**Accountability system**
- Daily goal in XP. **XP comes only from correct retrievals and completed reading**, so tapping through can't farm it (a Nation-friendly fix to Duolingo's weakness).
- Streak counter, streak freezes earned by 7-day streaks, calendar heatmap.
- **Review-debt meter:** warns when overdue reviews pile up and blocks new words until the debt is cleared, so you can't outrun your memory.
- Weekly "league" against your own previous four weeks (no server needed).
- Level-up and certification badges, per-language progress rings (coverage %, words known, tone accuracy %).
- Optional written commitment pledge shown on missed days.
- Reminder `.ics` export to iPhone Calendar, plus a home-screen badge showing reviews due.

---

## Part 5 — Holes found in the plan, and fixes

| # | Hole | Fix |
|---|---|---|
| 1 | Data lost if iOS clears website storage or you change phones | Request persistent storage. Auto-backup reminder weekly. One-tap **export/import of progress JSON** via the Files app / iCloud Drive. |
| 2 | Typing tone marks/accents on an iPhone keyboard is painful | Built-in **diacritic toolbar** (ẹ ọ ṣ + á à, ç ñ ã õ é è ê…). Also accepts number shortcuts (`e.1` → ẹ́) and pinyin numbers (`ma3`). |
| 3 | Unicode: ẹ́ can be stored several different ways, so correct answers could be marked wrong | Compare in NFD with explicit mark checks. Unit-test every Yoruba vowel+tone combination. |
| 4 | Dictionary glosses are messy (obsolete senses, rare words, vulgarities) | The importer keeps frequent senses, drops "archaic/obsolete/rare" tags, and supports manual overrides in `content/<lang>/overrides.json`. |
| 5 | Chinese has no spaces, so "every word" is ambiguous | Segment with jieba at build time, store segmentation with each passage, and check with `Intl.Segmenter` on device. Characters and words are tracked separately. |
| 6 | Inflected forms (French *allons* vs *aller*) break the "every word known" check | Map forms → lemma using Wiktionary's form data. Coverage counts lemmas. Irregular forms get their own cards. |
| 7 | Proper nouns and numbers would block the certification gate | Auto-exempt names, numbers and punctuation (marked in passage data). |
| 8 | Translation has more than one right answer | Multiple accepted answers per sentence, fuzzy matching for short answers, the "Fix this → Accept my answer" correction (saved permanently), and AI grading for long answers. |
| 22 | Bad bundled data (wrong tones/translations) keeps resurfacing | User corrections layer: fixes stick, spread to related sentences, reset affected review cards, survive pack updates |
| 23 | Corrections could become a loophole on certification exams | Exam-score changes from corrections are re-graded by AI or marked "self-corrected" on the certificate |
| 9 | Few Yoruba passages exist at the right difficulty | Combine MENYO-20k + FLORES Yoruba + curated texts. Report honestly in-app how many unseen passages remain per level. |
| 10 | AI key stored on the phone | Key kept only in local storage, never bundled. Requests go directly to the API, and only exam text is sent. |
| 11 | My hand-written Yoruba (and other) lessons could contain errors | Every authored item carries a `verified: false` flag, a "report error" button and an exportable review sheet for a native speaker. Wiktionary/MENYO data preferred over my own writing. |
| 12 | Gamification rewarding streaks over learning | XP tied to correct recall. Review-debt gate. Fluency strand keeps practice time on real reading. |
| 13 | Content licenses (CC-BY-SA, NC) | A credits/licenses screen. Private, non-commercial use only. Don't publish packs commercially. |
| 14 | Large language packs and slow phone startup | Per-language lazy loading, gzip, data loaded into IndexedDB once. Target startup under 2 s. |
| 16 | FLORES Yoruba not quality-audited; web text often lacks tone marks | Diacritic validator excludes poorly marked text. MENYO-20k (professionally checked) is the primary passage source. |
| 17 | Wiktionary Yoruba is thin on function words (pronouns, particles, aspect markers) | Hand-curated core list from FSI + UD treebank, flagged `verified:false` until reviewed |
| 18 | Yorùbá Yé Mi license forbids derivatives | Use it only as a reference and link it in-app. No copied text. |
| 19 | Users type Yoruba in Benin-Republic or ASCII styles | Input converter maps ɛ/ɔ/sh/e./o./s. → ẹ/ọ/ṣ before grading |
| 20 | Installing on a phone needs the PC "just once", then nothing should require it | Packs bundled, importer runs in the browser, self-update prompt, phone-side backups (see "Phone-only after install") |
| 21 | Audio files large for iPhone storage | Compressed (AAC ~32 kbps), per-language download, size shown in Settings |
| 15 | Level 0 tone gate could feel endless for a self-described struggling learner | Short daily tone sessions mixed with the first 50 words, so you're never stuck only on drills. Tone accuracy keeps being tracked in later levels. |

---

## Part 6 — Implementation checklist

Legend: `[x]` done and tested · `[~]` partly done (see note) · `[ ]` not done

### Phase 0 — Setup
- [x] Copy this plan to `ROADMAP.md`. `git init`, Vite + Preact + TS project, Vitest, Playwright *(ESLint/Prettier skipped; `tsc --strict` is the gate)*
- [x] PWA setup (manifest, icons, service worker). E2E test proves it reloads and runs **offline** in WebKit with iPhone 15 emulation

### Phase 1 — Data pipeline (Node CLI)
- [x] Streaming parsers for kaikki JSONL, CC-CEDICT and CSV → common `Word` format (`src/import/parsers.ts`). Yoruba headwords use the **toned** canonical form, so ọkọ / ọkọ́ / ọkọ̀ stay separate
- [~] Frequency ranking (FrequencyWords; Yoruba counted from MENYO-20k), lemma/form mapping, sense filtering (drops archaic/rare/letter-name senses). *`overrides.json` replaced by the in-app corrections layer*
- [~] Respelling: rule-based from spelling for Yoruba, from pinyin for Mandarin, from IPA for es/fr/pt (prefers syllabified IPA). *Approximate by nature; Spanish IPA from Wiktionary is Castilian-first (θ)*
- [x] Corpus builder: Tatoeba sentences (zh/es/fr/pt), MENYO-20k (yo), FLORES-200 passages for all 5, segmentation, difficulty by word frequency
- [x] Pack writer + `npm run build:packs`, download links in README. All 5 packs built: yo 4,430 words / 5,348 sentences / 830 passages; zh, es, fr, pt ≈15,000 words / ≈10,000 sentences / 275 passages each
- [~] Yoruba sources: **MENYO-20k ✓, kaikki ✓, OpenSLR-86 transcripts ✓**. *Not used yet: FSI course (needs manual download from Live Lingua), UD-YTB treebank*
- [x] Yoruba diacritic validator + Benin/ASCII input converter, with tests (211 MENYO sentences rejected; 195 of 275 FLORES Yoruba docs flagged ⚠)
- [x] Yoruba audio curation: 871 native clips from OpenSLR-86 (woman + man voices), AAC ~38 kbps, 9.3 MB; 617 words incl. 7 of 9 tone minimal-pair words have recordings. *igbá / igba have no clip in the corpus*
- [x] Parsers live in shared `src/import/` and run in Node and in the phone browser

### Phase 2 — Core engine
- [x] Dexie schema (packs stored as single records for fast installs; cards, reviews, corrections, days, certs, meta)
- [x] FSRS scheduler: recognition + production card per word and per sentence; lesson exercises become drill cards
- [x] Answer grading: NFD tone-aware comparison, pinyin numbers↔marks, accent leniency/strict, typo tolerance; error types tone / underdot / accent / register / typo / wrong
- [x] Session builder: due reviews + new words + sentences at ≥80% known words, review-debt gate, daily new-item cap, first 50 words available during Level 0

### Phase 3 — Exercises & UI
- [x] Diacritic toolbar per language, pronunciation card (official form + IPA + respelling + tone colours + pitch contour + audio)
- [x] Exercises: multiple choice, typing, tone ID, minimal pairs (with real + generated tone-variant distractors), sentence tiles, register scenes, **stroke-order practice (zh, 663 characters bundled)**
- [x] Reading mode (coverage-sorted passages, tap-to-gloss, add word to reviews) and timed fluency reading (words/min)
- [x] Corrections layer: overlay on pack data, ✎ Fix this (edit / accept my answer / reject / remove), undo history
- [x] Corrections feed grading, spread word fixes to sentences (whole-word, tone-aware), reset review cards, pack-update conflicts surfaced, CSV export

### Phase 4 — Language content (authored, flagged `verified:false`)
- [x] Level 0 script & sounds for es, fr, pt, yo, zh (alphabets, accents, tones, sandhi, pinyin, radicals)
- [x] Yoruba Level 0: alphabet, three tones, minimal sets (checked against Wiktionary IPA), nasal vowels, syllabic nasals, gliding tones, grammatical tone
- [x] Yoruba respect system: ẹ/yín vs o/rẹ, wọ́n vs ó, seniority by age, kinship terms, Ẹ-greetings, mà/sà, seniority-scene exercises, register error stat
- [x] Register lessons: tu/vous, tú/usted, você/o senhor/a senhora, 你/您
- [x] Full grammar curriculum, Levels 1–5 (A1–C1) for all five languages: 161 lessons / 568 exercises in total, with 4–5 Level 0 sound lessons per language (`content/lessons/*.ts`), each with notes and graded exercises; integrity-tested (`tests/content.test.ts`)
- [x] Native-speaker review sheet export (Settings) + ✎ on every item

### Phase 5 — Levels & certification
- [x] Coverage/level calculator, level exams 0–5 (word + sentence items; passage translation from Level 3)
- [x] Certified Mastery: unlock gate (every lemma known), 3 + 3 passages both directions, word-by-word review requiring 100% confirmation
- [x] Hybrid grading: chrF + coverage + paragraph self-grade; optional Claude API grader (structured JSON, server-side fallback); results labelled ai / self-verified / self-corrected

### Phase 6 — Accountability
- [x] XP only for correct recall, daily goal, streaks + freezes (earned every 7 days, auto-spent), heatmap, weekly self-league, level badges, progress bars
- [x] `.ics` daily reminder export, home-screen badge count (where iOS allows), commitment pledge shown after a missed day, weekly backup reminder

### Phase 7 — Robustness & delivery
- [x] Progress backup export/import (API key never exported), persistent-storage request, credits screen
- [x] On-phone dictionary importer (Files picker, streaming parse, merge)
- [x] Self-update banner; storage + pack status; install/update/re-install packs
- [ ] **Phone-only audit on your real iPhone** (needs you: deploy, Add to Home Screen, airplane mode)
- [~] Performance: single-record packs (install < 2 s in emulator); per-language lazy loading. *Not yet measured on a real phone*
- [~] `npm run deploy` script + iPhone install guide in README. *Not yet run: needs your GitHub repo*
- [x] Final hole-review pass against Part 5 (see notes below)

### Hole review (Part 5) — outcome
- Holes 1–8, 10–14, 16–23: addressed as described in Part 5 (backups, diacritic bar, NFD compare, gloss filtering, segmentation, lemma mapping, exemptions, multiple answers, key handling, verified flags, recall-only XP, credits, single-record packs, validator, linked-not-copied textbook, input converter, phone-only flow, compressed audio, corrections overlay and exam marking).
- Hole 9 (few Yoruba passages): 555 MENYO passages + 80 clean FLORES docs available; the in-app count of *unseen* passages per level is not shown yet.
- Hole 15 (Level 0 gate): first 50 words available during Level 0 ✓.
- **New holes found while building, and fixed:**
  - Wiktionary titles Yoruba pages without tone marks → parser now uses the toned canonical form (otherwise ọkọ/ọkọ́/ọkọ̀ merged).
  - Letter-name entries ("tí = the letter T") taught as words → filtered.
  - Homographs inherited the wrong frequency (fr *taire* ← *tu*, *est* = "east"; pt *é* as interjection; zh rare readings 吧 *bā*, 要 *yāo*) → headword-first ranking, function-word priority, CEDICT reading preference.
  - Function words stored as "form of" (es *mi* = my) were dropped → kept.
  - Per-row IndexedDB writes are very slow on some WebKit builds (68 s for 4,440 words) → packs stored as one record (< 2 s).
  - Switching language briefly mixed two languages and could override navigation → new pack loads before switching.
  - I had credited the FSI course without using it → attribution removed; FSI remains a TODO.
- **Still open:** real-iPhone audit; FSI tone-drill audio; UD-YTB lemmas; native-speaker review of authored Yoruba content.

---

## Verification
- **Unit tests (Vitest, 69 passing, including lesson-content integrity for every language):** importers on sample JSONL/CEDICT/CSV snippets; Yoruba NFD tone comparison for all vowel×tone×underdot combos; pinyin conversion and tone sandhi; FSRS scheduling; coverage/lemma logic; chrF scorer; streak/XP rules across day boundaries.
- **End-to-end (Playwright, WebKit, iPhone 15 emulation, 5 passing):** first run → Yoruba tone lesson with tone-error feedback and native audio; study session → ✎ Fix this → corrections list; progress/read/settings screens; offline reload after first visit; all 5 language packs install and open.
- **Manual on your iPhone:** Add to Home Screen, airplane mode, complete a session, export a backup, reinstall, import the backup, check the calendar reminder and the badge. Import a dictionary from Files. Receive an app update while online. All with the PC off.
- **Corrections checks:** fix a tone mark on a sentence → it shows corrected in the next review, its card is reset, and it survives a pack update. "Accept my answer" → the same answer is graded correct next time. "Remove" → the sentence never appears again. Corrections survive backup export/import.
- **Yoruba checks:** every tone minimal pair plays the correct native clip. The validator rejects an unmarked sentence. Benin-style input `ɔkɔ̀` is graded as `ọkọ̀`. A familiar greeting to an elder in a register scene is marked as a register error.
