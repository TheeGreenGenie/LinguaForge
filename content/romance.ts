// Spanish, French and Portuguese (Brazil) authored starter content.
import { lesson, sentence, word } from './helpers';

// ============================ SPANISH ============================
export const esLessons = [
  lesson('es', 'alphabet', 0, 1, 'script', 'Spanish letters and sounds',
    `Spanish spelling is very regular: you can almost always read a word aloud from its spelling.

    **Vowels** are short and pure: a (f**a**ther), e (b**e**d), i (s**ee**), o (n**o**te, no glide), u (f**oo**d).
    **ñ** is its own letter: "ny" as in *canyon* (año = year).
    **h** is silent (hola = OH-lah). **j** and **g** before e/i are a throaty "h" (jamón, gente).
    **ll** and **y** sound like "y" in most of Latin America (llamar).
    **rr** is a rolled r; a single **r** is a quick tap (pero "but" vs perro "dog").
    **v** and **b** sound the same.`,
    [
      { type: 'letter-sound', prompt: 'How is "h" pronounced in "hola"?', options: ['silent', 'like English h', 'like j', 'like ch'], answer: 'silent' },
      { type: 'letter-sound', prompt: '"ñ" in "año" sounds like…', options: ['ny in canyon', 'n in no', 'ng in sing', 'gn in sign'], answer: 'ny in canyon' },
      { type: 'minimal-pair', prompt: 'Which word means "dog"?', options: ['perro', 'pero'], answer: 'perro' },
      { type: 'letter-sound', prompt: '"j" in "jamón" sounds like…', options: ['a throaty h', 'j in jam', 'y in yes', 'zh in pleasure'], answer: 'a throaty h' },
    ]),
  lesson('es', 'accents', 0, 2, 'script', 'Accent marks',
    `The **written accent** (á é í ó ú) marks the stressed syllable when it breaks the normal rule, and it also tells apart words that would otherwise look the same:

    **sí** yes / **si** if · **él** he / **el** the · **tú** you / **tu** your · **más** more / **mas** but (literary)

    **¿** and **¡** open questions and exclamations: ¿Cómo estás?

    Early on the app accepts a missing accent with a warning. From Level 2, accents are required.`,
    [
      { type: 'minimal-pair', prompt: 'Which means "yes"?', options: ['sí', 'si'], answer: 'sí' },
      { type: 'minimal-pair', prompt: 'Which means "he"?', options: ['él', 'el'], answer: 'él' },
      { type: 'type', prompt: 'Type "you" (informal subject pronoun)', answer: 'tú', side: 'target' },
    ]),
  lesson('es', 'register', 1, 10, 'register', 'tú vs usted',
    `**tú** is informal "you": friends, family, children, people your age.
    **usted** (written *Ud.*) is formal "you": elders, strangers, officials, customers. It takes **3rd-person** verb forms.

    ¿Cómo **estás**? (tú) · ¿Cómo **está** usted? (usted). Both mean "How are you?"
    **ustedes** = "you all" (both formal and informal in Latin America).`,
    [
      { type: 'register-scene', prompt: 'You ask an elderly neighbour how she is.', options: ['¿Cómo está usted?', '¿Cómo estás?'], answer: '¿Cómo está usted?', register: 'formal', seniority: 'elder' },
      { type: 'register-scene', prompt: 'You ask your friend how he is.', options: ['¿Cómo estás?', '¿Cómo está usted?'], answer: '¿Cómo estás?', register: 'casual', seniority: 'peer' },
      { type: 'register-scene', prompt: 'You speak to a police officer.', options: ['usted', 'tú'], answer: 'usted', register: 'formal' },
    ]),
  lesson('es', 'gender-present', 1, 11, 'grammar', 'Gender, articles and the present tense',
    `Every noun is **masculine** or **feminine**: **el libro** (the book), **la casa** (the house). Usually -o is masculine and -a is feminine, but not always (**el día**, **la mano**).
    "A/an": **un libro**, **una casa**. Plural: **los libros**, **las casas**.

    Regular verbs change their ending by person. **hablar** (to speak):
    yo **hablo** · tú **hablas** · él/ella/usted **habla** · nosotros **hablamos** · ellos/ustedes **hablan**
    -er verbs (comer): como, comes, come, comemos, comen. -ir verbs (escribir): escribo, escribes, escribe, escribimos, escriben.

    Subject pronouns are often dropped because the ending shows the person: **Hablo español** "I speak Spanish".`,
    [
      { type: 'mc', prompt: 'Which article goes with "casa"?', options: ['la', 'el'], answer: 'la' },
      { type: 'mc', prompt: 'Which article goes with "día"?', options: ['el', 'la'], answer: 'el', explanation: 'día is masculine even though it ends in -a.' },
      { type: 'type', prompt: 'Complete: nosotros ___ (hablar)', answer: 'hablamos', side: 'target' },
      { type: 'type', prompt: 'Translate: "I eat"', answer: 'como', accept: ['yo como'], side: 'target' },
    ]),
];
export const esWords = [
  ['hola', 'hello', 'intj'], ['gracias', 'thank you', 'intj'], ['sí', 'yes', 'adv'], ['no', 'no', 'adv'], ['por favor', 'please', 'phrase'],
  ['casa', 'house', 'noun'], ['agua', 'water', 'noun'], ['comida', 'food', 'noun'], ['libro', 'book', 'noun'], ['amigo', 'friend', 'noun'],
  ['madre', 'mother', 'noun'], ['padre', 'father', 'noun'], ['niño', 'child', 'noun'], ['día', 'day', 'noun'], ['año', 'year', 'noun'],
  ['ser', 'to be (permanent)', 'verb'], ['estar', 'to be (state, location)', 'verb'], ['tener', 'to have', 'verb'], ['ir', 'to go', 'verb'], ['comer', 'to eat', 'verb'],
  ['beber', 'to drink', 'verb'], ['leer', 'to read', 'verb'], ['escribir', 'to write', 'verb'], ['hablar', 'to speak', 'verb'], ['querer', 'to want', 'verb'],
  ['yo', 'I', 'pron'], ['tú', 'you (informal)', 'pron'], ['usted', 'you (formal)', 'pron'], ['él', 'he', 'pron'], ['ella', 'she', 'pron'], ['nosotros', 'we', 'pron'],
  ['perro', 'dog', 'noun'], ['pero', 'but', 'conj'],
].map(([l, g, p]) => word('es', l, g, p, p === 'pron' && l === 'usted' ? { register: 'formal' } : p === 'pron' && l === 'tú' ? { register: 'casual' } : {}));
export const esSentences = [
  sentence('es', '¿Cómo está usted?', 'How are you? (formal)', { register: 'formal', seniority: 'elder', altEn: ['How are you?'] }),
  sentence('es', '¿Cómo estás?', 'How are you?', { register: 'casual', seniority: 'peer' }),
  sentence('es', 'Quiero agua, por favor.', 'I want water, please.', { altEn: ['I would like water, please.'] }),
  sentence('es', 'Estoy leyendo un libro.', 'I am reading a book.'),
  sentence('es', 'Mi madre tiene un perro.', 'My mother has a dog.'),
  sentence('es', 'Hablo un poco de español.', 'I speak a little Spanish.'),
  sentence('es', 'Mañana vamos a la casa de mi amigo.', "Tomorrow we are going to my friend's house.", { altEn: ["Tomorrow we're going to my friend's house."] }),
];

