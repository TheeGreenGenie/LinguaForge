# LinguaForge

An offline app for learning to **read and write** Portuguese (Brazil), Yorùbá, Mandarin Chinese, Spanish and French. It's built with Node and runs on an iPhone as a home-screen web app. After one install it needs no computer.

LinguaForge is **free and open source**. It is built on open dictionaries and corpora, follows Paul Nation's research on vocabulary learning, and gets better with every correction from learners and native speakers.

**Speak Yorùbá, Mandarin, Spanish, French or Portuguese? We need you.** Most lessons are marked *unverified* until a native speaker checks them. You can help straight from the app, with no coding: tap **✎ Fix this** on anything wrong, then send your fixes from **Settings → Help improve LinguaForge**. See [CONTRIBUTING.md](CONTRIBUTING.md).

The full plan, research and progress checklist are in [ROADMAP.md](ROADMAP.md).

## Put it on your iPhone (one time)

1. Host your own copy (one time, on a PC): fork this repository on GitHub, or push it to a new repository. In the repo's **Settings → Pages**, set *Source* to **GitHub Actions**. Every push to `main` now builds and publishes the app to `https://YOUR-NAME.github.io/REPO/`. (Without Actions, run `npm install && npm run deploy` to push to a `gh-pages` branch instead, then pick that branch in Settings → Pages.)
2. On the iPhone, open the Pages URL in **Safari**.
3. Tap **Share → Add to Home Screen**.
4. Open the app once **on Wi-Fi**. All five language packs, the Yoruba native-speaker audio and the Chinese stroke data (about 45 MB in total) download into the phone.
5. That's it. The app now works offline, including in airplane mode.

After that, everything happens on the phone:

| Task | On the phone |
|---|---|
| Study, exams, certification | Works offline |
| Add a dictionary | Settings → *Import a dictionary file* (from Files / iCloud Drive) |
| Back up or move to a new phone | Settings → *Back up progress* → save to Files / iCloud |
| App updates | When online, a banner shows "Update available → Reload" |
| Daily reminder | Settings → *Add daily reminder to Calendar* |
| AI grading of long translations | Settings → paste your Claude API key (optional) |

## Developer commands

```bash
npm run dev            # run on the PC at http://localhost:5173
npm test               # unit tests (Vitest)
npx playwright test    # end-to-end tests in WebKit with iPhone 15 emulation
npm run build:packs    # rebuild language packs from data/raw (see below)
npm run build          # type-check + production build into dist/
npm run deploy         # build + publish dist/ to GitHub Pages
```

### Rebuilding language packs

`tools/build-packs.ts` merges the hand-written lessons in `content/` with the downloaded data in `data/raw/`. Raw data is not committed. Download it like this:

| File | Source |
|---|---|
| `data/raw/<lang>/kaikki-<lang>.jsonl` | kaikki.org → Dictionary → language → "all word senses" JSONL (yo, es, fr, pt) |
| `data/raw/zh/cedict.txt` | mdbg.net CC-CEDICT (unzipped) |
| `data/raw/<lang>/freq.txt` | github.com/hermitdave/FrequencyWords `content/2018/<code>/<code>_50k.txt` |
| `data/raw/yo/menyo-{train,dev,test}.tsv` | github.com/uds-lsv/menyo-20k_MT `data/` |
| `data/raw/tatoeba/<cmn,spa,fra,por>/` | manythings.org/anki (Tatoeba pairs) |
| `data/raw/flores/` | FLORES-200 (dl.fbaipublicfiles.com/nllb/flores200_dataset.tar.gz) |

### Dictionary format for your own word lists

CSV or TSV with a header row:

```
word,translation,pos,ipa,register,notes
Ẹ káàárọ̀,good morning (to an elder),phrase,,honorific,
omi,water,noun,/ō.mī/,,
```

`register` is one of `neutral`, `casual`, `formal`, `honorific`. Separate several meanings with `;`.

## Contributing

Native-speaker review, bug reports, code, lessons and new languages are all welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) to get started, and the [Code of Conduct](CODE_OF_CONDUCT.md). Good first steps are issues labelled `content` or `good first issue`, and the open items in [ROADMAP.md](ROADMAP.md).

## Credits & licenses

- **Code:** [MIT](LICENSE).
- **Lessons in `content/`:** CC BY-SA 4.0.
- **Bundled data:** Wiktionary via kaikki.org (CC BY-SA), CC-CEDICT (CC BY-SA), MENYO-20k (CC BY-NC), FLORES-200 (CC BY-SA), Tatoeba (CC BY 2.0 FR), FrequencyWords (CC BY-SA), OpenSLR-86 Yorùbá audio (CC BY-SA), hanzi-writer-data (Arphic).

Because MENYO-20k is non-commercial, the built packs are for **non-commercial use**. Details are in [LICENSES.md](LICENSES.md).

Method: Paul Nation's Four Strands, with FSRS spaced repetition (ts-fsrs, MIT).
