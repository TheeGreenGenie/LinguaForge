// Yorùbá authored content. Standard Yoruba (Ọ̀yọ́-based), Nigerian orthography.
// Tone-marked forms were checked against Wiktionary IPA where available
// (e.g. ọkọ /ɔ̄.kɔ̄/, ọkọ́ /ɔ̄.kɔ́/, ọkọ̀ /ɔ̄.kɔ̀/, igbá, igba, ìgbà, ìgbá, èdè, edé).
// Sources consulted (ROADMAP §2.5): MENYO-20k paper;
// Wiktionary/kaikki Yoruba; UGA Yoruba honorific-pronoun notes; Yorùbá Yé Mi (reference only).
import { lesson, sentence, word } from './helpers';

const L = 'yo' as const;
const SRC = ['Written for this app; tone marks checked against Wiktionary IPA (CC BY-SA)', 'Awaiting native-speaker review'];

export const yoLessons = [
  lesson(L, 'alphabet', 0, 1, 'script', 'The Yorùbá alphabet',
    `Yorùbá is written with **25 letters**: a b d e ẹ f g gb h i j k l m n o ọ p r s ṣ t u w y.

    There is **no c, q, v, x or z**. **gb** is one letter, made by saying g and b *at the same time*.

    Three letters have a dot underneath, and each is a different letter from its plain version:
    **ẹ** sounds like "e" in *bed*; **ọ** sounds like "aw" in *law*; **ṣ** sounds like "sh" in *shoe*.
    Plain **e** is like "ay" in *day* (without the y glide), and plain **o** is like "o" in *go* (no w glide).

    **p** is pronounced "kp" (k and p together), like gb but voiceless.

    Typing tip: on the keyboard bar tap ẹ ọ ṣ, or type e. o. s. (letter + full stop).`,
    [
      { type: 'mc', prompt: 'Which letter is NOT in the Yorùbá alphabet?', options: ['c', 'gb', 'ṣ', 'ẹ'], answer: 'c', explanation: 'Yorùbá has no c, q, v, x or z.' },
      { type: 'letter-sound', prompt: 'ẹ sounds like the vowel in…', options: ['bed', 'day', 'law', 'go'], answer: 'bed' },
      { type: 'letter-sound', prompt: 'ọ sounds like the vowel in…', options: ['law', 'go', 'bed', 'see'], answer: 'law' },
      { type: 'letter-sound', prompt: 'ṣ sounds like…', options: ['sh in shoe', 's in sun', 'ch in chair', 'z in zoo'], answer: 'sh in shoe' },
      { type: 'letter-sound', prompt: 'p in Yorùbá is pronounced…', options: ['kp (k and p together)', 'p as in English', 'b', 'f'], answer: 'kp (k and p together)' },
      { type: 'mc', prompt: 'How many letters does the Yorùbá alphabet have?', options: ['25', '26', '21', '30'], answer: '25' },
      { type: 'type', prompt: 'Type the letter that sounds like "sh"', answer: 'ṣ', side: 'target', hint: 'Use the ṣ key or type s.' },
    ], SRC),

  lesson(L, 'tones', 0, 2, 'tone', 'The three tones',
    `Yorùbá is a **tone language**: every syllable is said on a pitch, and changing the pitch changes the word.

    There are **three level tones**:
    **High**: acute accent ´ (á é ẹ́ í ó ọ́ ú)
    **Mid**: **no mark** (a e ẹ i o ọ u)
    **Low**: grave accent \` (à è ẹ̀ ì ò ọ̀ ù)

    A missing tone mark is not optional: unmarked means **mid**. In this app a wrong or missing tone mark is marked **wrong**, and it's counted separately so you can see your tone accuracy.

    Example: **ọkọ** (mid-mid) = husband, **ọkọ́** (mid-high) = hoe, **ọkọ̀** (mid-low) = vehicle.`,
    [
      { type: 'tone-id', prompt: 'ọkọ̀', options: ['mid-low', 'mid-high', 'mid-mid', 'low-low'], answer: 'mid-low', explanation: 'ọ (no mark) = mid; kọ̀ (grave) = low.' },
      { type: 'tone-id', prompt: 'ọkọ́', options: ['mid-high', 'mid-low', 'high-high', 'mid-mid'], answer: 'mid-high' },
      { type: 'tone-id', prompt: 'ọkọ', options: ['mid-mid', 'mid-low', 'mid-high', 'low-mid'], answer: 'mid-mid' },
      { type: 'tone-id', prompt: 'bàbá', options: ['low-high', 'high-low', 'mid-high', 'low-low'], answer: 'low-high' },
      { type: 'tone-id', prompt: 'ìgbà', options: ['low-low', 'mid-high', 'low-high', 'high-low'], answer: 'low-low' },
      { type: 'mc', prompt: 'A vowel with no tone mark has which tone?', options: ['mid', 'high', 'low', 'no tone'], answer: 'mid' },
      { type: 'minimal-pair', prompt: 'Which word means "vehicle"?', options: ['ọkọ̀', 'ọkọ́', 'ọkọ'], answer: 'ọkọ̀', wordId: 'yo:w:ọkọ̀#noun' },
      { type: 'minimal-pair', prompt: 'Which word means "husband"?', options: ['ọkọ', 'ọkọ̀', 'ọkọ́'], answer: 'ọkọ', wordId: 'yo:w:ọkọ#noun' },
      { type: 'minimal-pair', prompt: 'Which word means "hoe"?', options: ['ọkọ́', 'ọkọ', 'ọkọ̀'], answer: 'ọkọ́', wordId: 'yo:w:ọkọ́#noun' },
      { type: 'type', prompt: 'Type "vehicle" in Yorùbá (with tone marks)', answer: 'ọkọ̀', side: 'target', hint: 'mid-low: ọ + k + ọ̀' },
    ], SRC),

  lesson(L, 'minimal-sets', 0, 3, 'tone', 'Tone minimal sets',
    `The same letters can be up to four different words depending on tone:

    **igbá** (mid-high): calabash
    **igba** (mid-mid): two hundred
    **ìgbà** (low-low): time, season
    **ìgbá** (low-high): garden egg (bitter tomato)

    **èdè** (low-low): language. **edé** (mid-high): shrimp/crayfish.

    Read the marks every time. Reading Yorùbá without them means guessing between different words.`,
    [
      { type: 'minimal-pair', prompt: 'Which word means "time, season"?', options: ['ìgbà', 'igbá', 'igba', 'ìgbá'], answer: 'ìgbà', wordId: 'yo:w:ìgbà#noun' },
      { type: 'minimal-pair', prompt: 'Which word means "calabash"?', options: ['igbá', 'ìgbà', 'igba', 'ìgbá'], answer: 'igbá', wordId: 'yo:w:igbá#noun' },
      { type: 'minimal-pair', prompt: 'Which word means "two hundred"?', options: ['igba', 'igbá', 'ìgbá', 'ìgbà'], answer: 'igba', wordId: 'yo:w:igba#num' },
      { type: 'minimal-pair', prompt: 'Which word means "garden egg"?', options: ['ìgbá', 'igbá', 'ìgbà', 'igba'], answer: 'ìgbá', wordId: 'yo:w:ìgbá#noun' },
      { type: 'minimal-pair', prompt: 'Which word means "language"?', options: ['èdè', 'edé', 'ède', 'edè'], answer: 'èdè', wordId: 'yo:w:èdè#noun' },
      { type: 'tone-id', prompt: 'edé', options: ['mid-high', 'low-low', 'high-mid', 'mid-low'], answer: 'mid-high' },
      { type: 'type', prompt: 'Type "language" in Yorùbá', answer: 'èdè', side: 'target' },
      { type: 'type', prompt: 'Type "time, season" in Yorùbá', answer: 'ìgbà', side: 'target' },
    ], SRC),

  lesson(L, 'nasals-glides', 0, 4, 'tone', 'Nasal vowels, syllabic nasals and gliding tones',
    `**Nasal vowels** are written vowel + n: **an, ẹn, in, ọn, un**. The n is not pronounced as a separate n; the vowel is said through the nose. There is no nasal "on": the nasal o-sound is always written **ọn**.

    **Syllabic nasals**: n or m can be a whole syllable with its own tone: **ń** (high), **ǹ** (low), and mid, which is written **n̄**. This is the one place where mid tone *is* marked. Example: **ó ń lọ** "he/she is going" (ń = high-tone progressive marker).

    **Gliding tones**: a rising or falling pitch is written by doubling the vowel with two different marks, e.g. **káàárọ̀** (good morning): ká-à-á-rọ̀ = high-low-high-low.`,
    [
      { type: 'mc', prompt: 'In "ìyàn", how is the final "an" pronounced?', options: ['a nasal vowel (no separate n)', 'a + separate n sound', 'silent', 'like "ang"'], answer: 'a nasal vowel (no separate n)' },
      { type: 'tone-id', prompt: 'káàárọ̀', options: ['high-low-high-low', 'high-high-high-low', 'low-low-high-high', 'high-mid-high-low'], answer: 'high-low-high-low' },
      { type: 'mc', prompt: 'Which form marks a MID-tone syllabic nasal?', options: ['n̄', 'ń', 'ǹ', 'n'], answer: 'n̄' },
      { type: 'mc', prompt: '"ó ń lọ": what does ń show?', options: ['ongoing action (is …-ing)', 'past tense', 'a question', 'politeness'], answer: 'ongoing action (is …-ing)' },
    ], SRC),

  lesson(L, 'grammatical-tone', 0, 5, 'tone', 'Tone in grammar',
    `Tone also carries grammar:

    **ó** (high) = he/she/it as a subject: *Ó lọ* "He/She went."
    After a **noun subject**, Yorùbá adds a **high-tone syllable** that copies the last vowel: *Adé lọ* is said *Adé é lọ*. You'll see it in speech-like writing; in standard writing it is often left out.

    Negation **kò** (low) "not": *Ó kò lọ* is contracted to **Kò lọ** "He/She didn't go". With *o* "you": *o kò lọ* is contracted to **o ò lọ** "you didn't go".

    In fast speech and in writing, vowels merge: **jẹ oúnjẹ** "eat food" becomes **jẹun**.`,
    [
      { type: 'mc', prompt: '"Ó lọ" means…', options: ['He/She went', 'You went', 'They went (respectful)', 'I went'], answer: 'He/She went' },
      { type: 'mc', prompt: 'Which word means "not" in "Kò lọ"?', options: ['kò', 'lọ', 'ó', 'ń'], answer: 'kò' },
      { type: 'mc', prompt: '"jẹun" comes from…', options: ['jẹ + oúnjẹ (eat + food)', 'jẹ + un (eat + it)', 'jẹ + ọ̀un', 'a single root word'], answer: 'jẹ + oúnjẹ (eat + food)' },
    ], SRC),

  // ---------------- Level 1: respect system (core requirement) ----------------
  lesson(L, 'respect-pronouns', 1, 10, 'register', 'Respect: ẹ vs o, wọ́n vs ó',
    `Yorùbá grammar marks **respect**. Seniority goes by **age and status, not gender**. Someone even a few years older than you, an older sibling, a stranger or anyone in authority gets **honorific** forms.

    **You**:
    to a friend, a younger person or a child: **o** (subject), **ìwọ** (emphatic), **rẹ** ("your")
    to an elder, a stranger, or several people: **ẹ** (subject), **ẹ̀yin** (emphatic), **yín** ("your" / "you" as object)

    **He / she** (talking ABOUT someone):
    a peer or younger person: **ó** (subject), **òun** (emphatic)
    an elder or respected person: **wọ́n**, the plural "they", used for ONE person out of respect. Emphatic: **àwọn**.

    Using **o** to an elder is not "casual"; it is **rude**. This app grades it as a **register error**.

    Examples: *Kí ni orúkọ rẹ?* (to a child) vs *Kí ni orúkọ yín?* (to an elder) "What is your name?"
    *Ó ti dé* "He/She has arrived" (a younger brother) vs *Wọ́n ti dé* "He/She has arrived" (your father).`,
    [
      { type: 'register-scene', prompt: 'You ask your friend\'s grandmother her name. Choose the right question.', options: ['Kí ni orúkọ yín?', 'Kí ni orúkọ rẹ?'], answer: 'Kí ni orúkọ yín?', seniority: 'elder', register: 'honorific', explanation: 'yín shows respect to an elder; rẹ is for peers and younger people.' },
      { type: 'register-scene', prompt: 'You ask a small child his name.', options: ['Kí ni orúkọ rẹ?', 'Kí ni orúkọ yín?'], answer: 'Kí ni orúkọ rẹ?', seniority: 'younger', register: 'casual' },
      { type: 'register-scene', prompt: 'Your father has just come home. Tell someone "He has arrived".', options: ['Wọ́n ti dé.', 'Ó ti dé.'], answer: 'Wọ́n ti dé.', seniority: 'elder', register: 'honorific', explanation: 'Use honorific wọ́n when talking about a parent or elder.' },
      { type: 'register-scene', prompt: 'Your younger brother has just come home. Tell someone "He has arrived".', options: ['Ó ti dé.', 'Wọ́n ti dé.'], answer: 'Ó ti dé.', seniority: 'younger', register: 'casual' },
      { type: 'mc', prompt: 'Your older sister is 3 years older than you. Which "you" do you use with her?', options: ['ẹ (honorific)', 'o (familiar)'], answer: 'ẹ (honorific)', explanation: 'Seniority is by age; even a slightly older sibling (ẹ̀gbọ́n) gets honorific forms.' },
      { type: 'mc', prompt: 'Which word is the respectful "your"?', options: ['yín', 'rẹ', 'mi', 'wa'], answer: 'yín' },
      { type: 'type', prompt: 'Type the honorific word for "he/she" (talking about an elder)', answer: 'wọ́n', side: 'target' },
    ], [...SRC, 'UGA African Studies Yoruba notes on honorific pronouns']),

  lesson(L, 'greetings', 1, 11, 'register', 'Greetings by seniority',
    `Greeting is central in Yorùbá culture. To an elder you add **Ẹ** (respectful "you") in front of the greeting; to a peer or younger person you use the bare form.

    **Ẹ káàárọ̀** / Káàárọ̀: good morning
    **Ẹ káàsán** / Káàsán: good afternoon
    **Ẹ kú alẹ́** / Kú alẹ́: good evening
    **Ẹ kú iṣẹ́** / O kú iṣẹ́: well done (greeting someone at work)
    **Ẹ kú àbọ̀** / Kú àbọ̀: welcome (back)
    **Ẹ ṣé** / O ṣé: thank you (also *Ẹ ṣeun* / *O ṣeun*)
    **Ẹ jọ̀ọ́** / Jọ̀ọ́: please

    To be extra polite, add **mà** (to a woman, "ma'am") or **sà** (to a man, "sir"): *Ẹ káàárọ̀ mà.*

    Don't greet an elder by their first name. Use a kinship or role word: **Bàbá** (father / older man), **Màmá** (mother / older woman), **Ẹ̀gbọ́n** (older sibling), **Ọ̀gá** (boss).`,
    [
      { type: 'register-scene', prompt: 'Morning. You meet your teacher (an older woman).', options: ['Ẹ káàárọ̀ mà', 'Káàárọ̀', 'Báwo ni?'], answer: 'Ẹ káàárọ̀ mà', seniority: 'elder', register: 'honorific' },
      { type: 'register-scene', prompt: 'Morning. You meet your classmate (same age).', options: ['Káàárọ̀', 'Ẹ káàárọ̀ sà'], answer: 'Káàárọ̀', seniority: 'peer', register: 'casual', explanation: 'With peers the bare form is natural. Ẹ káàárọ̀ is not wrong but sounds distant.' },
      { type: 'register-scene', prompt: 'An older man is working in his shop. Greet him.', options: ['Ẹ kú iṣẹ́ sà', 'O kú iṣẹ́'], answer: 'Ẹ kú iṣẹ́ sà', seniority: 'elder', register: 'honorific' },
      { type: 'register-scene', prompt: 'Your aunt gives you food. Thank her.', options: ['Ẹ ṣé mà', 'O ṣé'], answer: 'Ẹ ṣé mà', seniority: 'elder', register: 'honorific' },
      { type: 'register-scene', prompt: 'Your younger cousin passes you the salt. Thank him.', options: ['O ṣé', 'Ẹ ṣé sà'], answer: 'O ṣé', seniority: 'younger', register: 'casual' },
      { type: 'register-scene', prompt: 'Your grandfather returns from a trip. Welcome him.', options: ['Ẹ kú àbọ̀', 'Kú àbọ̀'], answer: 'Ẹ kú àbọ̀', seniority: 'elder', register: 'honorific' },
      { type: 'mc', prompt: 'How should you address your older brother, Túndé?', options: ['Ẹ̀gbọ́n (a respectful title), not just "Túndé"', 'Túndé', 'Àbúrò'], answer: 'Ẹ̀gbọ́n (a respectful title), not just "Túndé"', explanation: 'Calling an older person by their bare first name is disrespectful. Àbúrò means a YOUNGER sibling.' },
      { type: 'type', prompt: 'Type "good morning" respectfully (to an elder)', answer: 'Ẹ káàárọ̀', side: 'target' },
    ], [...SRC, 'Yorùbá Yé Mi (COERLL) — reference only']),

  lesson(L, 'first-sentences', 1, 12, 'grammar', 'First sentences: I, you, aspect',
    `Yorùbá verbs don't change form. Time and aspect come from small words **before** the verb:

    **ń** (high-tone nasal): ongoing. *Mo ń jẹun* "I am eating"
    **ti**: completed. *Mo ti jẹun* "I have eaten"
    **máa** / **yóò**: future. *Mo máa lọ* / *Màá lọ* "I will go"

    Subject pronouns: **mo** I · **o** you (familiar) · **ó** he/she/it · **a** we · **ẹ** you (plural/respectful) · **wọ́n** they / he-she (honorific)

    Word order is Subject-Verb-Object, like English: *Mo fẹ́ omi* "I want water".`,
    [
      { type: 'mc', prompt: '"Mo ń lọ sí ọjà" means…', options: ['I am going to the market', 'I went to the market', 'I will go to the market', 'Go to the market'], answer: 'I am going to the market' },
      { type: 'mc', prompt: '"Mo ti jẹun" means…', options: ['I have eaten', 'I am eating', 'I will eat', 'I did not eat'], answer: 'I have eaten' },
      { type: 'type', prompt: 'Translate: "I want water"', answer: 'Mo fẹ́ omi', side: 'target' },
      { type: 'type', prompt: 'Translate: "Ó ń kà ìwé"', answer: 'He is reading a book', accept: ['She is reading a book', 'he is reading a book', 'she is reading a book', 'He/she is reading a book', 'It is reading a book', 'he reads a book', 'she reads a book'], side: 'english' },
    ], SRC),
];