// ============================ FRENCH ============================
export const frLessons = [
  lesson('fr', 'alphabet', 0, 1, 'script', 'French letters and sounds',
    `French spelling has many **silent letters**, so learning the patterns matters for reading.

    **Final consonants** are usually silent (petit = puh-TEE), except often **c, r, f, l** (think "CaReFuL").
    **ou** = "oo" (vous), **u** = "ee" with rounded lips (tu), **oi** = "wah" (moi), **eau/au** = "oh".
    **Nasal vowels**: an/en (≈ "ahn"), in (≈ "an"), on (≈ "ohn"); the n itself isn't pronounced.
    **r** is made in the throat. **h** is always silent.`,
    [
      { type: 'letter-sound', prompt: '"oi" in "moi" sounds like…', options: ['wah', 'oy', 'oh', 'wee'], answer: 'wah' },
      { type: 'letter-sound', prompt: 'The final "t" in "petit" is…', options: ['silent', 'pronounced t', 'pronounced d', 'pronounced sh'], answer: 'silent' },
      { type: 'letter-sound', prompt: '"ou" in "vous" sounds like…', options: ['oo in food', 'ow in cow', 'u in cut', 'oh'], answer: 'oo in food' },
    ]),
  lesson('fr', 'accents', 0, 2, 'script', 'Accents: é è ê ç',
    `**é** (aigu): "ay" (café) · **è** (grave): "eh" (père) · **ê** (circonflexe): "eh" (fête)
    **ç** (cédille) makes c sound like s before a, o, u (français, garçon)
    **à / a** and **où / ou** differ only in meaning: *à* to/at vs *a* has; *où* where vs *ou* or.
    **ë ï** (tréma): pronounce the vowel separately (Noël).`,
    [
      { type: 'minimal-pair', prompt: 'Which means "where"?', options: ['où', 'ou'], answer: 'où' },
      { type: 'minimal-pair', prompt: 'Which means "to / at"?', options: ['à', 'a'], answer: 'à' },
      { type: 'type', prompt: 'Type "French" (the language, lowercase)', answer: 'français', side: 'target' },
    ]),
  lesson('fr', 'register', 1, 10, 'register', 'tu vs vous',
    `**tu**: friends, family, children, pets, and peers who invite it.
    **vous**: anyone you don't know well, elders, at work, in shops; also always the plural "you".

    Wait for the other person to suggest **tutoyer** (using tu). Using tu too early can sound rude.
    *Comment **vas-tu**?* / *Comment **allez-vous**?* "How are you?"`,
    [
      { type: 'register-scene', prompt: 'You ask a shopkeeper how she is.', options: ['Comment allez-vous ?', 'Comment vas-tu ?'], answer: 'Comment allez-vous ?', register: 'formal' },
      { type: 'register-scene', prompt: 'You ask your little brother how he is.', options: ['Comment vas-tu ?', 'Comment allez-vous ?'], answer: 'Comment vas-tu ?', register: 'casual', seniority: 'younger' },
    ]),
  lesson('fr', 'gender-present', 1, 11, 'grammar', 'Gender, articles and the present tense',
    `Nouns are **masculine** or **feminine**: **le livre** (the book), **la maison** (the house). Before a vowel or silent h, both become **l'**: **l'eau**, **l'ami**. Plural: **les**.
    "A/an": **un livre**, **une maison**.

    Regular -er verbs. **parler** (to speak): je **parle** · tu **parles** · il/elle **parle** · nous **parlons** · vous **parlez** · ils/elles **parlent**.
    The -e, -es and -ent endings are **silent**, so parle, parles and parlent sound the same. That's why spelling matters for writing.

    Negation wraps the verb: **je ne parle pas** "I don't speak" (ne → **n'** before a vowel: je **n'**aime **pas**).`,
    [
      { type: 'mc', prompt: 'Which article goes with "maison"?', options: ['la', 'le'], answer: 'la' },
      { type: 'mc', prompt: '"the water" is…', options: ["l'eau", 'la eau', 'le eau'], answer: "l'eau" },
      { type: 'type', prompt: 'Complete: nous ___ (parler)', answer: 'parlons', side: 'target' },
      { type: 'type', prompt: 'Translate: "I don\'t speak"', answer: 'je ne parle pas', side: 'target' },
    ]),
];
export const frWords = [
  ['bonjour', 'hello', 'intj'], ['merci', 'thank you', 'intj'], ['oui', 'yes', 'adv'], ['non', 'no', 'adv'], ["s'il vous plaît", 'please (formal)', 'phrase'],
  ['maison', 'house', 'noun'], ['eau', 'water', 'noun'], ['livre', 'book', 'noun'], ['ami', 'friend', 'noun'], ['mère', 'mother', 'noun'], ['père', 'father', 'noun'],
  ['enfant', 'child', 'noun'], ['jour', 'day', 'noun'], ['être', 'to be', 'verb'], ['avoir', 'to have', 'verb'], ['aller', 'to go', 'verb'],
  ['manger', 'to eat', 'verb'], ['boire', 'to drink', 'verb'], ['lire', 'to read', 'verb'], ['écrire', 'to write', 'verb'], ['parler', 'to speak', 'verb'], ['vouloir', 'to want', 'verb'],
  ['je', 'I', 'pron'], ['tu', 'you (informal)', 'pron'], ['vous', 'you (formal or plural)', 'pron'], ['il', 'he', 'pron'], ['elle', 'she', 'pron'], ['nous', 'we', 'pron'],
  ['où', 'where', 'adv'], ['ou', 'or', 'conj'],
].map(([l, g, p]) => word('fr', l, g, p, l === 'vous' ? { register: 'formal' } : l === 'tu' ? { register: 'casual' } : {}));
export const frSentences = [
  sentence('fr', 'Comment allez-vous ?', 'How are you? (formal)', { register: 'formal', altEn: ['How are you?'] }),
  sentence('fr', 'Comment vas-tu ?', 'How are you?', { register: 'casual' }),
  sentence('fr', 'Je voudrais de l\'eau, s\'il vous plaît.', 'I would like some water, please.', { altEn: ["I'd like some water, please.", 'I would like water, please.'] }),
  sentence('fr', 'Je lis un livre.', 'I am reading a book.', { altEn: ['I read a book.'] }),
  sentence('fr', 'Ma mère parle français.', 'My mother speaks French.'),
  sentence('fr', 'Où est la maison de ton ami ?', "Where is your friend's house?"),
];

