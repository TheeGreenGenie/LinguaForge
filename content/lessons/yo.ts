// Yorùbá grammar curriculum, Levels 1–5 (A1–C1). Standard Yorùbá, Nigerian orthography.
// Authored for this app from general descriptions of Yorùbá grammar; every item is
// verified:false and should be checked by a native speaker (Settings → review sheet).
// Items the author is less certain about are noted in the lesson text.
import { lesson } from '../helpers';

const L = 'yo' as const;
const SRC = ['Written for this app; awaiting native-speaker review'];

export const yoCurriculum = [
  // ============================ LEVEL 1 (A1) ============================
  lesson(L, 'questions', 1, 13, 'grammar', 'Asking questions',
    `Question words usually come first and are often followed by **ni**:
    **Kí ni…?** What…? *Kí ni orúkọ rẹ?* "What is your name?"
    **Ta ni…?** Who…? *Ta ni olùkọ́ yín?* "Who is your teacher?"
    **Níbo ni…?** Where…? *Níbo ni o ń lọ?* "Where are you going?"
    **Báwo ni…?** How…? *Báwo ni?* "How are things?"
    **Èló ni?** How much (is it)? (at the market)
    **Nígbà wo ni…?** When…?
    **Ṣé…?** turns a statement into a yes/no question: *Ṣé o ti jẹun?* "Have you eaten?"`,
    [
      { type: 'mc', prompt: '"Where are you going?"', options: ['Níbo ni o ń lọ?', 'Ta ni o ń lọ?', 'Kí ni o ń lọ?'], answer: 'Níbo ni o ń lọ?' },
      { type: 'mc', prompt: '"How much is it?" (market)', options: ['Èló ni?', 'Báwo ni?', 'Ta ni?'], answer: 'Èló ni?' },
      { type: 'mc', prompt: 'Which word makes a yes/no question?', options: ['Ṣé', 'Kí', 'Ta'], answer: 'Ṣé' },
      { type: 'mc', prompt: '"Ta ni olùkọ́ yín?" means…', options: ['Who is your teacher?', 'Where is your teacher?', 'What is your teacher?'], answer: 'Who is your teacher?' },
      { type: 'type', prompt: 'Type the word for "who?" (2 words)', answer: 'Ta ni', side: 'target' },
    ], SRC),
  lesson(L, 'possession', 1, 14, 'grammar', 'Possession: my, your, his…',
    `The owner comes **after** the thing owned:
    **ilé mi** my house · **ilé rẹ** your house (familiar) · **ilé rẹ̀** his/her house · **ilé wa** our house · **ilé yín** your house (plural or respectful) · **ilé wọn** their house / his-her house (respectful)
    Note the tone: **rẹ** (mid) = your; **rẹ̀** (low) = his/her. A tone mark changes the person!
    Noun + noun works the same way: *ilé Túndé* "Tunde's house", *ọmọ ọba* "the king's child".`,
    [
      { type: 'mc', prompt: '"his/her book"', options: ['ìwé rẹ̀', 'ìwé rẹ', 'ìwé wa'], answer: 'ìwé rẹ̀', explanation: 'rẹ̀ (low tone) = his/her; rẹ (mid) = your.' },
      { type: 'mc', prompt: '"your book" (to an elder)', options: ['ìwé yín', 'ìwé rẹ', 'ìwé mi'], answer: 'ìwé yín', register: 'honorific', seniority: 'elder' },
      { type: 'mc', prompt: '"Tunde\'s house"', options: ['ilé Túndé', 'Túndé ilé', 'ilé ti Túndé ni'], answer: 'ilé Túndé' },
      { type: 'type', prompt: 'Type "our house"', answer: 'ilé wa', side: 'target' },
    ], SRC),
  lesson(L, 'being', 1, 15, 'grammar', '"To be": jẹ́, ni, wà, and describing words',
    `Yorùbá splits English "to be" into several words:
    **jẹ́**: identity: *Mo jẹ́ olùkọ́* "I am a teacher."
    **ni** (focus, very common): *Olùkọ́ ni mí* "I am a teacher" (lit. "a teacher is me").
    **wà**: exist / be located: *Ó wà nílé* "He/she is at home."
    Many describing words are **verbs**, so no "be" is needed: *Ó dára* "It is good." *Ó tóbi* "It is big." *Ó ga* "He/she is tall."
    "There isn't / he isn't here": **Kò sí**.`,
    [
      { type: 'mc', prompt: '"He/she is at home"', options: ['Ó wà nílé', 'Ó jẹ́ nílé', 'Ó ni ilé'], answer: 'Ó wà nílé' },
      { type: 'mc', prompt: '"It is good"', options: ['Ó dára', 'Ó jẹ́ dára', 'Ó wà dára'], answer: 'Ó dára', explanation: 'dára is itself a verb: "be good".' },
      { type: 'mc', prompt: '"Olùkọ́ ni mí" means…', options: ['I am a teacher', 'My teacher', 'The teacher sees me'], answer: 'I am a teacher' },
      { type: 'mc', prompt: '"He isn\'t here / there isn\'t any"', options: ['Kò sí', 'Kò wà', 'Kò jẹ́'], answer: 'Kò sí' },
    ], SRC),
  lesson(L, 'negation', 1, 16, 'grammar', 'Saying "not"',
    `**kò** not (past/present): *Kò lọ* "He/she didn't go." With *mo* "I": *Mi ò lọ* / *Èmi kò lọ* "I didn't go."
    **kò ní** will not: *Mi ò ní lọ* "I won't go."
    **kì í** does not (habitually): *Kì í mu ọtí* "He/she doesn't drink alcohol."
    **kì í ṣe** is not (identity): *Kì í ṣe olùkọ́* "He/she is not a teacher."
    **má** don't (command): *Má lọ!* "Don't go!" To an elder: *Ẹ má lọ.*
    Common phrase: *Mi ò mọ̀* "I don't know."`,
    [
      { type: 'mc', prompt: '"I don\'t know"', options: ['Mi ò mọ̀', 'Mo mọ̀', 'Má mọ̀'], answer: 'Mi ò mọ̀' },
      { type: 'mc', prompt: '"Don\'t go!" (to a friend)', options: ['Má lọ!', 'Kò lọ!', 'Kì í lọ!'], answer: 'Má lọ!' },
      { type: 'mc', prompt: '"I won\'t go"', options: ['Mi ò ní lọ', 'Mi ò lọ', 'Má lọ'], answer: 'Mi ò ní lọ' },
      { type: 'mc', prompt: '"He is not a teacher"', options: ['Kì í ṣe olùkọ́', 'Kò olùkọ́', 'Má olùkọ́'], answer: 'Kì í ṣe olùkọ́' },
    ], SRC),
  lesson(L, 'numbers-1-10', 1, 17, 'grammar', 'Numbers 1–10',
    `Yorùbá numbers have a **counting form** and a **describing form** (after a noun):
    1 ọ̀kan / kan · 2 èjì / méjì · 3 ẹ̀ta / mẹ́ta · 4 ẹ̀rin / mẹ́rin · 5 àrún / márùn-ún · 6 ẹ̀fà / mẹ́fà · 7 èje / méje · 8 ẹ̀jọ / mẹ́jọ · 9 ẹ̀sán / mẹ́sàn-án · 10 ẹ̀wá / mẹ́wàá
    *ọmọ kan* "one child", *ọmọ méjì* "two children", *ìwé mẹ́ta* "three books".
    Tone marks matter here too. Watch them carefully.`,
    [
      { type: 'mc', prompt: '"two children"', options: ['ọmọ méjì', 'ọmọ èjì', 'méjì ọmọ'], answer: 'ọmọ méjì' },
      { type: 'mc', prompt: 'The counting word for 3', options: ['ẹ̀ta', 'ẹ̀rin', 'èjì'], answer: 'ẹ̀ta' },
      { type: 'mc', prompt: '"one child"', options: ['ọmọ kan', 'ọmọ ọ̀kan', 'kan ọmọ'], answer: 'ọmọ kan' },
      { type: 'type', prompt: 'Type the counting word for 1', answer: 'ọ̀kan', side: 'target' },
    ], SRC),

  // ============================ LEVEL 2 (A2) ============================
  lesson(L, 'aspect', 2, 20, 'grammar', 'Time and aspect: ti, ń, máa ń, máa, kò tíì',
    `Yorùbá marks *how* an action happens with small words before the verb:
    **ti** completed: *Mo ti jẹun* "I have eaten."
    **ń** ongoing: *Mo ń jẹun* "I am eating."
    **máa ń** habitual: *Mo máa ń jẹ ìrẹsì* "I (usually) eat rice."
    **máa / yóò / á** future: *Mo máa lọ* · *Èmi yóò lọ* · *Màá lọ* "I will go."
    **kò tíì** not yet: *Kò tíì dé* "He/she hasn't arrived yet."
    A bare verb usually means a completed past event: *Mo lọ* "I went."`,
    [
      { type: 'mc', prompt: '"I usually eat rice"', options: ['Mo máa ń jẹ ìrẹsì', 'Mo ti jẹ ìrẹsì', 'Mo ń jẹ ìrẹsì'], answer: 'Mo máa ń jẹ ìrẹsì' },
      { type: 'mc', prompt: '"He hasn\'t arrived yet"', options: ['Kò tíì dé', 'Kò dé', 'Kò ní dé'], answer: 'Kò tíì dé' },
      { type: 'mc', prompt: '"I will go"', options: ['Mo máa lọ', 'Mo ti lọ', 'Mo ń lọ'], answer: 'Mo máa lọ' },
      { type: 'mc', prompt: '"Mo ti jẹun" means…', options: ['I have eaten', 'I am eating', 'I will eat'], answer: 'I have eaten' },
    ], SRC),
  lesson(L, 'requests', 2, 21, 'register', 'Commands and polite requests',
    `A bare verb is a command: *Wá!* "Come!" *Jókòó!* "Sit!" Fine with children and close friends.
    To elders and strangers, always use **ẹ** + verb, often with **Ẹ jọ̀ọ́** "please": *Ẹ jọ̀ọ́, ẹ jókòó* "Please sit down."
    Negative: **Má** (familiar) / **Ẹ má** (respectful): *Ẹ má bínú* "Sorry / please don't be upset."
    "Give me…": *Fún mi ní omi* "Give me water" → politely *Ẹ jọ̀ọ́, ẹ fún mi ní omi.*`,
    [
      { type: 'register-scene', prompt: 'Ask an elderly visitor to sit down.', options: ['Ẹ jọ̀ọ́, ẹ jókòó', 'Jókòó!', 'Jọ̀ọ́ jókòó'], answer: 'Ẹ jọ̀ọ́, ẹ jókòó', register: 'honorific', seniority: 'elder' },
      { type: 'register-scene', prompt: 'You bumped into an older woman. Apologise.', options: ['Ẹ má bínú', 'Má bínú', 'Kò sí'], answer: 'Ẹ má bínú', register: 'honorific', seniority: 'elder' },
      { type: 'register-scene', prompt: 'Tell your little brother "Come!"', options: ['Wá!', 'Ẹ wá!'], answer: 'Wá!', register: 'casual', seniority: 'younger' },
      { type: 'mc', prompt: '"Give me water"', options: ['Fún mi ní omi', 'Mi fún omi', 'Omi fún mi ní'], answer: 'Fún mi ní omi' },
    ], SRC),
  lesson(L, 'location', 2, 22, 'grammar', 'Place words: ní, sí, láti, nínú, lórí…',
    `**ní** at/in (no movement) · **sí** to (movement) · **láti** from · **fún** for · **pẹ̀lú** with
    **nínú** inside · **lórí** on top of · **lábẹ́** under · **lẹ́yìn** behind / after · **níwájú** in front of
    *Mo ń lọ sí ọjà* "I'm going to the market." *Ìwé wà lórí tábìlì* "The book is on the table."
    **ní** often merges with the next word: ní ilé → **nílé**, ní ọjà → **lọ́jà** (n → l before a vowel other than i).`,
    [
      { type: 'mc', prompt: '"I\'m going to the market"', options: ['Mo ń lọ sí ọjà', 'Mo ń lọ ní ọjà', 'Mo ń lọ láti ọjà'], answer: 'Mo ń lọ sí ọjà' },
      { type: 'mc', prompt: '"inside the house"', options: ['nínú ilé', 'lórí ilé', 'lábẹ́ ilé'], answer: 'nínú ilé' },
      { type: 'mc', prompt: '"nílé" is short for…', options: ['ní ilé', 'ní ẹ̀yìn', 'nínú'], answer: 'ní ilé' },
      { type: 'mc', prompt: '"from Lagos"', options: ['láti Èkó', 'sí Èkó', 'fún Èkó'], answer: 'láti Èkó' },
    ], SRC),
  lesson(L, 'serial-verbs', 2, 23, 'grammar', 'Verb chains (serial verbs)',
    `Yorùbá often strings verbs together where English uses one verb or a preposition:
    *Ó mú ìwé wá* "He/she brought the book" (lit. took book came).
    *Mo ra ẹja jẹ* "I bought fish and ate it."
    *Gbé e wá* "Bring it here" (lit. carry it come).
    *Ó sáré lọ* "He/she ran away" (lit. ran went).
    When translating into English, merge the chain into natural English.`,
    [
      { type: 'mc', prompt: '"Ó mú ìwé wá" means…', options: ['He/she brought the book', 'He took the book away', 'He came for the book'], answer: 'He/she brought the book' },
      { type: 'mc', prompt: '"Ó sáré lọ" means…', options: ['He/she ran away', 'He/she is running', 'He/she will run'], answer: 'He/she ran away' },
    ], SRC),
  lesson(L, 'comparison', 2, 24, 'grammar', 'Comparisons: ju … lọ',
    `**X + describing verb + ju + Y + lọ**: *Adé ga ju Túndé lọ* "Ade is taller than Tunde."
    **jù lọ** = the most: *Òun ló ga jù lọ* "He/she is the tallest."
    **bí** / **bíi** = like / as: *Ó ga bí bàbá rẹ̀* "He's as tall as his father."`,
    [
      { type: 'mc', prompt: '"Ade is taller than Tunde"', options: ['Adé ga ju Túndé lọ', 'Adé ju ga Túndé', 'Túndé ga ju Adé lọ'], answer: 'Adé ga ju Túndé lọ' },
      { type: 'mc', prompt: '"the most / -est" is…', options: ['jù lọ', 'ju … lọ', 'bí'], answer: 'jù lọ' },
    ], SRC),
  lesson(L, 'word-building', 2, 25, 'grammar', 'Building words with prefixes',
    `Many nouns are built from verbs and phrases:
    **oní-** "owner / person with": *onílé* landlord (ilé = house), *oníṣòwò* trader
    **olù-** "one who does": *olùkọ́* teacher (kọ́ = teach)
    **a-** "one who": *akẹ́kọ̀ọ́* student (kọ́ ẹ̀kọ́ = learn a lesson)
    **ì- / à-** turn verbs into nouns: *ìfẹ́* love (fẹ́ = love)
    **àì-** "not / lack of": *àìsàn* illness (sàn = get well), *àìmọ̀* ignorance (mọ̀ = know)
    Recognising these lets you guess new words while reading.`,
    [
      { type: 'mc', prompt: '"olùkọ́" (kọ́ = teach) means…', options: ['teacher', 'student', 'school'], answer: 'teacher' },
      { type: 'mc', prompt: '"àìsàn" (sàn = get well) means…', options: ['illness', 'health', 'doctor'], answer: 'illness' },
      { type: 'mc', prompt: '"onílé" (ilé = house) means…', options: ['landlord / house owner', 'house builder', 'homeless person'], answer: 'landlord / house owner' },
    ], SRC),
  lesson(L, 'days-times', 2, 26, 'grammar', 'Days and times of day',
    `Times of day: **àárọ̀** morning · **ọ̀sán** afternoon · **ìrọ̀lẹ́** evening · **alẹ́** night (hence *Ẹ káàárọ̀, Ẹ káàsán, Ẹ kú alẹ́*).
    Days (traditional names): Ọjọ́ Àìkú (Sunday) · Ọjọ́ Ajé (Monday) · Ọjọ́ Ìṣẹ́gun (Tuesday) · Ọjọ́rú (Wednesday) · Ọjọ́bọ̀ (Thursday) · Ọjọ́ Ẹtì (Friday) · Ọjọ́ Àbámẹ́ta (Saturday).
    **lónìí** today · **lánàá** yesterday · **lọ́la** tomorrow (from ní + òní / àná / ọ̀la).
    *Day names vary somewhat by region; native-speaker check pending.*`,
    [
      { type: 'mc', prompt: '"àárọ̀" means…', options: ['morning', 'night', 'afternoon'], answer: 'morning' },
      { type: 'mc', prompt: '"Ọjọ́ Ajé" is…', options: ['Monday', 'Friday', 'Sunday'], answer: 'Monday' },
      { type: 'mc', prompt: '"lọ́la" means…', options: ['tomorrow', 'yesterday', 'today'], answer: 'tomorrow' },
    ], SRC),

  // ============================ LEVEL 3 (B1) ============================
  lesson(L, 'relative-ti', 3, 30, 'grammar', 'Relative clauses with tí',
    `**tí** = who / which / that, placed after the noun:
    *ọkùnrin tí ó wá* → usually **ọkùnrin tó wá** "the man who came" (tí + ó → **tó**)
    *ìwé tí mo rà* "the book (that) I bought"
    *ibi tí a ń lọ* "the place where we're going"
    With **náà** "the (aforementioned)": *ọkùnrin tó wá náà* "the man who came."`,
    [
      { type: 'mc', prompt: '"the book I bought"', options: ['ìwé tí mo rà', 'mo rà ìwé tí', 'tí ìwé mo rà'], answer: 'ìwé tí mo rà' },
      { type: 'mc', prompt: '"tó" in "ọkùnrin tó wá" is a contraction of…', options: ['tí ó', 'tí o', 'tó ó'], answer: 'tí ó' },
      { type: 'mc', prompt: '"ibi tí a ń lọ" means…', options: ['the place where we are going', 'we are going there', 'where are we going?'], answer: 'the place where we are going' },
    ], SRC),
  lesson(L, 'focus-ni', 3, 31, 'grammar', 'Focus with ni ("It was X who…")',
    `To highlight something, move it to the front and add **ni**:
    *Adé wá* "Ade came" → **Adé ni ó wá** → **Adé ló wá** "It was ADE who came." (ni + ó → **ló**)
    *Ìwé ni mo rà* "It was a BOOK that I bought."
    *Lánàá ni wọ́n dé* "It was YESTERDAY that they arrived."
    Question words use the same pattern: *Kí ni o rà?* "What did you buy?"
    Translate focus into natural English emphasis, not always "it was…".`,
    [
      { type: 'mc', prompt: '"It was Ade who came"', options: ['Adé ló wá', 'Adé wá ni', 'Ni Adé wá'], answer: 'Adé ló wá' },
      { type: 'mc', prompt: '"ló" is a contraction of…', options: ['ni ó', 'lọ ó', 'ní ó'], answer: 'ni ó' },
      { type: 'mc', prompt: '"Ìwé ni mo rà" means…', options: ['It was a book that I bought', 'I bought a book there', 'Is it a book I bought?'], answer: 'It was a book that I bought' },
    ], SRC),
  lesson(L, 'conditional', 3, 32, 'grammar', '"If" and "when": bí/tí … bá',
    `**Bí / Tí + subject + bá + verb** = "if": *Tí òjò bá rọ̀, mi ò ní lọ* "If it rains, I won't go."
    *Bí o bá wá, a máa lọ papọ̀* "If you come, we'll go together."
    **nígbà tí** = when: *Nígbà tí mo dé, wọ́n ti lọ* "When I arrived, they had left."
    **kí … tó** = before: *Kí o tó lọ, jẹun* "Before you go, eat."
    **lẹ́yìn tí** = after.`,
    [
      { type: 'mc', prompt: '"If it rains…"', options: ['Tí òjò bá rọ̀…', 'Òjò rọ̀ tí…', 'Bá òjò rọ̀…'], answer: 'Tí òjò bá rọ̀…' },
      { type: 'mc', prompt: '"nígbà tí" means…', options: ['when', 'if', 'before'], answer: 'when' },
      { type: 'mc', prompt: '"Kí o tó lọ" means…', options: ['Before you go', 'After you go', 'If you go'], answer: 'Before you go' },
    ], SRC),
  lesson(L, 'reported-speech', 3, 33, 'grammar', 'Reported speech and òun',
    `**pé** = "that": *Ó sọ pé òun ti dé* "He/she said that he/she has arrived."
    Yorùbá has a special pronoun for reported speech: **òun** refers back to **the speaker being reported**, while **ó** refers to **someone else**:
    *Adé sọ pé òun máa wá* "Ade said that he (Ade himself) will come."
    *Adé sọ pé ó máa wá* "Ade said that he/she (someone else) will come."
    This distinction is invisible in English, so read carefully when translating.
    **kí** = "that (should)" for wishes and requests: *Mo fẹ́ kí o wá* "I want you to come."`,
    [
      { type: 'mc', prompt: '"Adé sọ pé òun máa wá": who will come?', options: ['Ade himself', 'someone else', 'we cannot tell'], answer: 'Ade himself' },
      { type: 'mc', prompt: '"I want you to come"', options: ['Mo fẹ́ kí o wá', 'Mo fẹ́ pé o wá', 'Mo fẹ́ o wá kí'], answer: 'Mo fẹ́ kí o wá' },
      { type: 'mc', prompt: '"pé" means…', options: ['that (reporting)', 'because', 'if'], answer: 'that (reporting)' },
    ], SRC),
  lesson(L, 'split-verbs', 3, 34, 'grammar', 'Split verbs (ba … jẹ́)',
    `Some verbs split around their object:
    **ba … jẹ́** spoil: *Ó ba iṣẹ́ náà jẹ́* "He/she spoiled the work." Without an object they join: *Ọkọ̀ náà ti bàjẹ́* "The vehicle has broken down."
    **rán … létí** remind: *Rán mi létí* "Remind me."
    **fi … sílẹ̀** leave/put down: *Fi í sílẹ̀* "Leave it."
    When you meet a verb that seems to have no ending, look for its other half later in the sentence.`,
    [
      { type: 'mc', prompt: '"Ọkọ̀ náà ti bàjẹ́" means…', options: ['The vehicle has broken down', 'The vehicle is new', 'He drove the vehicle'], answer: 'The vehicle has broken down' },
      { type: 'mc', prompt: '"Rán mi létí" means…', options: ['Remind me', 'Send me', 'Leave me'], answer: 'Remind me' },
      { type: 'mc', prompt: 'In "Ó ba iṣẹ́ náà jẹ́", the verb is…', options: ['ba … jẹ́ (spoil)', 'jẹ́ (be)', 'iṣẹ́ (work)'], answer: 'ba … jẹ́ (spoil)' },
    ], SRC),
  lesson(L, 'because-so', 3, 35, 'grammar', 'Because, so, but, and',
    `**nítorí pé / torí pé** because · **nítorí náà** therefore · **ṣùgbọ́n** but · **tàbí** or · **bákan náà** likewise/also
    **"and"**: **àti** joins nouns (*bàbá àti màmá*); **sì** joins clauses (*Ó jẹun, ó sì sùn* "He ate and slept").
    *Mi ò lọ nítorí pé òjò ń rọ̀* "I didn't go because it was raining."`,
    [
      { type: 'mc', prompt: '"and" between two nouns', options: ['àti', 'sì', 'ṣùgbọ́n'], answer: 'àti' },
      { type: 'mc', prompt: '"but"', options: ['ṣùgbọ́n', 'tàbí', 'nítorí náà'], answer: 'ṣùgbọ́n' },
      { type: 'mc', prompt: '"because"', options: ['nítorí pé', 'nítorí náà', 'bákan náà'], answer: 'nítorí pé' },
    ], SRC),

  // ============================ LEVEL 4 (B2) ============================
  lesson(L, 'elision', 4, 40, 'tone', 'Reading merged words (elision)',
    `In natural writing, vowels meet and one drops. Expand them in your head when reading:
    ní ilé → **nílé** · ní ọjà → **lọ́jà** · ní òní → **lónìí** · jẹ oúnjẹ → **jẹun** · ra ẹja → **rẹja** · wá sí ilé → **wá sílé** · tí ó → **tó** · ni ó → **ló**
    The surviving vowel keeps its tone, and the merged word often keeps the tone of the dropped syllable too, so tone marks on merged words still matter.
    Exam texts and MENYO passages use these contractions often.`,
    [
      { type: 'mc', prompt: '"lọ́jà" expands to…', options: ['ní ọjà', 'lọ ọjà', 'ní ilé'], answer: 'ní ọjà' },
      { type: 'mc', prompt: '"jẹun" expands to…', options: ['jẹ oúnjẹ', 'jẹ un', 'jẹ ẹja'], answer: 'jẹ oúnjẹ' },
      { type: 'mc', prompt: '"wá sílé" means…', options: ['come home', 'come out', 'go to the market'], answer: 'come home' },
    ], SRC),
  lesson(L, 'impersonal', 4, 41, 'grammar', 'English passives in Yorùbá: impersonal wọ́n',
    `Yorùbá has no true passive. It uses **wọ́n** "they" with no specific person:
    *Wọ́n jí ọkọ̀ mi* "My car was stolen" (lit. they stole my car).
    *Wọ́n bí i ní Èkó* "He/she was born in Lagos."
    *Wọ́n sọ pé…* "It is said that…"
    Remember: **wọ́n** can also be the respectful "he/she", so use context to decide between "they", an elder, or a passive.`,
    [
      { type: 'mc', prompt: '"Wọ́n jí ọkọ̀ mi" is best translated…', options: ['My car was stolen', 'They are my car', 'I stole their car'], answer: 'My car was stolen' },
      { type: 'mc', prompt: '"Wọ́n sọ pé…" can mean…', options: ['It is said that…', 'I said that…', 'Say that!'], answer: 'It is said that…' },
    ], SRC),
  lesson(L, 'formal-writing', 4, 42, 'register', 'Formal writing and titles',
    `Formal letters and official texts use **respect forms throughout**: ẹ / yín for "you", wọ́n / wọn for an honoured third person.
    Titles: **Ọ̀gbẹ́ni** Mr. · **Ìyáàfin** Mrs. · **Arábìnrin** Miss/Ms. · **Ọ̀mọ̀wé** Dr. (scholar) · **Olóyè** Chief.
    Express thanks and good wishes respectfully: *Ẹ ṣé púpọ̀* "Thank you very much."
    In a translation exam, a formal passage translated with familiar forms (o, rẹ, ó for an elder) is marked as a register error.`,
    [
      { type: 'mc', prompt: '"Mr. Adé"', options: ['Ọ̀gbẹ́ni Adé', 'Ìyáàfin Adé', 'Arábìnrin Adé'], answer: 'Ọ̀gbẹ́ni Adé' },
      { type: 'register-scene', prompt: 'Thanking a school principal in a formal letter', options: ['Ẹ ṣé púpọ̀', 'O ṣé o', 'Ṣé dáadáa ni?'], answer: 'Ẹ ṣé púpọ̀', register: 'honorific', seniority: 'elder' },
      { type: 'mc', prompt: '"Ọ̀mọ̀wé" is a title for…', options: ['a scholar / doctor', 'a chief', 'a child'], answer: 'a scholar / doctor' },
    ], SRC),
  lesson(L, 'reduplication', 4, 43, 'grammar', 'Repetition for meaning',
    `Repeating a word changes its meaning:
    *díẹ̀* a little → **díẹ̀díẹ̀** little by little, slowly · *dáadáa* well · **kíákíá** quickly
    Numbers: *méjì* two → **méjì méjì** two by two / two each
    Verb → noun: *lọ* go → *lílọ* going; *wá* come → *wíwá* coming (the first consonant + i with high tone is added).
    *Ẹ máa rìn díẹ̀díẹ̀* "Walk slowly."`,
    [
      { type: 'mc', prompt: '"díẹ̀díẹ̀" means…', options: ['little by little / slowly', 'very big', 'a lot'], answer: 'little by little / slowly' },
      { type: 'mc', prompt: '"méjì méjì" means…', options: ['two by two', 'twenty-two', 'four'], answer: 'two by two' },
      { type: 'mc', prompt: '"lílọ" (from lọ) means…', options: ['going (the act)', 'gone', 'go!'], answer: 'going (the act)' },
    ], SRC),

  // ============================ LEVEL 5 (C1) ============================
  lesson(L, 'proverbs', 5, 50, 'grammar', 'Proverbs (òwe)',
    `Proverbs are central to educated Yorùbá speech and writing. A famous saying about proverbs themselves:
    **Òwe lẹṣin ọ̀rọ̀; bí ọ̀rọ̀ bá sọnù, òwe la fi ń wá a.** "A proverb is the horse of speech; when words are lost, we use proverbs to find them."
    **Ìka kò dọ́gba.** "Fingers are not equal": people differ in ability and fortune.
    **Àgbà kì í wà lọ́jà kí orí ọmọ tuntun wọ́.** "An elder does not stay in the market and let a newborn's head be crooked": elders are responsible for guiding the young.
    Translate the *meaning*, and keep the image when it's clear in English.
    *Wording of proverbs varies; check with a native speaker.*`,
    [
      { type: 'mc', prompt: '"Ìka kò dọ́gba" means…', options: ['People are not all the same', 'Count your fingers', 'Hands are for work'], answer: 'People are not all the same' },
      { type: 'mc', prompt: 'What is òwe?', options: ['a proverb', 'a song', 'a greeting'], answer: 'a proverb' },
      { type: 'mc', prompt: 'The proverb about the elder in the market teaches…', options: ["elders must guide the young", 'markets are dangerous', 'babies should stay home'], answer: "elders must guide the young" },
    ], SRC),
  lesson(L, 'unmarked-text', 5, 51, 'tone', 'Reading text without tone marks',
    `Much real-world Yorùbá (social media, signs, some newspapers) leaves out tone marks and even underdots. Then *oko* could be **ọkọ** (husband), **ọkọ̀** (vehicle), **ọkọ́** (hoe) or **oko** (farm).
    Strategy: (1) use the surrounding words: *wa oko* "drive a vehicle" vs *lọ sí oko* "go to the farm"; (2) check the dictionary for all toned versions; (3) when writing, always restore full marks.
    This app only uses properly marked text in lessons and exams. Passages that fail the check are flagged ⚠.`,
    [
      { type: 'mc', prompt: 'Unmarked "oko" in "Mo lọ sí oko láti ṣiṣẹ́" (I went to the ___ to work) is most likely…', options: ['oko (farm)', 'ọkọ (husband)', 'ọkọ́ (hoe)'], answer: 'oko (farm)' },
      { type: 'mc', prompt: 'Unmarked "oko" in "Ó wa oko lọ sí Èkó" (He drove the ___ to Lagos) is most likely…', options: ['ọkọ̀ (vehicle)', 'oko (farm)', 'ọkọ (husband)'], answer: 'ọkọ̀ (vehicle)' },
      { type: 'type', prompt: 'Restore the tone marks: "ede" (= language)', answer: 'èdè', side: 'target', hint: 'low-low' },
    ], SRC),
  lesson(L, 'big-numbers', 5, 52, 'grammar', 'Large numbers (base 20)',
    `Traditional Yorùbá counts in **twenties**, and some numbers are formed by subtraction:
    20 **ogún** · 30 **ọgbọ̀n** · 40 **ogójì** (2 × 20) · 60 **ọgọ́ta** (3 × 20) · 80 **ọgọ́rin** · 100 **ọgọ́rùn-ún** · 200 **igba** · 1000 **ẹgbẹ̀rún**
    15 is "five less than twenty" and 25 is "five less than thirty": the subtractive pattern runs through the system.
    In modern life, large numbers (prices, dates) are often said in English, but older texts and formal writing use the traditional forms.
    *Number words: native-speaker check pending.*`,
    [
      { type: 'mc', prompt: '20 is…', options: ['ogún', 'ọgbọ̀n', 'igba'], answer: 'ogún' },
      { type: 'mc', prompt: '200 is…', options: ['igba', 'igbá', 'ìgbà'], answer: 'igba', explanation: 'igba (mid-mid) = 200; igbá = calabash; ìgbà = time.' },
      { type: 'mc', prompt: 'The traditional counting base is…', options: ['20', '10', '12'], answer: '20' },
    ], SRC),
  lesson(L, 'translation-strategies', 5, 53, 'grammar', 'Translating paragraphs',
    `Yorùbá → English:
    • **ó** has no gender: choose he/she/it from context. Honorific **wọ́n** for one person → "he/she", not "they".
    • Aspect, not tense: a bare verb is usually past; **ń** can be present or past progressive.
    • Serial verbs → one English verb (*mú … wá* = bring).
    • Focus **ni** → English emphasis or "it was … who".
    • Expand contractions (nílé, ló, tó) before translating.
    English → Yorùbá: decide the **register** first (who is addressed?), then mark every tone and underdot. The certification exam checks both.`,
    [
      { type: 'mc', prompt: '"Bàbá wọ́n ti dé" (about one respected man): "wọ́n" →', options: ['he', 'they'], answer: 'he' },
      { type: 'mc', prompt: '"Ó mú omi wá" →', options: ['He/she brought water', 'He took water and came separately', 'Water came'], answer: 'He/she brought water' },
      { type: 'mc', prompt: 'Before translating English into Yorùbá, first decide…', options: ['the register (who is addressed)', 'the word count', 'the font'], answer: 'the register (who is addressed)' },
    ], SRC),
];
