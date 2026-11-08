# Licences

LinguaForge combines three kinds of material. Each has its own licence.

| What | Where | Licence |
|---|---|---|
| Source code | `src/`, `tools/`, `tests/`, `e2e/`, config files | [MIT](LICENSE) |
| Lessons written for this project | `content/` | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Built language packs, audio, stroke data | `public/packs/`, `public/audio/`, `public/hanzi/` | Mixed: see below. Treat as **non-commercial**. |

Lessons use CC BY-SA because they are written alongside Wiktionary data (also CC BY-SA), so the two can be freely combined. By contributing to `content/` you agree to license your contribution under CC BY-SA 4.0. By contributing code, you agree to the MIT licence.

## Third-party data in the built packs

| Source | Used for | Licence |
|---|---|---|
| [Wiktionary](https://www.wiktionary.org/) via [kaikki.org](https://kaikki.org/) | Dictionary entries, IPA (yo, es, fr, pt) | CC BY-SA 4.0 |
| [CC-CEDICT](https://cc-cedict.org/) | Chinese dictionary | CC BY-SA 4.0 |
| [MENYO-20k](https://github.com/uds-lsv/menyo-20k_MT) | Yorùbá sentences and passages | **CC BY-NC 4.0** (non-commercial) |
| [FLORES-200](https://github.com/facebookresearch/flores) | Reading and exam passages | CC BY-SA 4.0 |
| [Tatoeba](https://tatoeba.org/) via manythings.org | Example sentences | CC BY 2.0 FR |
| [FrequencyWords](https://github.com/hermitdave/FrequencyWords) | Word frequency ranking | CC BY-SA 4.0 |
| [OpenSLR-86](https://www.openslr.org/86/) (Google) | Native Yorùbá audio clips | CC BY-SA 4.0 |
| [hanzi-writer-data](https://github.com/chanind/hanzi-writer-data) / Make Me a Hanzi | Chinese stroke order | Arphic Public License (`public/hanzi/ARPHICPL.TXT`) |

Because the Yorùbá pack contains MENYO-20k, **the packs as a whole may not be used commercially**. A commercial fork would need to remove MENYO-derived sentences and rebuild the packs.

The app links to *Yorùbá Yé Mi* (UT Austin COERLL, CC BY-NC-ND) and does not copy from it. Grammar reference books are used only to check facts and are never copied. Please keep it that way: do not paste text from copyrighted textbooks, courses or websites into `content/`.