// ============================ PORTUGUESE (BRAZIL) ============================
export const ptLessons = [
  lesson('pt', 'alphabet', 0, 1, 'script', 'Portuguese letters and sounds (Brazil)',
    `**Nasal vowels**: **ã** (mãe = mother), **õ** (põe), and vowel + m/n at the end of a syllable (bom, sim). The sound goes through the nose.
    **lh** = "ly" (filho = son) · **nh** = "ny" (vinho = wine) · **ç** = s (coração)
    In Brazil, **t/d** before an "i" sound become "ch/j" (leite ≈ LAY-chee, dia ≈ JEE-ah).
    Initial **r** and **rr** sound like English "h" (rio ≈ HEE-oo). Final unstressed **o** sounds like "oo", final **e** like "ee".`,
    [
      { type: 'letter-sound', prompt: '"lh" in "filho" sounds like…', options: ['ly', 'l', 'lh as in English', 'y'], answer: 'ly' },
      { type: 'letter-sound', prompt: 'In Brazil, "rio" starts with a sound like…', options: ['English h', 'English r', 'rolled r', 'w'], answer: 'English h' },
      { type: 'letter-sound', prompt: '"ã" in "mãe" is…', options: ['a nasal vowel', 'a long a', 'silent', 'like "ay"'], answer: 'a nasal vowel' },
    ]),
  lesson('pt', 'accents', 0, 2, 'script', 'Accents: á â ã é ê ó ô õ ç',
    `**´** (agudo) marks an open stressed vowel (café, avó = grandmother) · **^** (circunflexo) a closed one (você, avô = grandfather)
    **~** (til) marks nasal vowels (pão, irmã) · **à** = a + a ("to the")
    **avó** (grandmother) vs **avô** (grandfather): the accent changes the word.`,
    [
      { type: 'minimal-pair', prompt: 'Which means "grandmother"?', options: ['avó', 'avô'], answer: 'avó' },
      { type: 'type', prompt: 'Type "bread"', answer: 'pão', side: 'target' },
    ]),
  lesson('pt', 'register', 1, 10, 'register', 'você, tu, o senhor / a senhora',
    `In Brazil, **você** is the everyday "you" (with 3rd-person verbs). Some regions use **tu**.
    For respect (elders, officials, customers) use **o senhor** (to a man) / **a senhora** (to a woman):
    *Como **você** está?* (friend) · *Como **o senhor** está?* (older man) · *Como **a senhora** está?* (older woman)`,
    [
      { type: 'register-scene', prompt: 'You ask an elderly woman how she is.', options: ['Como a senhora está?', 'Como você está?'], answer: 'Como a senhora está?', register: 'formal', seniority: 'elder' },
      { type: 'register-scene', prompt: 'You ask a friend how she is.', options: ['Como você está?', 'Como a senhora está?'], answer: 'Como você está?', register: 'casual', seniority: 'peer' },
    ]),
  lesson('pt', 'gender-present', 1, 11, 'grammar', 'Gender, articles and the present tense',
    `Nouns are **masculine** or **feminine**: **o livro** (the book), **a casa** (the house). Plural: **os livros**, **as casas**. "A/an": **um livro**, **uma casa**.
    Prepositions merge with articles: **de + o = do**, **em + a = na**, **a + a = à**: *a casa do meu amigo* "my friend's house".

    Regular -ar verbs. **falar** (to speak): eu **falo** · você/ele/ela **fala** · nós **falamos** · vocês/eles **falam**.
    In Brazil, **você** takes the same verb form as ele/ela.

    Negation: put **não** before the verb: *Eu não falo* "I don't speak".`,
    [
      { type: 'mc', prompt: 'Which article goes with "casa"?', options: ['a', 'o'], answer: 'a' },
      { type: 'mc', prompt: 'de + o =', options: ['do', 'de o', 'da'], answer: 'do' },
      { type: 'type', prompt: 'Complete: nós ___ (falar)', answer: 'falamos', side: 'target' },
      { type: 'type', prompt: 'Translate: "I don\'t speak"', answer: 'eu não falo', accept: ['não falo'], side: 'target' },
    ]),
];
export const ptWords = [
  ['olá', 'hello', 'intj'], ['obrigado', 'thank you (said by a man)', 'intj'], ['obrigada', 'thank you (said by a woman)', 'intj'], ['sim', 'yes', 'adv'], ['não', 'no', 'adv'],
  ['casa', 'house', 'noun'], ['água', 'water', 'noun'], ['pão', 'bread', 'noun'], ['livro', 'book', 'noun'], ['amigo', 'friend', 'noun'], ['mãe', 'mother', 'noun'], ['pai', 'father', 'noun'],
  ['filho', 'son', 'noun'], ['avó', 'grandmother', 'noun'], ['avô', 'grandfather', 'noun'], ['dia', 'day', 'noun'],
  ['ser', 'to be (permanent)', 'verb'], ['estar', 'to be (state)', 'verb'], ['ter', 'to have', 'verb'], ['ir', 'to go', 'verb'], ['comer', 'to eat', 'verb'],
  ['beber', 'to drink', 'verb'], ['ler', 'to read', 'verb'], ['escrever', 'to write', 'verb'], ['falar', 'to speak', 'verb'], ['querer', 'to want', 'verb'],
  ['eu', 'I', 'pron'], ['você', 'you', 'pron'], ['o senhor', 'you (respectful, to a man)', 'pron'], ['a senhora', 'you (respectful, to a woman)', 'pron'], ['ele', 'he', 'pron'], ['ela', 'she', 'pron'], ['nós', 'we', 'pron'],
].map(([l, g, p]) => word('pt', l, g, p, l.includes('senhor') ? { register: 'formal' } : {}));
export const ptSentences = [
  sentence('pt', 'Como a senhora está?', 'How are you? (respectful, to a woman)', { register: 'formal', seniority: 'elder', altEn: ['How are you?'] }),
  sentence('pt', 'Como você está?', 'How are you?', { register: 'casual' }),
  sentence('pt', 'Eu quero água, por favor.', 'I want water, please.'),
  sentence('pt', 'Estou lendo um livro.', 'I am reading a book.'),
  sentence('pt', 'Minha avó fala português.', 'My grandmother speaks Portuguese.'),
  sentence('pt', 'Amanhã vamos à casa do meu amigo.', "Tomorrow we are going to my friend's house."),
];