// Core vocabulary (merged with Wiktionary entries at pack build time; Wiktionary supplies IPA).
export const yoWords = [
  word(L, 'ọkọ', 'husband', 'noun', { ipa: '/ɔ̄.kɔ̄/', level: 0 }),
  word(L, 'ọkọ́', 'hoe', 'noun', { ipa: '/ɔ̄.kɔ́/', level: 0 }),
  word(L, 'ọkọ̀', 'vehicle', 'noun', { ipa: '/ɔ̄.kɔ̀/', level: 0 }),
  word(L, 'igbá', 'calabash', 'noun', { level: 0 }),
  word(L, 'igba', 'two hundred', 'num', { level: 0 }),
  word(L, 'ìgbà', ['time', 'season'], 'noun', { level: 0 }),
  word(L, 'ìgbá', 'garden egg', 'noun', { level: 0 }),
  word(L, 'èdè', 'language', 'noun', { level: 0 }),
  word(L, 'edé', ['shrimp', 'crayfish'], 'noun', { level: 0 }),
  word(L, 'bàbá', ['father', 'older man'], 'noun'),
  word(L, 'màmá', ['mother', 'older woman'], 'noun'),
  word(L, 'ìyá', 'mother', 'noun'),
  word(L, 'ọmọ', 'child', 'noun'),
  word(L, 'ẹ̀gbọ́n', 'older sibling', 'noun', { register: 'honorific' }),
  word(L, 'àbúrò', 'younger sibling', 'noun'),
  word(L, 'ọ̀rẹ́', 'friend', 'noun'),
  word(L, 'olùkọ́', 'teacher', 'noun'),
  word(L, 'ọ̀gá', ['boss', 'master'], 'noun'),
  word(L, 'ilé', ['house', 'home'], 'noun'),
  word(L, 'omi', 'water', 'noun'),
  word(L, 'oúnjẹ', 'food', 'noun'),
  word(L, 'ọjà', 'market', 'noun'),
  word(L, 'owó', 'money', 'noun'),
  word(L, 'ọwọ́', 'hand', 'noun'),
  word(L, 'ẹsẹ̀', ['leg', 'foot'], 'noun'),
  word(L, 'orí', 'head', 'noun'),
  word(L, 'ojú', ['eye', 'face'], 'noun'),
  word(L, 'ẹnu', 'mouth', 'noun'),
  word(L, 'ẹja', 'fish', 'noun'),
  word(L, 'ẹran', 'meat', 'noun'),
  word(L, 'ìwé', 'book', 'noun'),
  word(L, 'orúkọ', 'name', 'noun'),
  word(L, 'ọjọ́', 'day', 'noun'),
  word(L, 'òní', 'today', 'noun'),
  word(L, 'ọ̀la', 'tomorrow', 'noun'),
  word(L, 'àná', 'yesterday', 'noun'),
  word(L, 'lọ', 'go', 'verb'),
  word(L, 'wá', 'come', 'verb'),
  word(L, 'jẹ', 'eat', 'verb'),
  word(L, 'mu', 'drink', 'verb'),
  word(L, 'rí', 'see', 'verb'),
  word(L, 'fẹ́', ['want', 'love'], 'verb'),
  word(L, 'kà', ['read', 'count'], 'verb'),
  word(L, 'kọ', 'write', 'verb'),
  word(L, 'kọ́', ['learn', 'teach', 'build'], 'verb'),
  word(L, 'sọ', ['say', 'speak'], 'verb'),
  word(L, 'gbọ́', ['hear', 'understand'], 'verb'),
  word(L, 'mọ̀', 'know', 'verb'),
  word(L, 'dé', 'arrive', 'verb'),
  word(L, 'sùn', 'sleep', 'verb'),
  word(L, 'mo', 'I (subject)', 'pron'),
  word(L, 'o', 'you (familiar, singular subject)', 'pron', { register: 'casual' }),
  word(L, 'ó', 'he / she / it (subject)', 'pron'),
  word(L, 'a', 'we (subject)', 'pron'),
  word(L, 'ẹ', 'you (plural or respectful subject)', 'pron', { register: 'honorific' }),
  word(L, 'wọ́n', 'they / he-she (honorific)', 'pron', { register: 'honorific' }),
  word(L, 'yín', 'your / you (plural or respectful)', 'pron', { register: 'honorific' }),
  word(L, 'rẹ', 'your (familiar)', 'pron', { register: 'casual' }),
  word(L, 'mi', ['my', 'me'], 'pron'),
  word(L, 'kò', 'not', 'particle'),
  word(L, 'ń', 'is …-ing (progressive marker)', 'particle'),
  word(L, 'ti', 'has … (perfect marker)', 'particle'),
  word(L, 'bẹ́ẹ̀ni', 'yes', 'intj'),
  word(L, 'rárá', 'no', 'intj'),
  word(L, 'ọ̀kan', 'one', 'num'),
  word(L, 'èjì', 'two', 'num'),
  word(L, 'ẹ̀ta', 'three', 'num'),
  word(L, 'ẹ̀rin', 'four', 'num'),
  word(L, 'àrún', 'five', 'num'),
];

