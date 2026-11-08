// Spanish grammar curriculum, Levels 1–5 (A1–C1). Latin American usage by default,
// with Spain-only forms noted. Authored for this app; verified:false until reviewed.
import { lesson } from '../helpers';

const L = 'es' as const;

export const esCurriculum = [
  // ============================ LEVEL 0 (sounds) ============================
  lesson(L, 'stress', 0, 3, 'script', 'Word stress: reading any word aloud',
    `Spanish stress follows three rules, so you can pronounce any written word:
    1. Ends in a **vowel, n or s** → stress the **second-to-last** syllable: *ca-sa, ha-blan, li-bros*.
    2. Ends in **any other consonant** → stress the **last** syllable: *ha-blar, ciu-dad, es-pa-ñol*.
    3. A **written accent** overrides both: *ca-fé, lá-piz, mú-si-ca, a-quí*.
    So the accent mark appears exactly when a word breaks rule 1 or 2.
    Vowel pairs: **a, e, o** are "strong", **i, u** "weak". A weak + strong pair is one syllable (*bien, cuo-ta*) unless the weak vowel has an accent (*dí-a, pa-ís*).`,
    [
      { type: 'mc', prompt: 'Where is the stress in "hablan"?', options: ['HA-blan', 'ha-BLAN'], answer: 'HA-blan', explanation: 'Ends in n → second-to-last syllable.' },
      { type: 'mc', prompt: 'Where is the stress in "ciudad"?', options: ['ciu-DAD', 'CIU-dad'], answer: 'ciu-DAD', explanation: 'Ends in d → last syllable.' },
      { type: 'mc', prompt: 'Which word needs a written accent?', options: ['musica → música', 'casa → cása', 'hablar → háblar'], answer: 'musica → música' },
      { type: 'mc', prompt: 'How many syllables in "día"?', options: ['2 (dí-a)', '1 (dia)'], answer: '2 (dí-a)' },
      { type: 'mc', prompt: 'Where is the stress in "lápiz"?', options: ['LÁ-piz', 'la-PIZ'], answer: 'LÁ-piz' },
    ]),
  lesson(L, 'tricky-sounds', 0, 4, 'script', 'Letters that change sound',
    `**c**: before e/i = "s" (Latin America) or "th" (Spain): *cena, cine*. Otherwise "k": *casa, cosa*.
    **z** is always like that s/th sound: *zapato*. That's why it's *lápiz* but *lápices*.
    **g**: before e/i = throaty "h" like j: *gente, gigante*. Otherwise hard g: *gato*. To keep a hard g before e/i, Spanish writes **gu**: *guerra, guitarra* (the u is silent). **gü** pronounces the u: *pingüino*.
    **qu** = "k" before e/i: *queso, quiero* (silent u).
    **d** between vowels is soft, like "th" in *this*: *nada*.
    **ll/y**: "y" (in Argentina/Uruguay "sh"/"zh").`,
    [
      { type: 'letter-sound', prompt: '"c" in "cine" (Latin America) sounds like…', options: ['s', 'k', 'ch'], answer: 's' },
      { type: 'letter-sound', prompt: '"g" in "gente" sounds like…', options: ['a throaty h', 'g in go', 'j in jam'], answer: 'a throaty h' },
      { type: 'mc', prompt: 'In "guitarra", the u is…', options: ['silent', 'pronounced w'], answer: 'silent' },
      { type: 'mc', prompt: 'Plural of "lápiz"', options: ['lápices', 'lápizes', 'lápizs'], answer: 'lápices', explanation: 'z becomes c before e.' },
      { type: 'letter-sound', prompt: '"qu" in "queso" sounds like…', options: ['k', 'kw', 'ch'], answer: 'k' },
    ]),

  // ============================ LEVEL 1 (A1) ============================
  lesson(L, 'ser-estar', 1, 12, 'grammar', 'ser vs estar',
    `Spanish has two verbs for "to be".

    **ser**: what something *is* (identity, origin, profession, time, characteristics): soy, eres, es, somos, son.
    *Soy estudiante. Es de México. Son las tres.*

    **estar**: *where* something is and *how* it is right now (location, temporary state, -ing): estoy, estás, está, estamos, están.
    *Estoy en casa. Está cansada. Estamos leyendo.*

    Same adjective, different meaning: *Es aburrido* "he's boring" vs *Está aburrido* "he's bored".`,
    [
      { type: 'mc', prompt: 'Madrid ___ en España.', options: ['está', 'es'], answer: 'está', explanation: 'Location uses estar.' },
      { type: 'mc', prompt: 'Mi padre ___ médico.', options: ['es', 'está'], answer: 'es', explanation: 'Profession uses ser.' },
      { type: 'mc', prompt: 'Hoy ___ muy cansado.', options: ['estoy', 'soy'], answer: 'estoy' },
      { type: 'mc', prompt: '"Es aburrido" means…', options: ["He's boring", "He's bored"], answer: "He's boring" },
      { type: 'type', prompt: 'Translate: "We are at home"', answer: 'estamos en casa', side: 'target' },
    ]),
  lesson(L, 'tener-hay', 1, 13, 'grammar', 'tener and hay',
    `**tener** (to have) is irregular: tengo, tienes, tiene, tenemos, tienen.
    Spanish uses tener where English uses "to be": *tengo 20 años* "I'm 20", *tengo hambre* "I'm hungry", *tengo frío* "I'm cold".
    **tener que** + infinitive = "have to": *Tengo que trabajar.*

    **hay** = "there is / there are" (never changes): *Hay un libro. Hay tres libros.* Question: *¿Hay agua?*`,
    [
      { type: 'mc', prompt: '"I am hungry" is…', options: ['Tengo hambre', 'Soy hambre', 'Estoy hambre'], answer: 'Tengo hambre' },
      { type: 'mc', prompt: '"There are two cats" is…', options: ['Hay dos gatos', 'Son dos gatos', 'Tienen dos gatos'], answer: 'Hay dos gatos' },
      { type: 'type', prompt: 'Complete: yo ___ (tener) dos hermanos', answer: 'tengo', side: 'target' },
      { type: 'type', prompt: 'Translate: "I have to study"', answer: 'tengo que estudiar', side: 'target' },
    ]),
  lesson(L, 'questions-negation', 1, 14, 'grammar', 'Questions and negation',
    `Negation: put **no** before the verb: *No hablo francés.* Double negatives are correct: *No tengo nada* "I have nothing".
    Question words carry an accent: **qué** what · **quién** who · **dónde** where · **cuándo** when · **cómo** how · **por qué** why · **cuánto** how much.
    Questions open with **¿** and exclamations with **¡**: *¿Dónde vives?*
    "Because" is **porque** (one word, no accent); "why" is **por qué**.`,
    [
      { type: 'mc', prompt: '"Where do you live?"', options: ['¿Dónde vives?', '¿Donde vives?', '¿Cuándo vives?'], answer: '¿Dónde vives?' },
      { type: 'mc', prompt: '"I don\'t have anything"', options: ['No tengo nada', 'Tengo nada', 'No tengo algo'], answer: 'No tengo nada' },
      { type: 'mc', prompt: '"why" is…', options: ['por qué', 'porque', 'para qué'], answer: 'por qué' },
      { type: 'type', prompt: 'Translate: "I don\'t speak French"', answer: 'no hablo francés', side: 'target' },
    ]),
  lesson(L, 'adjectives', 1, 15, 'grammar', 'Adjectives: agreement and position',
    `Adjectives agree in gender and number and usually come **after** the noun: *un libro rojo, una casa roja, unos libros rojos, unas casas rojas*.
    Adjectives ending in -e or a consonant only change for number: *un coche grande, una casa grande, casas grandes*.
    A few common ones go before and shorten: *un buen amigo, un mal día, un gran hombre* ("a great man" vs *un hombre grande* "a big man").`,
    [
      { type: 'mc', prompt: 'las casas ___ (white)', options: ['blancas', 'blanco', 'blancos', 'blanca'], answer: 'blancas' },
      { type: 'mc', prompt: '"a good friend"', options: ['un buen amigo', 'un bueno amigo', 'un amigo buen'], answer: 'un buen amigo' },
      { type: 'mc', prompt: '"un gran hombre" means…', options: ['a great man', 'a big man'], answer: 'a great man' },
      { type: 'type', prompt: 'Translate: "a red car" (coche)', answer: 'un coche rojo', side: 'target' },
    ]),
  lesson(L, 'possessives-numbers', 1, 16, 'grammar', 'Possessives and numbers',
    `Possessives before the noun: **mi(s)** my · **tu(s)** your · **su(s)** his/her/your (usted)/their · **nuestro/a(s)** our · **su(s)** their.
    *mi libro, mis libros, nuestra casa*. *su casa* can mean his, her, their or your (formal): context decides.

    Numbers: uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez, once, doce, trece, catorce, quince, dieciséis… veinte, veintiuno… treinta y uno, cuarenta, cincuenta, cien.
    *uno* becomes *un/una* before a noun: *un libro, una mesa*.`,
    [
      { type: 'mc', prompt: '"our house"', options: ['nuestra casa', 'nuestro casa', 'nuestras casa'], answer: 'nuestra casa' },
      { type: 'mc', prompt: '"my books"', options: ['mis libros', 'mi libros', 'mios libros'], answer: 'mis libros' },
      { type: 'type', prompt: 'Write the number 15 in words', answer: 'quince', side: 'target' },
      { type: 'type', prompt: 'Write the number 21 in words', answer: 'veintiuno', side: 'target' },
    ]),
  lesson(L, 'gustar', 1, 17, 'grammar', 'gustar: "to like"',
    `Spanish says "X pleases me" instead of "I like X". The thing liked is the subject:
    **me gusta** + singular/infinitive · **me gustan** + plural.
    *Me gusta el café. Me gustan los libros. Me gusta leer.*
    Pronouns: me, te, le (him/her/usted), nos, les. Clarify with *a*: *A María le gusta bailar.*
    Negative: *No me gusta.*`,
    [
      { type: 'mc', prompt: '"I like the books"', options: ['Me gustan los libros', 'Me gusta los libros', 'Yo gusto los libros'], answer: 'Me gustan los libros' },
      { type: 'mc', prompt: '"We like to dance"', options: ['Nos gusta bailar', 'Nos gustan bailar', 'Nosotros gustamos bailar'], answer: 'Nos gusta bailar' },
      { type: 'type', prompt: 'Translate: "I don\'t like coffee"', answer: 'no me gusta el café', side: 'target' },
    ]),

  // ============================ LEVEL 2 (A2) ============================
  lesson(L, 'stem-changing', 2, 20, 'grammar', 'Stem-changing verbs',
    `Some verbs change their stem vowel when it is stressed (not in nosotros):
    **e → ie**: querer → qu**ie**ro, qu**ie**res, qu**ie**re, queremos, qu**ie**ren (also pensar, empezar, preferir)
    **o → ue**: poder → p**ue**do, p**ue**des, p**ue**de, podemos, p**ue**den (also dormir, volver, encontrar)
    **e → i**: pedir → p**i**do, p**i**des, p**i**de, pedimos, p**i**den (also servir, repetir)
    **jugar** is u → ue: juego.`,
    [
      { type: 'type', prompt: 'yo ___ (poder)', answer: 'puedo', side: 'target' },
      { type: 'type', prompt: 'ellos ___ (querer)', answer: 'quieren', side: 'target' },
      { type: 'mc', prompt: 'nosotros ___ (dormir)', options: ['dormimos', 'duermimos', 'duermemos'], answer: 'dormimos', explanation: 'No stem change in nosotros.' },
      { type: 'type', prompt: 'ella ___ (pedir)', answer: 'pide', side: 'target' },
    ]),
  lesson(L, 'reflexive', 2, 21, 'grammar', 'Reflexive verbs',
    `Reflexive verbs carry a pronoun that matches the subject: **me, te, se, nos, se**.
    **levantarse** (to get up): me levanto, te levantas, se levanta, nos levantamos, se levantan.
    Common: llamarse (*Me llamo Ana*), ducharse, acostarse (o→ue), sentirse (e→ie), irse (to leave).
    With an infinitive the pronoun can attach: *Voy a ducharme* = *Me voy a duchar*.`,
    [
      { type: 'mc', prompt: '"My name is Ana"', options: ['Me llamo Ana', 'Yo llamo Ana', 'Se llamo Ana'], answer: 'Me llamo Ana' },
      { type: 'type', prompt: 'nosotros ___ (levantarse) a las siete', answer: 'nos levantamos', side: 'target' },
      { type: 'mc', prompt: 'ella ___ (acostarse) tarde', options: ['se acuesta', 'se acosta', 'me acuesto'], answer: 'se acuesta' },
    ]),
  lesson(L, 'preterite', 2, 22, 'grammar', 'The preterite (simple past)',
    `For completed actions at a specific time.
    **-ar** (hablar): hablé, hablaste, habló, hablamos, hablaron
    **-er/-ir** (comer): comí, comiste, comió, comimos, comieron
    Key irregulars: **ser/ir**: fui, fuiste, fue, fuimos, fueron · **tener**: tuve, tuviste, tuvo… · **hacer**: hice, hiciste, hizo… · **estar**: estuve · **poder**: pude · **decir**: dije, dijeron.
    The accent matters: *hablo* "I speak" vs *habló* "he spoke".`,
    [
      { type: 'type', prompt: 'yo ___ (hablar) con ella ayer', answer: 'hablé', side: 'target' },
      { type: 'type', prompt: 'ellos ___ (comer) a las dos', answer: 'comieron', side: 'target' },
      { type: 'mc', prompt: '"We went to the beach"', options: ['Fuimos a la playa', 'Íbamos a la playa', 'Vamos a la playa'], answer: 'Fuimos a la playa' },
      { type: 'mc', prompt: '"habló" means…', options: ['he/she spoke', 'I speak'], answer: 'he/she spoke' },
      { type: 'type', prompt: 'él ___ (hacer) la tarea', answer: 'hizo', side: 'target' },
    ]),
  lesson(L, 'imperfect', 2, 23, 'grammar', 'The imperfect',
    `For background, habits and ongoing past states ("used to", "was …-ing").
    **-ar**: hablaba, hablabas, hablaba, hablábamos, hablaban
    **-er/-ir**: comía, comías, comía, comíamos, comían
    Only three irregulars: **ser** era · **ir** iba · **ver** veía.
    *Cuando era niño, jugaba al fútbol.* "When I was a child, I used to play football."`,
    [
      { type: 'type', prompt: 'nosotros ___ (vivir) en Lima', answer: 'vivíamos', side: 'target' },
      { type: 'mc', prompt: 'Cuando ___ niña, leía mucho.', options: ['era', 'fui', 'estaba'], answer: 'era' },
      { type: 'type', prompt: 'ellos ___ (ir) al parque cada día', answer: 'iban', side: 'target' },
    ]),
  lesson(L, 'pret-vs-imp', 2, 24, 'grammar', 'Preterite or imperfect?',
    `**Preterite**: a completed event, a sequence, a specific number of times. **Imperfect**: the scene, habits, what was going on.
    *Leía (imperfect) cuando sonó (preterite) el teléfono.* "I was reading when the phone rang."
    Signals: ayer, el lunes, de repente → preterite; siempre, todos los días, mientras → imperfect.
    Meaning shifts: *conocí* "I met" vs *conocía* "I knew"; *supe* "I found out" vs *sabía* "I knew".`,
    [
      { type: 'mc', prompt: 'Mientras yo ___, llegó mi hermano.', options: ['cocinaba', 'cociné'], answer: 'cocinaba' },
      { type: 'mc', prompt: 'Ayer ___ al cine.', options: ['fui', 'iba'], answer: 'fui' },
      { type: 'mc', prompt: '"conocí a María" means…', options: ['I met María', 'I used to know María'], answer: 'I met María' },
      { type: 'mc', prompt: 'Todos los veranos ___ a la playa.', options: ['íbamos', 'fuimos'], answer: 'íbamos' },
    ]),
  lesson(L, 'object-pronouns', 2, 25, 'grammar', 'Object pronouns',
    `**Direct** (what): me, te, **lo/la**, nos, **los/las**: *¿El libro? Lo tengo.*
    **Indirect** (to whom): me, te, **le**, nos, **les**: *Le doy el libro.*
    Order: indirect before direct. **le/les → se** before lo/la/los/las: *Se lo doy* "I give it to him".
    Placement: before a conjugated verb, or attached to an infinitive/gerund/affirmative command: *Voy a dártelo. Dámelo.*`,
    [
      { type: 'mc', prompt: '¿Las llaves? ___ tengo.', options: ['Las', 'Los', 'Les'], answer: 'Las' },
      { type: 'mc', prompt: '"I give it (el libro) to her"', options: ['Se lo doy', 'Le lo doy', 'Lo le doy'], answer: 'Se lo doy' },
      { type: 'mc', prompt: '"Give it to me!" (tú, el libro)', options: ['¡Dámelo!', '¡Me lo da!', '¡Lo dame!'], answer: '¡Dámelo!' },
    ]),
  lesson(L, 'future-comparatives', 2, 26, 'grammar', 'Talking about the future; comparisons',
    `**ir a** + infinitive = "going to": *Voy a estudiar.* This is the most common future in speech.
    Simple future: infinitive + **-é, -ás, -á, -emos, -án**: *hablaré, comerás*. Irregular stems: tendr-, podr-, har-, dir-, saldr-, vendr-, querr-, sabr-.

    Comparisons: **más/menos** + adj + **que**: *Es más alto que yo.* Equal: **tan** + adj + **como**: *tan alto como*.
    Irregular: mejor (better), peor (worse), mayor (older), menor (younger).`,
    [
      { type: 'type', prompt: 'Translate: "I am going to eat"', answer: 'voy a comer', side: 'target' },
      { type: 'type', prompt: 'yo ___ (tener, future)', answer: 'tendré', side: 'target' },
      { type: 'mc', prompt: '"She is taller than me"', options: ['Es más alta que yo', 'Es más alta como yo', 'Es tan alta que yo'], answer: 'Es más alta que yo' },
      { type: 'mc', prompt: '"better" is…', options: ['mejor', 'más bueno', 'mayor'], answer: 'mejor' },
    ]),

  // ============================ LEVEL 3 (B1) ============================
  lesson(L, 'present-perfect', 3, 30, 'grammar', 'Present perfect and pluperfect',
    `**haber** + past participle: he, has, ha, hemos, han + **-ado / -ido**: *He comido. ¿Has visto la película?*
    Irregular participles: hecho, dicho, visto, escrito, puesto, vuelto, abierto, roto, muerto.
    Pluperfect ("had done"): había, habías, había, habíamos, habían + participle: *Cuando llegué, ya habían salido.*
    In much of Latin America the preterite is preferred where Spain uses the perfect: *¿Comiste?* vs *¿Has comido?*`,
    [
      { type: 'type', prompt: 'Translate: "I have eaten"', answer: 'he comido', side: 'target' },
      { type: 'mc', prompt: 'Participle of "escribir"', options: ['escrito', 'escribido', 'escrido'], answer: 'escrito' },
      { type: 'mc', prompt: '"They had left"', options: ['Habían salido', 'Han salido', 'Salieron'], answer: 'Habían salido' },
      { type: 'type', prompt: 'nosotros ___ ___ (hacer, perfect)', answer: 'hemos hecho', side: 'target' },
    ]),
  lesson(L, 'conditional', 3, 31, 'grammar', 'The conditional',
    `"would": infinitive + **-ía, -ías, -ía, -íamos, -ían**: *hablaría, comería*. Same irregular stems as the future: tendría, podría, haría, diría, querría, sabría.
    Polite requests: *¿Podría ayudarme?* "Could you help me?" *Me gustaría un café.*
    Advice: *Yo que tú, estudiaría más.* "If I were you, I'd study more."`,
    [
      { type: 'type', prompt: 'yo ___ (hablar, conditional)', answer: 'hablaría', side: 'target' },
      { type: 'mc', prompt: '"Could you help me?" (usted)', options: ['¿Podría ayudarme?', '¿Puede ayudarme?', '¿Pudo ayudarme?'], answer: '¿Podría ayudarme?' },
      { type: 'type', prompt: 'Translate: "I would like a coffee"', answer: 'me gustaría un café', side: 'target' },
    ]),
  lesson(L, 'subjunctive-forms', 3, 32, 'grammar', 'Present subjunctive: forms',
    `Take the **yo** form, drop -o, add the "opposite" endings:
    **-ar** → e: hablar → hable, hables, hable, hablemos, hablen
    **-er/-ir** → a: comer → coma, comas, coma, comamos, coman; tener (tengo) → tenga
    Irregular: **ser** sea · **ir** vaya · **estar** esté · **saber** sepa · **haber** haya · **dar** dé.
    Spelling: buscar → busque, llegar → llegue, empezar → empiece.`,
    [
      { type: 'type', prompt: 'hablar → que yo ___', answer: 'hable', side: 'target' },
      { type: 'type', prompt: 'tener → que él ___', answer: 'tenga', side: 'target' },
      { type: 'mc', prompt: 'ir → que nosotros ___', options: ['vayamos', 'vamos', 'iremos'], answer: 'vayamos' },
      { type: 'mc', prompt: 'ser → que ellos ___', options: ['sean', 'son', 'estén'], answer: 'sean' },
    ]),
  lesson(L, 'subjunctive-uses', 3, 33, 'grammar', 'Present subjunctive: when to use it',
    `Use the subjunctive in a **que** clause when the main clause expresses (WEIRDO):
    **W**ishes: *Quiero que vengas.* · **E**motion: *Me alegra que estés aquí.* · **I**mpersonal opinions: *Es importante que estudies.* · **R**ecommendations: *Te recomiendo que leas.* · **D**oubt/denial: *Dudo que sea verdad.* · **O**jalá: *Ojalá llueva.*
    Certainty takes the indicative: *Creo que es verdad* but *No creo que sea verdad.*
    Same subject: use the infinitive: *Quiero ir* (not *quiero que vaya* for yourself).`,
    [
      { type: 'mc', prompt: 'Quiero que tú ___ conmigo.', options: ['vengas', 'vienes', 'venir'], answer: 'vengas' },
      { type: 'mc', prompt: 'Creo que ___ verdad.', options: ['es', 'sea'], answer: 'es', explanation: 'Belief/certainty → indicative.' },
      { type: 'mc', prompt: 'No creo que ___ verdad.', options: ['sea', 'es'], answer: 'sea' },
      { type: 'mc', prompt: 'Es importante que ustedes ___.', options: ['estudien', 'estudian'], answer: 'estudien' },
      { type: 'mc', prompt: '"I want to go" (yo, same subject)', options: ['Quiero ir', 'Quiero que vaya'], answer: 'Quiero ir' },
    ]),
  lesson(L, 'commands', 3, 34, 'grammar', 'Commands (imperative)',
    `**tú, affirmative** = él form of present: *¡Habla! ¡Come!* Irregular: di, haz, ve, pon, sal, sé, ten, ven.
    **tú, negative** = subjunctive: *¡No hables! ¡No comas!*
    **usted / ustedes** = subjunctive (affirmative and negative): *Hable, por favor. No coman aquí.*
    Pronouns attach to affirmative, precede negative: *Dímelo / No me lo digas.*
    Polite written instructions often use the usted form or the infinitive (*No fumar*).`,
    [
      { type: 'mc', prompt: '"Come here!" (tú)', options: ['¡Ven aquí!', '¡Vienes aquí!', '¡Venga aquí!'], answer: '¡Ven aquí!' },
      { type: 'mc', prompt: '"Don\'t speak!" (tú)', options: ['¡No hables!', '¡No habla!', '¡No hablas!'], answer: '¡No hables!' },
      { type: 'mc', prompt: '"Please sit down" (usted)', options: ['Siéntese, por favor', 'Siéntate, por favor', 'Se sienta, por favor'], answer: 'Siéntese, por favor', register: 'formal' },
      { type: 'type', prompt: '"Do it!" (tú, hacer + lo)', answer: '¡hazlo!', accept: ['hazlo'], side: 'target' },
    ]),
  lesson(L, 'por-para-relatives', 3, 35, 'grammar', 'por vs para; relative pronouns',
    `**para**: purpose, destination, recipient, deadline: *para aprender, para Madrid, para ti, para el lunes*.
    **por**: cause, through/along, exchange, duration, agent of passive: *por la lluvia, por el parque, por diez euros, por dos horas, escrito por Cervantes*. Also *gracias por*.

    Relatives: **que** (that/who/which, most common) · **quien(es)** after prepositions for people (*la mujer con quien hablé*) · **lo que** "what" (*Lo que dices es cierto*) · **donde** where · **cuyo/a** whose.`,
    [
      { type: 'mc', prompt: 'Este regalo es ___ ti.', options: ['para', 'por'], answer: 'para' },
      { type: 'mc', prompt: 'Gracias ___ tu ayuda.', options: ['por', 'para'], answer: 'por' },
      { type: 'mc', prompt: 'Caminamos ___ el parque.', options: ['por', 'para'], answer: 'por' },
      { type: 'mc', prompt: '"What you say is true"', options: ['Lo que dices es verdad', 'Que dices es verdad', 'Qué dices es verdad'], answer: 'Lo que dices es verdad' },
    ]),

  // ============================ LEVEL 4 (B2) ============================
  lesson(L, 'imperfect-subjunctive', 4, 40, 'grammar', 'Imperfect subjunctive and "if" clauses',
    `Form: 3rd-person plural preterite, drop -ron, add **-ra, -ras, -ra, -ramos, -ran** (fueron → fuera; tuvieron → tuviera; hablaron → hablara). A -se form (fuese) also exists, common in writing.
    Use: subjunctive triggers in the past: *Quería que vinieras.*
    **Hypothetical "if"**: *si* + imperfect subjunctive, conditional: *Si tuviera dinero, viajaría.* "If I had money, I'd travel."
    Real conditions use the indicative: *Si llueve, me quedo en casa.* Never use the present subjunctive after *si*.`,
    [
      { type: 'type', prompt: 'tener → que yo ___ (imperfect subjunctive)', answer: 'tuviera', accept: ['tuviese'], side: 'target' },
      { type: 'mc', prompt: 'Si ___ tiempo, iría contigo.', options: ['tuviera', 'tenga', 'tendría'], answer: 'tuviera' },
      { type: 'mc', prompt: 'Si llueve, ___ en casa.', options: ['me quedo', 'me quedara', 'me quede'], answer: 'me quedo' },
      { type: 'mc', prompt: 'Mi madre quería que yo ___ médico.', options: ['fuera', 'sea', 'era'], answer: 'fuera' },
    ]),
  lesson(L, 'adverbial-subjunctive', 4, 41, 'grammar', 'Subjunctive after conjunctions',
    `**Always** subjunctive: para que, a menos que, sin que, antes de que, con tal de que, en caso de que.
    *Te lo explico para que lo entiendas.*
    **Time** conjunctions (cuando, hasta que, en cuanto, después de que) take the subjunctive when the event hasn't happened yet: *Cuando llegues, llámame* but *Cuando llegué, te llamé.*
    **aunque** + indicative = fact ("although"); + subjunctive = hypothetical/irrelevant ("even if").`,
    [
      { type: 'mc', prompt: 'Cuando ___ a casa, llámame.', options: ['llegues', 'llegas', 'llegarás'], answer: 'llegues' },
      { type: 'mc', prompt: 'Cuando ___ a casa, te llamé.', options: ['llegué', 'llegue', 'llegara'], answer: 'llegué' },
      { type: 'mc', prompt: 'Lo hago para que tú ___ feliz.', options: ['estés', 'estás', 'estar'], answer: 'estés' },
      { type: 'mc', prompt: '"Aunque llueva, iré" means…', options: ['Even if it rains, I\'ll go', 'Although it is raining, I\'ll go'], answer: 'Even if it rains, I\'ll go' },
    ]),
  lesson(L, 'passive-se', 4, 42, 'grammar', 'Passive voice and impersonal se',
    `**ser** + participle (+ **por**): *El libro fue escrito por García Márquez.* Common in news and formal writing.
    **Passive se** (more natural): *Se venden casas* "Houses are sold / for sale". The verb agrees with the noun.
    **Impersonal se**: *Se dice que…* "They say that…", *Aquí se habla español.*
    **Accidental se**: *Se me olvidó* "I forgot (it slipped my mind)", *Se le rompió el vaso.*`,
    [
      { type: 'mc', prompt: '"Apartments for rent"', options: ['Se alquilan apartamentos', 'Se alquila apartamentos', 'Alquilan se apartamentos'], answer: 'Se alquilan apartamentos' },
      { type: 'mc', prompt: '"The bridge was built in 1900"', options: ['El puente fue construido en 1900', 'El puente estuvo construido en 1900', 'El puente construyó en 1900'], answer: 'El puente fue construido en 1900' },
      { type: 'mc', prompt: '"Se me olvidó" means…', options: ['I forgot', 'He forgot me', 'I was forgotten'], answer: 'I forgot' },
    ]),
  lesson(L, 'reported-speech', 4, 43, 'grammar', 'Reported speech',
    `Tenses shift back after a past reporting verb:
    present → imperfect: "Estoy cansado" → *Dijo que estaba cansado.*
    preterite/perfect → pluperfect: "Lo he hecho" → *Dijo que lo había hecho.*
    future → conditional: "Vendré" → *Dijo que vendría.*
    command → imperfect subjunctive: "Ven" → *Me dijo que fuera.*
    Questions: *Me preguntó si quería ir / dónde vivía.*
    Pronouns and time words shift too: hoy → ese día, mañana → al día siguiente.`,
    [
      { type: 'mc', prompt: '"Vendré mañana" → Dijo que ___ al día siguiente.', options: ['vendría', 'vendrá', 'venga'], answer: 'vendría' },
      { type: 'mc', prompt: '"Cierra la puerta" → Me pidió que ___ la puerta.', options: ['cerrara', 'cierro', 'cierre'], answer: 'cerrara' },
      { type: 'mc', prompt: '"¿Tienes hambre?" → Me preguntó ___ tenía hambre.', options: ['si', 'que', 'qué'], answer: 'si' },
    ]),
  lesson(L, 'connectors', 4, 44, 'grammar', 'Connectors for paragraphs',
    `Linking words make paragraphs readable and are essential for translation:
    Addition: además, también, asimismo · Contrast: sin embargo, no obstante, en cambio, aunque · Cause: porque, ya que, puesto que, debido a · Result: por lo tanto, así que, por eso · Sequence: primero, luego, después, finalmente · Example: por ejemplo, es decir · Conclusion: en resumen, en conclusión.
    *Estaba enfermo; sin embargo, fue a trabajar.*`,
    [
      { type: 'mc', prompt: '"however" (formal)', options: ['sin embargo', 'por eso', 'además'], answer: 'sin embargo' },
      { type: 'mc', prompt: '"therefore"', options: ['por lo tanto', 'aunque', 'es decir'], answer: 'por lo tanto' },
      { type: 'mc', prompt: '"since / given that"', options: ['ya que', 'en cambio', 'luego'], answer: 'ya que' },
    ]),

  // ============================ LEVEL 5 (C1) ============================
  lesson(L, 'perfect-subjunctive', 5, 50, 'grammar', 'Perfect tenses of the subjunctive',
    `**Perfect subjunctive**: haya, hayas, haya, hayamos, hayan + participle: *Espero que hayas dormido bien.*
    **Pluperfect subjunctive**: hubiera/hubiese + participle.
    **Past unreal conditions**: *si* + pluperfect subjunctive, conditional perfect (habría + participle): *Si hubiera estudiado, habría aprobado.* "If I had studied, I would have passed."
    In speech, *hubiera* often replaces *habría* in the second half: *Si lo hubiera sabido, te lo hubiera dicho.*`,
    [
      { type: 'mc', prompt: 'Espero que ___ bien el examen.', options: ['hayas hecho', 'has hecho', 'hicieras'], answer: 'hayas hecho' },
      { type: 'mc', prompt: 'Si ___ antes, habríamos llegado a tiempo.', options: ['hubiéramos salido', 'saliéramos', 'habíamos salido'], answer: 'hubiéramos salido' },
      { type: 'type', prompt: 'Translate: "I would have gone" (ir)', answer: 'habría ido', accept: ['hubiera ido', 'yo habría ido'], side: 'target' },
    ]),
  lesson(L, 'periphrases', 5, 51, 'grammar', 'Verb periphrases and nuance',
    `**acabar de** + inf: "have just": *Acabo de llegar.*
    **llevar** + time + gerund: "have been …-ing": *Llevo dos años estudiando español.*
    **seguir/continuar** + gerund: "keep on": *Sigue lloviendo.*
    **volver a** + inf: "again": *Volvió a llamar.*
    **dejar de** + inf: "stop": *Dejé de fumar.*
    **soler** + inf: "usually": *Suelo levantarme temprano.*
    **estar a punto de**: "be about to".`,
    [
      { type: 'mc', prompt: '"I have just arrived"', options: ['Acabo de llegar', 'Termino de llegar', 'Llego justo'], answer: 'Acabo de llegar' },
      { type: 'mc', prompt: '"She called again"', options: ['Volvió a llamar', 'Llamó de nuevo a volver', 'Dejó de llamar'], answer: 'Volvió a llamar' },
      { type: 'mc', prompt: '"I usually get up early"', options: ['Suelo levantarme temprano', 'Sigo levantarme temprano', 'Acabo de levantarme temprano'], answer: 'Suelo levantarme temprano' },
      { type: 'type', prompt: 'Translate: "I stopped smoking"', answer: 'dejé de fumar', side: 'target' },
    ]),
  lesson(L, 'formal-writing', 5, 52, 'register', 'Formal written Spanish',
    `Formal letters and documents use **usted/ustedes** throughout.
    Openings: *Estimado/a señor/a:* · *Distinguidos señores:* (note the colon). Closings: *Atentamente,* · *Un cordial saludo,*
    Typical phrases: *Le escribo para…* "I am writing to…", *Quedo a la espera de su respuesta* "I look forward to your reply", *Adjunto le envío…* "Please find attached…".
    Formal writing prefers nouns and the passive se: *Se ruega puntualidad* "Punctuality is requested".`,
    [
      { type: 'register-scene', prompt: 'Opening of a formal letter to a company', options: ['Estimados señores:', '¡Hola, chicos!', 'Querido amigo:'], answer: 'Estimados señores:', register: 'formal' },
      { type: 'mc', prompt: '"I look forward to your reply"', options: ['Quedo a la espera de su respuesta', 'Espero tu respuesta, ¿vale?', 'Responde pronto'], answer: 'Quedo a la espera de su respuesta', register: 'formal' },
      { type: 'mc', prompt: 'A standard formal closing', options: ['Atentamente,', 'Besos,', 'Chao,'], answer: 'Atentamente,' },
    ]),
  lesson(L, 'false-friends', 5, 53, 'grammar', 'False friends and translation traps',
    `Words that look like English but aren't:
    **embarazada** pregnant (not embarrassed → *avergonzado*) · **actual** current (actually → *en realidad*) · **librería** bookshop (library → *biblioteca*) · **éxito** success (exit → *salida*) · **constipado** having a cold · **realizar** carry out (realise → *darse cuenta*) · **sensible** sensitive (sensible → *sensato*) · **asistir** attend (assist → *ayudar*).
    When translating, watch also for **subject drop** (add "he/she/it" in English) and **double negatives** (translate as single negatives).`,
    [
      { type: 'mc', prompt: '"actual" means…', options: ['current', 'actual / real'], answer: 'current' },
      { type: 'mc', prompt: '"library" in Spanish', options: ['biblioteca', 'librería'], answer: 'biblioteca' },
      { type: 'mc', prompt: '"Está embarazada" means…', options: ['She is pregnant', 'She is embarrassed'], answer: 'She is pregnant' },
      { type: 'mc', prompt: '"realizar un proyecto" means…', options: ['carry out a project', 'realise a project exists'], answer: 'carry out a project' },
    ]),
];
