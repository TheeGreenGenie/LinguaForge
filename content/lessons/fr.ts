// French grammar curriculum, Levels 1–5 (A1–C1). Authored; verified:false until reviewed.
import { lesson } from '../helpers';

const L = 'fr' as const;

export const frCurriculum = [
  // ============================ LEVEL 0 (sounds) ============================
  lesson(L, 'spelling-sounds', 0, 3, 'script', 'Spelling patterns: many letters, one sound',
    `French often writes one sound with several letters. Learn these groups:
    **"ay"** sound: é, er/ez at the end (*parler, parlez*), ai (*j'ai*) · **"eh"**: è, ê, ai (*lait*), ei (*neige*)
    **"oh"**: o, au, eau (*beau*) · **"oo"**: ou (*vous*) · rounded "ee": **u** (*tu*)
    **"wah"**: oi (*moi*) · **"uh"**: e (*le*), eu (*deux*)
    **gn** = "ny" (*montagne*) · **ill** often = "y" (*fille, travailler*), but *ville, mille* say "l"
    **ch** = "sh" (*chat*) · **qu** = "k" (*qui*) · **th** = "t" (*thé*) · **ç** = "s" (*ça*)`,
    [
      { type: 'letter-sound', prompt: '"eau" in "beau" sounds like…', options: ['oh', 'ee-oh', 'ay'], answer: 'oh' },
      { type: 'letter-sound', prompt: '"gn" in "montagne" sounds like…', options: ['ny', 'g-n', 'n'], answer: 'ny' },
      { type: 'letter-sound', prompt: '"ch" in "chat" sounds like…', options: ['sh', 'ch in church', 'k'], answer: 'sh' },
      { type: 'mc', prompt: 'Which word ends in an "ay" sound?', options: ['parlez', 'parle', 'parlent'], answer: 'parlez' },
      { type: 'letter-sound', prompt: '"ill" in "fille" sounds like…', options: ['y', 'l', 'ill in English'], answer: 'y' },
    ]),
  lesson(L, 'liaison', 0, 4, 'script', 'Stress, linking and liaison',
    `**Stress** in French is even, with a slight lift on the **last syllable of a phrase**: *je suis fatiGUÉ*. Don't stress the start of words as in English.
    **Élision**: le, la, je, me, ne, de, que drop their vowel before a vowel or silent h: *l'ami, j'aime, l'homme*. You must write the apostrophe.
    **Liaison**: a normally silent final consonant is pronounced when the next word starts with a vowel: *les amis* = "lay-za-mee", *vous avez* = "voo-za-vay". s/x sound like **z**.
    No liaison after **et** ("and"), and none before an "aspirated h" (*les héros*).`,
    [
      { type: 'mc', prompt: 'Which is correctly written?', options: ["j'aime", 'je aime', 'jaime'], answer: "j'aime" },
      { type: 'mc', prompt: '"les amis" is pronounced…', options: ['lay-za-mee', 'lay a-mee', 'les a-mis'], answer: 'lay-za-mee' },
      { type: 'mc', prompt: 'Where does stress fall in a French phrase?', options: ['on the last syllable of the phrase', 'on the first syllable of each word', 'on every noun'], answer: 'on the last syllable of the phrase' },
      { type: 'mc', prompt: '"the man"', options: ["l'homme", 'le homme', 'la homme'], answer: "l'homme" },
    ]),

  // ============================ LEVEL 1 (A1) ============================
  lesson(L, 'key-verbs', 1, 12, 'grammar', 'être, avoir, aller, faire',
    `The four most common verbs are irregular. Learn them first:
    **être** (to be): je suis, tu es, il est, nous sommes, vous êtes, ils sont
    **avoir** (to have): j'ai, tu as, il a, nous avons, vous avez, ils ont
    **aller** (to go): je vais, tu vas, il va, nous allons, vous allez, ils vont
    **faire** (to do/make): je fais, tu fais, il fait, nous faisons, vous faites, ils font
    French uses avoir for age and feelings: *J'ai vingt ans* "I'm 20", *J'ai faim* "I'm hungry".`,
    [
      { type: 'type', prompt: 'nous ___ (être)', answer: 'sommes', side: 'target' },
      { type: 'type', prompt: 'ils ___ (avoir)', answer: 'ont', side: 'target' },
      { type: 'mc', prompt: '"I am 20 years old"', options: ["J'ai vingt ans", 'Je suis vingt ans', 'Je fais vingt ans'], answer: "J'ai vingt ans" },
      { type: 'type', prompt: 'vous ___ (faire)', answer: 'faites', side: 'target' },
      { type: 'type', prompt: 'je ___ (aller)', answer: 'vais', side: 'target' },
    ]),
  lesson(L, 'questions', 1, 13, 'grammar', 'Asking questions',
    `Three ways, from casual to formal:
    1. Intonation: *Tu viens ?*
    2. **Est-ce que**: *Est-ce que tu viens ?*
    3. Inversion (formal and written): *Viens-tu ?* With il/elle, add -t- between vowels: *A-t-il faim ?*
    Question words: **qui** who · **que / qu'est-ce que** what · **où** where · **quand** when · **comment** how · **pourquoi** why · **combien** how much · **quel/quelle** which.
    French typing note: a space goes before ? ! : ; in standard typography.`,
    [
      { type: 'mc', prompt: 'The most formal way to ask "Are you coming?"', options: ['Venez-vous ?', 'Vous venez ?', 'Est-ce que vous venez ?'], answer: 'Venez-vous ?', register: 'formal' },
      { type: 'mc', prompt: '"Does he have a car?" (inversion)', options: ['A-t-il une voiture ?', 'A-il une voiture ?', 'Il a-t-une voiture ?'], answer: 'A-t-il une voiture ?' },
      { type: 'mc', prompt: '"where" is…', options: ['où', 'ou', 'quand'], answer: 'où' },
      { type: 'mc', prompt: '___ heure est-il ?', options: ['Quelle', 'Quel', 'Que'], answer: 'Quelle', explanation: 'heure is feminine → quelle.' },
    ]),
  lesson(L, 'adjectives', 1, 14, 'grammar', 'Adjectives',
    `Adjectives agree: add **-e** for feminine, **-s** for plural: *un livre vert, une maison verte, des livres verts, des maisons vertes*.
    Irregular feminines: beau → belle, nouveau → nouvelle, vieux → vieille, blanc → blanche, bon → bonne, heureux → heureuse.
    Most go **after** the noun, but short common ones go before (BAGS: Beauty, Age, Goodness, Size): *une belle maison, un vieux livre, un bon repas, un petit chat*.
    Before a vowel: beau → **bel**, nouveau → **nouvel**, vieux → **vieil**: *un bel homme*.`,
    [
      { type: 'mc', prompt: 'une voiture ___ (white)', options: ['blanche', 'blanc', 'blance'], answer: 'blanche' },
      { type: 'mc', prompt: '"a beautiful house"', options: ['une belle maison', 'une maison belle', 'une beau maison'], answer: 'une belle maison' },
      { type: 'mc', prompt: '"a handsome man"', options: ['un bel homme', 'un beau homme', 'un homme belle'], answer: 'un bel homme' },
      { type: 'type', prompt: 'des maisons ___ (vert)', answer: 'vertes', side: 'target' },
    ]),
  lesson(L, 'possessives-numbers', 1, 15, 'grammar', 'Possessives and numbers',
    `Possessives agree with the **thing owned**, not the owner:
    **mon / ma / mes** my · **ton / ta / tes** your · **son / sa / ses** his/her · **notre / nos** our · **votre / vos** your · **leur / leurs** their.
    *sa mère* = his mother OR her mother. Before a vowel, ma → **mon**: *mon amie*.
    Numbers: un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix, onze, douze… vingt, trente, quarante, cinquante, soixante, **soixante-dix** (70), **quatre-vingts** (80), **quatre-vingt-dix** (90), cent.`,
    [
      { type: 'mc', prompt: '"his sister" / "her sister"', options: ['sa sœur', 'son sœur', 'ses sœur'], answer: 'sa sœur' },
      { type: 'mc', prompt: '"my friend" (female)', options: ['mon amie', 'ma amie', 'mes amie'], answer: 'mon amie' },
      { type: 'mc', prompt: '80 in French', options: ['quatre-vingts', 'huitante', 'soixante-vingt'], answer: 'quatre-vingts' },
      { type: 'type', prompt: 'Write 70 in words', answer: 'soixante-dix', side: 'target' },
    ]),
  lesson(L, 'partitive', 1, 16, 'grammar', 'Partitive articles: du, de la, des',
    `For unspecified amounts ("some", often unsaid in English):
    **du** (m.) · **de la** (f.) · **de l'** (before a vowel) · **des** (plural): *Je bois du café. Je mange de la soupe. Il y a de l'eau.*
    After a negation they all become **de / d'**: *Je ne bois pas de café. Il n'y a pas d'eau.*
    After quantities too: *beaucoup de sucre, un peu d'eau*.
    General statements use le/la/les: *J'aime le café* (I like coffee in general).`,
    [
      { type: 'mc', prompt: 'Je veux ___ pain.', options: ['du', 'de la', 'des'], answer: 'du' },
      { type: 'mc', prompt: 'Je ne mange pas ___ viande.', options: ['de', 'de la', 'du'], answer: 'de' },
      { type: 'mc', prompt: "J'aime ___ chocolat. (in general)", options: ['le', 'du', 'de'], answer: 'le' },
      { type: 'mc', prompt: 'beaucoup ___ amis', options: ["d'", 'des', 'de les'], answer: "d'" },
    ]),
  lesson(L, 'ir-re-verbs', 1, 17, 'grammar', 'Regular -ir and -re verbs',
    `**-ir** (finir): je finis, tu finis, il finit, nous fin**iss**ons, vous fin**iss**ez, ils fin**iss**ent (also choisir, réussir).
    **-re** (vendre): je vends, tu vends, il vend, nous vendons, vous vendez, ils vendent (also attendre, répondre, entendre).
    Common irregular -ir verbs: partir (je pars, nous partons), venir (je viens, ils viennent), pouvoir (je peux), vouloir (je veux).`,
    [
      { type: 'type', prompt: 'nous ___ (finir)', answer: 'finissons', side: 'target' },
      { type: 'type', prompt: 'il ___ (attendre)', answer: 'attend', side: 'target' },
      { type: 'mc', prompt: 'je ___ (pouvoir)', options: ['peux', 'pouve', 'pouvois'], answer: 'peux' },
      { type: 'type', prompt: 'ils ___ (venir)', answer: 'viennent', side: 'target' },
    ]),

  // ============================ LEVEL 2 (A2) ============================
  lesson(L, 'passe-compose-avoir', 2, 20, 'grammar', 'Passé composé with avoir',
    `The everyday past tense: **avoir** (present) + past participle.
    Participles: -er → **-é** (parlé), -ir → **-i** (fini), -re → **-u** (vendu).
    Irregular: avoir → **eu**, être → **été**, faire → **fait**, prendre → **pris**, mettre → **mis**, voir → **vu**, lire → **lu**, écrire → **écrit**, boire → **bu**, pouvoir → **pu**.
    *J'ai mangé. Nous avons vu le film.* Negative: *Je n'ai pas mangé.*`,
    [
      { type: 'type', prompt: 'Translate: "I ate"', answer: "j'ai mangé", side: 'target' },
      { type: 'mc', prompt: 'Participle of "faire"', options: ['fait', 'faisé', 'fai'], answer: 'fait' },
      { type: 'mc', prompt: '"We didn\'t see the film"', options: ["Nous n'avons pas vu le film", 'Nous avons pas vu le film', "Nous n'avons vu pas le film"], answer: "Nous n'avons pas vu le film" },
      { type: 'type', prompt: 'ils ont ___ (prendre) le train', answer: 'pris', side: 'target' },
    ]),
  lesson(L, 'passe-compose-etre', 2, 21, 'grammar', 'Passé composé with être',
    `About 16 verbs of movement/change of state use **être**, and the participle **agrees** with the subject:
    aller, venir, arriver, partir, entrer, sortir, monter, descendre, naître, mourir, rester, tomber, retourner, devenir, revenir, rentrer.
    *Elle est allée. Ils sont partis. Nous sommes arrivé(e)s.*
    All **reflexive** verbs use être: *Je me suis levé(e). Elle s'est lavée.*`,
    [
      { type: 'mc', prompt: '"She went"', options: ['Elle est allée', 'Elle a allé', 'Elle est allé'], answer: 'Elle est allée' },
      { type: 'mc', prompt: '"They (m.) arrived"', options: ['Ils sont arrivés', 'Ils ont arrivé', 'Ils sont arrivé'], answer: 'Ils sont arrivés' },
      { type: 'mc', prompt: '"I got up" (woman speaking)', options: ['Je me suis levée', "Je m'ai levée", 'Je suis levée'], answer: 'Je me suis levée' },
    ]),
  lesson(L, 'imparfait', 2, 22, 'grammar', 'The imparfait',
    `For descriptions, habits and ongoing past states.
    Stem = **nous** present minus -ons; endings **-ais, -ais, -ait, -ions, -iez, -aient**: parler → je parlais, nous parlions; finir → je finissais.
    Only irregular stem: **être** → ét-: j'étais.
    *Quand j'étais petit, je jouais au foot.* "When I was little, I used to play football."`,
    [
      { type: 'type', prompt: 'je ___ (parler, imparfait)', answer: 'parlais', side: 'target' },
      { type: 'type', prompt: 'nous ___ (être, imparfait)', answer: 'étions', side: 'target' },
      { type: 'mc', prompt: 'ils ___ (avoir, imparfait)', options: ['avaient', 'avaitent', 'ont eu'], answer: 'avaient' },
    ]),
  lesson(L, 'pc-vs-imparfait', 2, 23, 'grammar', 'Passé composé or imparfait?',
    `**Passé composé**: completed events, the storyline, actions that happened once or a set number of times.
    **Imparfait**: the background, descriptions, habits, what was going on.
    *Je lisais (background) quand le téléphone a sonné (event).*
    Signals: hier, soudain, une fois → PC; toujours, souvent, tous les jours, pendant que → imparfait.`,
    [
      { type: 'mc', prompt: 'Il ___ beau quand nous sommes sortis.', options: ['faisait', 'a fait'], answer: 'faisait' },
      { type: 'mc', prompt: 'Soudain, il ___ à pleuvoir.', options: ['a commencé', 'commençait'], answer: 'a commencé' },
      { type: 'mc', prompt: 'Tous les étés, nous ___ à la mer.', options: ['allions', 'sommes allés'], answer: 'allions' },
    ]),
  lesson(L, 'object-pronouns', 2, 24, 'grammar', 'Object pronouns: le, lui, y, en',
    `**Direct**: me, te, **le/la/l'**, nous, vous, **les**: *Je la vois.*
    **Indirect** (à + person): me, te, **lui**, nous, vous, **leur**: *Je lui parle.*
    **y** replaces à + place/thing: *J'y vais* "I'm going there". **en** replaces de + noun / quantities: *J'en veux deux* "I want two (of them)".
    All go **before** the verb (before avoir in the PC): *Je l'ai vu.* Order: me/te/nous/vous → le/la/les → lui/leur → y → en.`,
    [
      { type: 'mc', prompt: '"I see her"', options: ['Je la vois', 'Je lui vois', 'Je vois la'], answer: 'Je la vois' },
      { type: 'mc', prompt: '"I speak to him"', options: ['Je lui parle', 'Je le parle', 'Je parle lui'], answer: 'Je lui parle' },
      { type: 'mc', prompt: '"Tu vas à Paris ?" — "Oui, j\'___ vais."', options: ['y', 'en', 'le'], answer: 'y' },
      { type: 'mc', prompt: '"Tu veux des pommes ?" — "Oui, j\'___ veux trois."', options: ['en', 'y', 'les'], answer: 'en' },
    ]),
  lesson(L, 'future-reflexive', 2, 25, 'grammar', 'Future tenses and reflexive verbs',
    `**Futur proche**: aller + infinitive: *Je vais manger.*
    **Futur simple**: infinitive (-re drops e) + **-ai, -as, -a, -ons, -ez, -ont**: *je parlerai, nous finirons, ils vendront*. Irregular stems: ser- (être), aur- (avoir), ir- (aller), fer- (faire), pourr-, voudr-, viendr-, verr-, devr-.

    Reflexive verbs: **se laver** → je me lave, tu te laves, il se lave, nous nous lavons, vous vous lavez, ils se lavent. *Je m'appelle Marie.*`,
    [
      { type: 'type', prompt: 'je ___ (être, futur simple)', answer: 'serai', side: 'target' },
      { type: 'type', prompt: 'nous ___ (faire, futur simple)', answer: 'ferons', side: 'target' },
      { type: 'mc', prompt: '"My name is Marie"', options: ["Je m'appelle Marie", 'Je appelle Marie', 'Mon nom appelle Marie'], answer: "Je m'appelle Marie" },
      { type: 'type', prompt: 'Translate: "I am going to eat"', answer: 'je vais manger', side: 'target' },
    ]),

  // ============================ LEVEL 3 (B1) ============================
  lesson(L, 'conditionnel', 3, 30, 'grammar', 'The conditional',
    `Future stem + imparfait endings: **je parlerais, tu serais, il aurait, nous ferions, vous pourriez, ils voudraient**.
    Politeness: *Je voudrais un café. Pourriez-vous m'aider ?*
    Advice: *Tu devrais dormir.* · Unconfirmed news (journalism): *Le président serait malade* "The president is reportedly ill."`,
    [
      { type: 'type', prompt: 'je ___ (vouloir, conditional)', answer: 'voudrais', side: 'target' },
      { type: 'mc', prompt: '"Could you help me?" (vous)', options: ["Pourriez-vous m'aider ?", "Pouvez-vous m'aider ?", "Pourrez-vous m'aider ?"], answer: "Pourriez-vous m'aider ?" },
      { type: 'mc', prompt: 'In news, "il serait malade" means…', options: ['he is reportedly ill', 'he would be ill'], answer: 'he is reportedly ill' },
    ]),
  lesson(L, 'subjonctif', 3, 31, 'grammar', 'The subjunctive',
    `Form: **ils** present stem + **-e, -es, -e, -ions, -iez, -ent**: parler → que je parle; finir → que je finisse; partir → que je parte.
    Irregular: être → sois, soit, soyons · avoir → aie, ait, ayons · aller → aille · faire → fasse · pouvoir → puisse · savoir → sache · vouloir → veuille.
    Used after: **il faut que**, vouloir que, souhaiter que, emotions (*je suis content que*), doubt (*je doute que*), and conjunctions **pour que, bien que, avant que, à moins que, sans que**.
    *Penser/croire que* + indicative, but negative/question → subjunctive: *Je ne pense pas qu'il soit là.*`,
    [
      { type: 'mc', prompt: 'Il faut que tu ___ (faire) tes devoirs.', options: ['fasses', 'fais', 'feras'], answer: 'fasses' },
      { type: 'mc', prompt: 'Je veux que vous ___ (être) à l\'heure.', options: ['soyez', 'êtes', 'serez'], answer: 'soyez' },
      { type: 'mc', prompt: 'Je pense qu\'il ___ raison.', options: ['a', 'ait'], answer: 'a', explanation: 'Affirmative penser que → indicative.' },
      { type: 'mc', prompt: 'Bien qu\'il ___ fatigué, il travaille.', options: ['soit', 'est'], answer: 'soit' },
    ]),
  lesson(L, 'relatives', 3, 32, 'grammar', 'Relative pronouns: qui, que, dont, où',
    `**qui** = subject: *l'homme qui parle* · **que** = object: *le livre que je lis*
    **dont** = of which/whose (replaces de + noun): *le film dont je parle* "the film I'm talking about", *la femme dont le fils…* "the woman whose son…"
    **où** = where / when: *la ville où j'habite, le jour où il est né*
    **ce qui / ce que** = "what": *Ce que tu dis est vrai.*
    After prepositions: **lequel/laquelle**: *la table sur laquelle…*`,
    [
      { type: 'mc', prompt: 'Le livre ___ je lis est bon.', options: ['que', 'qui', 'dont'], answer: 'que' },
      { type: 'mc', prompt: "L'homme ___ parle est mon père.", options: ['qui', 'que', 'où'], answer: 'qui' },
      { type: 'mc', prompt: 'Le film ___ je parle est français.', options: ['dont', 'que', 'où'], answer: 'dont' },
      { type: 'mc', prompt: '"What you say is true"', options: ['Ce que tu dis est vrai', 'Que tu dis est vrai', 'Quoi tu dis est vrai'], answer: 'Ce que tu dis est vrai' },
    ]),
  lesson(L, 'imperatif-pqp', 3, 33, 'grammar', 'Imperative and plus-que-parfait',
    `**Imperative**: present tense without the subject: *Parle ! Finissons ! Venez !* (-er verbs drop the -s in tu form: *Mange !*). Irregular: sois/soyez, aie/ayez, sache.
    Pronouns attach after affirmative commands: *Donne-le-moi !* but precede negative ones: *Ne me le donne pas !*

    **Plus-que-parfait** ("had done"): imparfait of avoir/être + participle: *J'avais fini. Elle était partie.*`,
    [
      { type: 'mc', prompt: '"Eat!" (tu)', options: ['Mange !', 'Manges !', 'Tu manges !'], answer: 'Mange !' },
      { type: 'mc', prompt: '"Give it to me!"', options: ['Donne-le-moi !', 'Me le donne !', 'Donne-moi-le !'], answer: 'Donne-le-moi !' },
      { type: 'mc', prompt: '"She had left"', options: ['Elle était partie', 'Elle avait partie', 'Elle est partie'], answer: 'Elle était partie' },
    ]),
  lesson(L, 'prepositions-places', 3, 34, 'grammar', 'Prepositions with places and time',
    `Cities: **à** Paris · Feminine countries (most ending in -e): **en** France, en Italie · Masculine: **au** Canada, au Japon · Plural: **aux** États-Unis.
    From: **de** Paris, **de** France, **du** Canada, **des** États-Unis.
    Time: **depuis** (since/for, ongoing): *J'habite ici depuis 3 ans.* · **pendant** (during, completed): *J'ai dormi pendant 8 heures.* · **il y a** (ago): *il y a deux jours* · **dans** (in, future): *dans une heure*.`,
    [
      { type: 'mc', prompt: 'Je vais ___ Japon.', options: ['au', 'en', 'à'], answer: 'au' },
      { type: 'mc', prompt: 'Elle habite ___ Italie.', options: ['en', 'au', 'à la'], answer: 'en' },
      { type: 'mc', prompt: '"I have lived here for 3 years" (still do)', options: ["J'habite ici depuis 3 ans", "J'habite ici pendant 3 ans", "J'habite ici il y a 3 ans"], answer: "J'habite ici depuis 3 ans" },
    ]),

  // ============================ LEVEL 4 (B2) ============================
  lesson(L, 'si-clauses', 4, 40, 'grammar', '"If" clauses',
    `Three patterns (never put the conditional or future right after *si*):
    1. Real: **si + présent → présent/futur**: *Si tu viens, on ira au cinéma.*
    2. Hypothetical: **si + imparfait → conditionnel**: *Si j'avais le temps, je voyagerais.*
    3. Past unreal: **si + plus-que-parfait → conditionnel passé**: *Si j'avais su, je serais venu.* "If I had known, I would have come."`,
    [
      { type: 'mc', prompt: "Si j'___ riche, j'achèterais une maison.", options: ['étais', 'serais', 'suis'], answer: 'étais' },
      { type: 'mc', prompt: 'Si tu viens, nous ___ contents.', options: ['serons', 'serions', 'étions'], answer: 'serons' },
      { type: 'mc', prompt: '"If I had known, I would have come"', options: ["Si j'avais su, je serais venu", "Si je saurais, je viendrais", "Si j'ai su, je suis venu"], answer: "Si j'avais su, je serais venu" },
    ]),
  lesson(L, 'passive', 4, 41, 'grammar', 'The passive and alternatives',
    `**être** + participle (agrees) + **par**: *La lettre a été écrite par Marie.*
    French often prefers alternatives:
    **on**: *On parle français ici* "French is spoken here".
    **se** + verb: *Ça se dit* "That is said", *Les billets se vendent en ligne.*
    Some verbs can't be passive with an indirect object: "I was told" → *On m'a dit.*`,
    [
      { type: 'mc', prompt: '"The house was built in 1900"', options: ['La maison a été construite en 1900', 'La maison a construit en 1900', 'La maison était construit en 1900'], answer: 'La maison a été construite en 1900' },
      { type: 'mc', prompt: '"I was told that…"', options: ["On m'a dit que…", "J'ai été dit que…", 'Je suis dit que…'], answer: "On m'a dit que…" },
      { type: 'mc', prompt: '"French is spoken here"', options: ['On parle français ici', 'Le français est parlé par ici', 'Français parle ici'], answer: 'On parle français ici' },
    ]),
  lesson(L, 'reported-speech', 4, 42, 'grammar', 'Reported speech (discours indirect)',
    `After a past reporting verb, tenses shift:
    présent → imparfait: "Je suis fatigué" → *Il a dit qu'il était fatigué.*
    passé composé → plus-que-parfait · futur → conditionnel: "Je viendrai" → *Il a dit qu'il viendrait.*
    Imperative → **de** + infinitive: "Viens !" → *Il m'a dit de venir.*
    Questions: *Il m'a demandé **si** je venais / **ce que** je voulais / **où** j'habitais.*
    Time words: demain → le lendemain, hier → la veille.`,
    [
      { type: 'mc', prompt: '"Je viendrai" → Il a dit qu\'il ___.', options: ['viendrait', 'viendra', 'venait'], answer: 'viendrait' },
      { type: 'mc', prompt: '"Ferme la porte !" → Il m\'a dit ___ la porte.', options: ['de fermer', 'que je ferme', 'fermer'], answer: 'de fermer' },
      { type: 'mc', prompt: '"Qu\'est-ce que tu veux ?" → Il m\'a demandé ___ je voulais.', options: ['ce que', "qu'est-ce que", 'que'], answer: 'ce que' },
    ]),
  lesson(L, 'gerondif', 4, 43, 'grammar', 'Gérondif and participles',
    `**Gérondif**: **en** + present participle (-ant, from the nous stem): *en parlant, en finissant*. Means "while / by doing": *Il chante en travaillant. On apprend en pratiquant.*
    Irregular: être → étant, avoir → ayant, savoir → sachant.
    **Present participle** alone (written style) = "who/which …-s": *les étudiants habitant à Paris*.
    **Past participle clauses**: *Arrivée à la gare, elle a appelé sa mère.* "Having arrived at the station…"`,
    [
      { type: 'mc', prompt: '"by practising"', options: ['en pratiquant', 'par pratiquer', 'pratiquant en'], answer: 'en pratiquant' },
      { type: 'type', prompt: 'Present participle of "faire"', answer: 'faisant', side: 'target' },
      { type: 'mc', prompt: 'Present participle of "avoir"', options: ['ayant', 'avant', 'avoyant'], answer: 'ayant' },
    ]),
  lesson(L, 'connecteurs', 4, 44, 'grammar', 'Logical connectors',
    `Addition: de plus, en outre, par ailleurs · Contrast: cependant, pourtant, toutefois, en revanche, alors que · Concession: bien que (+ subj.), même si · Cause: car, puisque, étant donné que, grâce à (positive), à cause de (negative) · Result: donc, ainsi, par conséquent, c'est pourquoi · Conclusion: bref, en somme, en conclusion.
    *Il pleuvait ; pourtant, nous sommes sortis.*`,
    [
      { type: 'mc', prompt: '"however" (formal)', options: ['cependant', 'donc', 'car'], answer: 'cependant' },
      { type: 'mc', prompt: '"thanks to" (positive cause)', options: ['grâce à', 'à cause de', 'malgré'], answer: 'grâce à' },
      { type: 'mc', prompt: '"therefore / as a result"', options: ['par conséquent', 'pourtant', 'en revanche'], answer: 'par conséquent' },
    ]),

  // ============================ LEVEL 5 (C1) ============================
  lesson(L, 'passe-simple', 5, 50, 'grammar', 'Passé simple (for reading)',
    `The literary past tense, used in novels, history and formal writing. You need to **recognise** it more than produce it.
    -er: il parl**a**, ils parl**èrent** · -ir/-re: il fin**it**, ils fin**irent**; il vend**it**
    Irregular (3rd person): être → **fut / furent** · avoir → **eut / eurent** · faire → **fit** · venir → **vint** · voir → **vit** · prendre → **prit** · dire → **dit**.
    *Il ouvrit la porte et sortit.* "He opened the door and went out."`,
    [
      { type: 'mc', prompt: '"il fut" is the passé simple of…', options: ['être', 'faire', 'falloir'], answer: 'être' },
      { type: 'mc', prompt: '"ils eurent" means…', options: ['they had', 'they were', 'they ate'], answer: 'they had' },
      { type: 'mc', prompt: '"elle vint" means…', options: ['she came', 'she saw', 'she sold'], answer: 'she came' },
      { type: 'mc', prompt: '"Il ouvrit la porte"', options: ['He opened the door', 'He opens the door', 'He would open the door'], answer: 'He opened the door' },
    ]),
  lesson(L, 'subjonctif-passe', 5, 51, 'grammar', 'Past subjunctive and concordance',
    `**Subjonctif passé**: subjunctive of avoir/être + participle, for an action completed before the main verb: *Je suis content que tu sois venu.* "I'm glad you came."
    *Bien qu'il ait travaillé dur, il a échoué.*
    In very formal writing you may meet the **imparfait du subjonctif** (qu'il fût, qu'il eût, qu'il parlât). Recognise it, but use the present subjunctive yourself.`,
    [
      { type: 'mc', prompt: 'Je regrette que tu ___ partie si tôt.', options: ['sois', 'es', 'étais'], answer: 'sois' },
      { type: 'mc', prompt: "Bien qu'il ___ beaucoup étudié, il a raté l'examen.", options: ['ait', 'a', 'avait'], answer: 'ait' },
      { type: 'mc', prompt: '"qu\'il fût" is…', options: ['imparfait du subjonctif of être', 'passé simple of faire', 'future of être'], answer: 'imparfait du subjonctif of être' },
    ]),
  lesson(L, 'formal-writing', 5, 52, 'register', 'Formal letters and register',
    `Formal letters always use **vous**.
    Openings: *Madame, Monsieur,* · *Madame la Directrice,* Closings (fixed formulas): *Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.* · Less formal: *Cordialement,*
    Useful phrases: *Je me permets de vous écrire…* · *Je vous serais reconnaissant(e) de bien vouloir…* "I would be grateful if you would…" · *Dans l'attente de votre réponse…*
    Spoken vs written: *on* → *nous*, *ça* → *cela*, *pas* alone → *ne… pas* in writing.`,
    [
      { type: 'register-scene', prompt: 'Opening a letter to an unknown official', options: ['Madame, Monsieur,', 'Salut !', 'Cher ami,'], answer: 'Madame, Monsieur,', register: 'formal' },
      { type: 'mc', prompt: 'Which belongs in formal writing?', options: ['cela', 'ça'], answer: 'cela' },
      { type: 'mc', prompt: '"I would be grateful if you would…"', options: ['Je vous serais reconnaissant de bien vouloir…', 'Tu pourrais…', 'Fais-moi plaisir et…'], answer: 'Je vous serais reconnaissant de bien vouloir…', register: 'formal' },
    ]),
  lesson(L, 'faux-amis', 5, 53, 'grammar', 'False friends and translation traps',
    `**actuellement** currently (actually → *en fait*) · **éventuellement** possibly (eventually → *finalement*) · **librairie** bookshop (library → *bibliothèque*) · **sensible** sensitive · **rester** to stay (rest → *se reposer*) · **attendre** to wait (attend → *assister à*) · **déception** disappointment · **location** rental · **blesser** to injure.
    Translation traps: French uses the present with **depuis** where English uses the perfect ("I have been living"), and **on** often becomes "people/we/they" or an English passive.`,
    [
      { type: 'mc', prompt: '"actuellement" means…', options: ['currently', 'actually'], answer: 'currently' },
      { type: 'mc', prompt: '"J\'attends le bus" means…', options: ["I'm waiting for the bus", "I'm attending the bus"], answer: "I'm waiting for the bus" },
      { type: 'mc', prompt: '"une déception" is…', options: ['a disappointment', 'a deception'], answer: 'a disappointment' },
      { type: 'mc', prompt: '"J\'habite ici depuis 2010" →', options: ['I have lived here since 2010', 'I live here since 2010'], answer: 'I have lived here since 2010' },
    ]),
];