export const yoSentences = [
  sentence(L, 'Ẹ káàárọ̀.', 'Good morning.', { register: 'honorific', seniority: 'elder' }),
  sentence(L, 'Káàárọ̀.', 'Good morning.', { register: 'casual', seniority: 'peer' }),
  sentence(L, 'Ẹ kú iṣẹ́.', 'Well done (at work).', { register: 'honorific', seniority: 'elder' }),
  sentence(L, 'Ẹ ṣé mà.', "Thank you, ma'am.", { register: 'honorific', seniority: 'elder', altEn: ['Thank you ma', 'Thanks, ma\'am'] }),
  sentence(L, 'O ṣé.', 'Thank you.', { register: 'casual', seniority: 'peer', altEn: ['Thanks'] }),
  sentence(L, 'Kí ni orúkọ yín?', 'What is your name?', { register: 'honorific', seniority: 'elder' }),
  sentence(L, 'Kí ni orúkọ rẹ?', 'What is your name?', { register: 'casual', seniority: 'peer' }),
  sentence(L, 'Orúkọ mi ni Túndé.', 'My name is Tunde.'),
  sentence(L, 'Mo fẹ́ omi.', 'I want water.'),
  sentence(L, 'Mo ń lọ sí ọjà.', 'I am going to the market.'),
  sentence(L, 'Mo ti jẹun.', 'I have eaten.'),
  sentence(L, 'Ó ń kà ìwé.', 'He is reading a book.', { altEn: ['She is reading a book.', 'He/She is reading a book.'] }),
  sentence(L, 'Wọ́n ti dé.', 'He has arrived. (respectful)', { register: 'honorific', seniority: 'elder', altEn: ['She has arrived.', 'They have arrived.', 'He has arrived.'] }),
  sentence(L, 'Ọkọ mi ra ọkọ̀ tuntun.', 'My husband bought a new car.', { altEn: ['My husband bought a new vehicle.'] }),
  sentence(L, 'Mo ń kọ́ èdè Yorùbá.', 'I am learning the Yoruba language.', { altEn: ['I am learning Yoruba.'] }),
  sentence(L, 'Ẹ jọ̀ọ́, ẹ wọlé.', 'Please come in. (respectful)', { register: 'honorific', seniority: 'elder', altEn: ['Please, come in.', 'Please come in.'] }),
  sentence(L, 'Ṣé ẹ gbọ́ Yorùbá?', 'Do you understand Yoruba? (respectful)', { register: 'honorific', seniority: 'elder', altEn: ['Do you understand Yoruba?'] }),
  sentence(L, 'Ṣé o gbọ́ Yorùbá?', 'Do you understand Yoruba?', { register: 'casual', seniority: 'peer' }),
];
