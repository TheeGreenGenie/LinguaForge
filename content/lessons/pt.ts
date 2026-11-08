// Brazilian Portuguese grammar curriculum, Levels 1–5 (A1–C1). European differences noted.
// Authored; verified:false until reviewed.
import { lesson } from '../helpers';

const L = 'pt' as const;

export const ptCurriculum = [
  // ============================ LEVEL 0 (sounds) ============================
  lesson(L, 'stress', 0, 3, 'script', 'Word stress: reading any word aloud',
    `Portuguese stress rules (very like Spanish):
    1. Ends in **a, e, o** (+ s) or **am/em/ens** → stress the **second-to-last** syllable: *ca-sa, fa-lam, jo-vem*.
    2. Ends in **i, u, l, r, z, ão** or other consonants → stress the **last** syllable: *fa-lar, Bra-sil, a-qui, ca-fé* (here é needs an accent because it ends in e).
    3. **Written accents** (´ ^) override: *mú-si-ca, ô-ni-bus, ví-deo*.
    **~** marks nasality, not stress, but a word with ã/õ is usually stressed there: *ir-mã, co-ra-ção*.`,
    [
      { type: 'mc', prompt: 'Where is the stress in "falam"?', options: ['FA-lam', 'fa-LAM'], answer: 'FA-lam' },
      { type: 'mc', prompt: 'Where is the stress in "falar"?', options: ['fa-LAR', 'FA-lar'], answer: 'fa-LAR' },
      { type: 'mc', prompt: 'Where is the stress in "ônibus"?', options: ['Ô-ni-bus', 'o-ni-BUS'], answer: 'Ô-ni-bus' },
      { type: 'mc', prompt: 'Where is the stress in "Brasil"?', options: ['Bra-SIL', 'BRA-sil'], answer: 'Bra-SIL' },
    ]),
  lesson(L, 'vowels-nasals', 0, 4, 'script', 'Open/closed vowels, nasals, and reduced endings',
    `**é / ó** are open ("eh", "aw"): *café, avó* · **ê / ô** are closed ("ay", "oh"): *você, avô*. The accent tells you which.
    **Nasal diphthongs**: **ão** ("owng" through the nose): *pão, não* · **õe**: *põe, lições* · **ãe**: *mãe*.
    **m/n at the end of a syllable** aren't fully pronounced; they nasalise the vowel: *bom, sim, também*.
    **Unstressed endings** weaken in Brazil: final **-o** → "oo" (*livro* ≈ LEE-vroo), final **-e** → "ee" (*leite* ≈ LAY-chee).
    **x** has several sounds: "sh" (*xícara*), "z" (*exame*), "ks" (*táxi*), "s" (*próximo*).`,
    [
      { type: 'mc', prompt: '"avó" (open ó) means…', options: ['grandmother', 'grandfather'], answer: 'grandmother' },
      { type: 'letter-sound', prompt: '"ão" in "pão" is…', options: ['a nasal diphthong', 'two separate syllables a-o', 'silent'], answer: 'a nasal diphthong' },
      { type: 'letter-sound', prompt: 'Final "-o" in "livro" (Brazil) sounds like…', options: ['oo', 'oh', 'silent'], answer: 'oo' },
      { type: 'letter-sound', prompt: '"x" in "xícara" sounds like…', options: ['sh', 'ks', 'z'], answer: 'sh' },
    ]),

  // ============================ LEVEL 1 (A1) ============================
  lesson(L, 'ser-estar', 1, 12, 'grammar', 'ser vs estar',
    `**ser**: identity, origin, profession, permanent traits, time: eu sou, você/ele é, nós somos, vocês/eles são. *Sou brasileiro. É uma hora.*
    **estar**: temporary states, location of things/people, -ing: eu estou, você/ele está, nós estamos, vocês/eles estão. *Estou cansado. Ela está em casa.*
    The "-ing" form: **estar + gerúndio**: *Estou lendo* "I'm reading". (Portugal: *estou a ler*.)
    Fixed locations like cities often use **ficar**: *Onde fica o banco?*`,
    [
      { type: 'mc', prompt: 'Eu ___ professor.', options: ['sou', 'estou'], answer: 'sou' },
      { type: 'mc', prompt: 'Hoje eu ___ cansada.', options: ['estou', 'sou'], answer: 'estou' },
      { type: 'mc', prompt: '"I\'m reading" (Brazil)', options: ['Estou lendo', 'Sou lendo', 'Estou ler'], answer: 'Estou lendo' },
      { type: 'mc', prompt: '"Where is the bank?" (fixed location)', options: ['Onde fica o banco?', 'Onde é o banco estando?', 'Onde está sendo o banco?'], answer: 'Onde fica o banco?' },
    ]),
  lesson(L, 'ter-questions', 1, 13, 'grammar', 'ter, "there is", questions',
    `**ter** (to have): eu tenho, você/ele tem, nós temos, vocês/eles têm.
    In Brazil **tem** also means "there is/are": *Tem um café aqui perto.* Formal/written: **há**: *Há muitas pessoas.*
    **ter que / ter de** + infinitive = "have to": *Tenho que trabalhar.*
    Question words: **o que** what · **quem** who · **onde** where · **quando** when · **como** how · **por que** why · **quanto** how much · **qual** which.
    "Because" = **porque**; "why?" at the end of a sentence = **por quê?**`,
    [
      { type: 'type', prompt: 'eles ___ (ter)', answer: 'têm', side: 'target' },
      { type: 'mc', prompt: '"There are many people" (formal writing)', options: ['Há muitas pessoas', 'Tem muitas pessoas', 'São muitas pessoas'], answer: 'Há muitas pessoas', register: 'formal' },
      { type: 'type', prompt: 'Translate: "I have to work"', answer: 'tenho que trabalhar', accept: ['eu tenho que trabalhar', 'tenho de trabalhar'], side: 'target' },
      { type: 'mc', prompt: '"why" (question word)', options: ['por que', 'porque', 'para quê'], answer: 'por que' },
    ]),
  lesson(L, 'adjectives-possessives', 1, 14, 'grammar', 'Adjectives and possessives',
    `Adjectives agree and usually follow the noun: *um carro novo, uma casa nova, carros novos, casas novas*.
    Possessives agree with the thing owned: **meu/minha** my · **seu/sua** your (você) · **nosso/nossa** our · **seus/suas**. Often with the article: *o meu livro, a minha casa*.
    For "his/her/their", Brazilians prefer **dele, dela, deles** after the noun to avoid ambiguity: *o carro dele* "his car", *a casa dela* "her house".`,
    [
      { type: 'mc', prompt: '"my house"', options: ['a minha casa', 'o meu casa', 'a meu casa'], answer: 'a minha casa' },
      { type: 'mc', prompt: '"her car" (clear, Brazilian style)', options: ['o carro dela', 'o seu carro dela', 'a carro dela'], answer: 'o carro dela' },
      { type: 'mc', prompt: 'casas ___ (new)', options: ['novas', 'novos', 'nova'], answer: 'novas' },
    ]),
  lesson(L, 'numbers-time', 1, 15, 'grammar', 'Numbers and time',
    `um/uma, dois/duas, três, quatro, cinco, seis, sete, oito, nove, dez, onze, doze, treze, catorze, quinze, dezesseis, dezessete, dezoito, dezenove, vinte, vinte e um, trinta, quarenta, cinquenta, cem (100), cento e um (101).
    **um/uma** and **dois/duas** agree with the noun: *duas casas*.
    Time: *Que horas são?* — *É uma hora. São duas horas. São três e meia.*
    In Brazil, "six" is often said **meia** (half dozen) when reading out phone numbers.`,
    [
      { type: 'mc', prompt: '"two houses"', options: ['duas casas', 'dois casas'], answer: 'duas casas' },
      { type: 'type', prompt: 'Write 16 in words (Brazil)', answer: 'dezesseis', side: 'target' },
      { type: 'mc', prompt: '"It\'s two o\'clock"', options: ['São duas horas', 'É duas horas', 'Está duas horas'], answer: 'São duas horas' },
    ]),
  lesson(L, 'er-ir-verbs', 1, 16, 'grammar', '-er and -ir verbs; key irregulars',
    `**-er** (comer): como, come, comemos, comem · **-ir** (abrir): abro, abre, abrimos, abrem.
    Key irregulars: **ir**: vou, vai, vamos, vão · **fazer**: faço, faz, fazemos, fazem · **poder**: posso, pode, podemos, podem · **querer**: quero, quer, queremos, querem · **dizer**: digo, diz · **ver**: vejo, vê.
    (*tu* forms exist in parts of Brazil and in Portugal: tu comes, tu vais.)`,
    [
      { type: 'type', prompt: 'eu ___ (fazer)', answer: 'faço', side: 'target' },
      { type: 'type', prompt: 'nós ___ (ir)', answer: 'vamos', side: 'target' },
      { type: 'type', prompt: 'eu ___ (poder)', answer: 'posso', side: 'target' },
      { type: 'mc', prompt: 'eles ___ (ir)', options: ['vão', 'vam', 'vamos'], answer: 'vão' },
    ]),

  // ============================ LEVEL 2 (A2) ============================
  lesson(L, 'preterito-perfeito', 2, 20, 'grammar', 'Pretérito perfeito (simple past)',
    `For completed actions.
    **-ar** (falar): falei, falou, falamos, falaram · **-er** (comer): comi, comeu, comemos, comeram · **-ir** (abrir): abri, abriu, abrimos, abriram.
    Irregular: **ser/ir**: fui, foi, fomos, foram · **ter**: tive, teve, tivemos, tiveram · **fazer**: fiz, fez, fizemos, fizeram · **estar**: estive, esteve · **poder**: pude, pôde · **dizer**: disse.
    Note: *pode* "he can" vs *pôde* "he could (past)".`,
    [
      { type: 'type', prompt: 'eu ___ (falar, past)', answer: 'falei', side: 'target' },
      { type: 'type', prompt: 'ela ___ (comer, past)', answer: 'comeu', side: 'target' },
      { type: 'mc', prompt: '"We went to the beach"', options: ['Fomos à praia', 'Íamos à praia', 'Vamos à praia'], answer: 'Fomos à praia' },
      { type: 'type', prompt: 'eu ___ (fazer, past)', answer: 'fiz', side: 'target' },
    ]),
  lesson(L, 'imperfeito', 2, 21, 'grammar', 'Pretérito imperfeito',
    `For habits, descriptions and ongoing past actions.
    **-ar**: falava, falava, falávamos, falavam · **-er/-ir**: comia, comia, comíamos, comiam.
    Irregular: **ser** era · **ter** tinha · **vir** vinha · **pôr** punha.
    *Quando eu era criança, brincava na rua.*
    **perfeito vs imperfeito**: *Eu lia (background) quando o telefone tocou (event).*`,
    [
      { type: 'type', prompt: 'nós ___ (morar, imperfeito)', answer: 'morávamos', side: 'target' },
      { type: 'mc', prompt: 'Quando eu ___ criança, morava no Rio.', options: ['era', 'fui', 'estava'], answer: 'era' },
      { type: 'mc', prompt: 'Eu dormia quando você ___.', options: ['ligou', 'ligava'], answer: 'ligou' },
    ]),
  lesson(L, 'object-pronouns', 2, 22, 'grammar', 'Object pronouns (spoken vs written)',
    `**Spoken Brazil** commonly uses subject pronouns as objects or drops them: *Eu vi ele* "I saw him", *Eu vi* "I saw (it)".
    **Written/standard**: **o, a, os, as** (direct), **lhe, lhes** (indirect): *Eu o vi. Eu lhe dei o livro.*
    After -r/-s/-z verb endings, o/a → **lo/la**: *Vou vê-lo* "I'm going to see him". After nasal endings → **no/na**: *Viram-no.*
    **me, te, nos** work like Spanish: *Ele me ligou.* In Brazil the pronoun usually goes **before** the verb (próclise).`,
    [
      { type: 'mc', prompt: '"I saw him" (formal writing)', options: ['Eu o vi', 'Eu vi ele', 'Eu lhe vi'], answer: 'Eu o vi', register: 'formal' },
      { type: 'mc', prompt: '"I\'m going to see her" (formal)', options: ['Vou vê-la', 'Vou ver a', 'Vou ver-a'], answer: 'Vou vê-la' },
      { type: 'mc', prompt: '"He called me" (Brazil)', options: ['Ele me ligou', 'Ele ligou-me eu', 'Ele ligou eu'], answer: 'Ele me ligou' },
    ]),
  lesson(L, 'future-reflexive', 2, 23, 'grammar', 'Future and reflexive verbs',
    `**ir** + infinitive is the everyday future: *Vou estudar amanhã.*
    Simple future (more formal): infinitive + **-ei, -á, -emos, -ão**: *falarei, comerá*. Irregular stems: far- (fazer), dir- (dizer), trar- (trazer).
    Reflexive: **se** pronouns (me, se, nos, se): *Eu me chamo Ana. Ele se levanta cedo.* (Portugal: *chamo-me*.)`,
    [
      { type: 'type', prompt: 'Translate: "I am going to study"', answer: 'vou estudar', accept: ['eu vou estudar'], side: 'target' },
      { type: 'type', prompt: 'eu ___ (fazer, simple future)', answer: 'farei', side: 'target' },
      { type: 'mc', prompt: '"My name is Ana" (Brazil)', options: ['Eu me chamo Ana', 'Eu chamo-me Ana', 'Eu chamo Ana'], answer: 'Eu me chamo Ana' },
    ]),
  lesson(L, 'contractions-comparatives', 2, 24, 'grammar', 'Contractions and comparisons',
    `Prepositions merge with articles and pronouns:
    **de**: do, da, dos, das, dele, dela, deste, disso · **em**: no, na, nos, nas, nele, neste, nisso · **a**: ao, à, aos, às · **por**: pelo, pela.
    *Moro no Brasil. Gosto da música. Passamos pelo parque.*
    Comparisons: **mais/menos … (do) que**: *Ele é mais alto (do) que eu.* Equal: **tão … quanto**. Irregular: melhor, pior, maior, menor.`,
    [
      { type: 'mc', prompt: 'Moro ___ Brasil.', options: ['no', 'em o', 'ao'], answer: 'no' },
      { type: 'mc', prompt: 'Passamos ___ centro.', options: ['pelo', 'por o', 'pela'], answer: 'pelo' },
      { type: 'mc', prompt: '"She is better than me"', options: ['Ela é melhor do que eu', 'Ela é mais boa que eu', 'Ela é tão melhor eu'], answer: 'Ela é melhor do que eu' },
    ]),

  // ============================ LEVEL 3 (B1) ============================
  lesson(L, 'subjuntivo-presente', 3, 30, 'grammar', 'Present subjunctive',
    `Form: **eu** present minus -o + opposite vowel: falar → **fale**, falemos, falem · comer → **coma** · fazer (faço) → **faça** · ter (tenho) → **tenha**.
    Irregular: ser → **seja** · estar → **esteja** · ir → **vá** · saber → **saiba** · querer → **queira** · dar → **dê**.
    Used after wishes, emotions, doubt and impersonal expressions + **que**: *Espero que você venha. É importante que você estude. Talvez ele saiba.*`,
    [
      { type: 'mc', prompt: 'Espero que você ___ (vir).', options: ['venha', 'vem', 'vier'], answer: 'venha' },
      { type: 'mc', prompt: 'É importante que nós ___ (estudar).', options: ['estudemos', 'estudamos', 'estudarmos'], answer: 'estudemos' },
      { type: 'type', prompt: 'ser → que ele ___', answer: 'seja', side: 'target' },
    ]),
  lesson(L, 'futuro-subjuntivo', 3, 31, 'grammar', 'Future subjunctive (a Portuguese special)',
    `Portuguese has a **future subjunctive**, used after **quando, se, assim que, enquanto, quem** for future events.
    Form: 3rd-person plural perfeito minus **-ram**, add **-r, -r, -rmos, -rem**: fizeram → **fizer**; foram → **for**; tiveram → **tiver**; falaram → **falar**.
    *Quando você chegar, me liga.* "When you arrive, call me." *Se eu tiver tempo, vou.* "If I have time, I'll go." *Quem quiser, pode vir.*`,
    [
      { type: 'mc', prompt: 'Quando você ___ (chegar), me avisa.', options: ['chegar', 'chega', 'chegue'], answer: 'chegar' },
      { type: 'mc', prompt: 'Se eu ___ (ter) tempo, vou ao cinema.', options: ['tiver', 'tenho', 'tenha'], answer: 'tiver' },
      { type: 'type', prompt: 'fazer → quando eles ___ (future subjunctive)', answer: 'fizerem', side: 'target' },
    ]),
  lesson(L, 'condicional-imperativo', 3, 32, 'grammar', 'Conditional and imperative',
    `**Futuro do pretérito** (conditional): infinitive + **-ia, -ia, -íamos, -iam**: *falaria, comeria*; far- → *faria*, dir- → *diria*.
    *Eu gostaria de um café. Você poderia me ajudar?* (In speech, the imperfeito often replaces it: *Eu queria um café.*)
    **Imperative** in Brazil usually uses present-tense forms for você: *Fala!* (casual) or the subjunctive form, which is more standard: *Fale! Venha! Não fale!*`,
    [
      { type: 'type', prompt: 'eu ___ (gostar, conditional) de um café', answer: 'gostaria', side: 'target' },
      { type: 'mc', prompt: '"Could you help me?"', options: ['Você poderia me ajudar?', 'Você pode-ria me ajudar?', 'Você podia-me ajudar?'], answer: 'Você poderia me ajudar?' },
      { type: 'mc', prompt: '"Come here!" (standard você form)', options: ['Venha aqui!', 'Vem aqui!', 'Vir aqui!'], answer: 'Venha aqui!' },
    ]),
  lesson(L, 'perfect-tenses', 3, 33, 'grammar', 'Compound tenses',
    `**Pretérito perfeito composto** (*tenho falado*) means a repeated or ongoing action up to now, NOT "I have spoken" once: *Tenho estudado muito* "I've been studying a lot."
    For a single past event Portuguese uses the simple past: "I have eaten" → *Já comi.*
    **Mais-que-perfeito composto** ("had done"): **tinha** + participle: *Quando cheguei, ele já tinha saído.*
    Irregular participles: feito, dito, visto, escrito, posto, aberto, vindo.`,
    [
      { type: 'mc', prompt: '"I have already eaten"', options: ['Já comi', 'Tenho comido já', 'Já tenho comido'], answer: 'Já comi' },
      { type: 'mc', prompt: '"Tenho trabalhado muito" means…', options: ["I've been working a lot", 'I worked a lot once'], answer: "I've been working a lot" },
      { type: 'mc', prompt: '"He had left"', options: ['Ele tinha saído', 'Ele saiu', 'Ele tem saído'], answer: 'Ele tinha saído' },
    ]),
  lesson(L, 'por-para-relatives', 3, 34, 'grammar', 'por vs para; relative pronouns',
    `**para**: purpose, destination, recipient, deadline: *para aprender, para São Paulo, para você*.
    **por**: cause, through, exchange, duration, passive agent: *por causa da chuva, pelo parque, por dez reais, escrito por Machado de Assis*. *Obrigado por tudo.*
    Relatives: **que** (that/who/which) · **quem** after prepositions for people (*a pessoa com quem falei*) · **o que** "what" (*O que você disse é verdade*) · **onde** · **cujo/a** whose.`,
    [
      { type: 'mc', prompt: 'Este presente é ___ você.', options: ['para', 'por'], answer: 'para' },
      { type: 'mc', prompt: 'Obrigado ___ tudo.', options: ['por', 'para'], answer: 'por' },
      { type: 'mc', prompt: 'A mulher com ___ falei é médica.', options: ['quem', 'que', 'o que'], answer: 'quem' },
    ]),

  // ============================ LEVEL 4 (B2) ============================
  lesson(L, 'imperfeito-subjuntivo', 4, 40, 'grammar', 'Imperfect subjunctive and "if" clauses',
    `Form: 3rd-person plural perfeito minus -ram + **-sse, -sse, -ssemos, -ssem**: fizeram → **fizesse**; foram → **fosse**; tiveram → **tivesse**.
    Hypothetical: **se** + imperfeito do subjuntivo → conditional: *Se eu tivesse dinheiro, viajaria.*
    Past unreal: *Se eu tivesse sabido, teria vindo.* "If I had known, I would have come."
    Also after past wishes: *Eu queria que você viesse.*`,
    [
      { type: 'mc', prompt: 'Se eu ___ rico, compraria uma casa.', options: ['fosse', 'for', 'seja'], answer: 'fosse' },
      { type: 'type', prompt: 'ter → se nós ___ (imperfect subjunctive)', answer: 'tivéssemos', side: 'target' },
      { type: 'mc', prompt: '"If I had known, I would have come"', options: ['Se eu tivesse sabido, teria vindo', 'Se eu soubesse, vinha', 'Se eu souber, venho'], answer: 'Se eu tivesse sabido, teria vindo' },
    ]),
  lesson(L, 'infinitivo-pessoal', 4, 41, 'grammar', 'The personal infinitive',
    `Portuguese infinitives can take person endings: **falar, falares, falar, falarmos, falarem**.
    Used when the infinitive has its own subject, especially after prepositions: *É melhor **eles saírem** cedo.* "It's better for them to leave early." *Depois de **chegarmos**, jantamos.* "After we arrived, we had dinner." *Para **vocês entenderem**…*
    It avoids a subjunctive clause and is very common in writing.`,
    [
      { type: 'mc', prompt: '"It\'s better for us to leave"', options: ['É melhor sairmos', 'É melhor sair nós', 'É melhor que saímos'], answer: 'É melhor sairmos' },
      { type: 'mc', prompt: 'Depois de ___ (eles, chegar), começamos.', options: ['chegarem', 'chegar', 'chegaram'], answer: 'chegarem' },
      { type: 'type', prompt: 'personal infinitive: para nós ___ (entender)', answer: 'entendermos', side: 'target' },
    ]),
  lesson(L, 'passive-se', 4, 42, 'grammar', 'Passive voice and "se"',
    `**ser** + participle (agrees) + **por**: *O livro foi escrito por ela.*
    **Passive se** in signs and writing: *Vendem-se casas* "Houses for sale" (verb agrees). In Brazil you'll also see *Vende-se casas*, which is considered non-standard.
    **Indeterminate subject**: *Precisa-se de funcionários* "Staff needed". Speech often uses **a gente** or 3rd plural instead: *Falam que…* "They say…"`,
    [
      { type: 'mc', prompt: '"The bridge was built in 1950"', options: ['A ponte foi construída em 1950', 'A ponte foi construído em 1950', 'A ponte construiu em 1950'], answer: 'A ponte foi construída em 1950' },
      { type: 'mc', prompt: 'Standard sign: "Apartments for rent"', options: ['Alugam-se apartamentos', 'Aluga-se apartamentos'], answer: 'Alugam-se apartamentos', register: 'formal' },
      { type: 'mc', prompt: '"a gente vai" means…', options: ['we are going', 'the people go'], answer: 'we are going' },
    ]),
  lesson(L, 'reported-speech', 4, 43, 'grammar', 'Reported speech',
    `After a past reporting verb:
    presente → imperfeito: "Estou cansado" → *Ele disse que estava cansado.*
    perfeito → mais-que-perfeito: "Fiz" → *Disse que tinha feito.*
    futuro → condicional: "Virei" → *Disse que viria.*
    imperativo → imperfeito do subjuntivo: "Venha" → *Pediu que eu viesse* (or *Pediu para eu vir*).
    Questions: *Perguntou se eu queria ir.*`,
    [
      { type: 'mc', prompt: '"Vou amanhã" → Ele disse que ___ no dia seguinte.', options: ['ia', 'vai', 'for'], answer: 'ia' },
      { type: 'mc', prompt: '"Feche a porta" → Ela pediu que eu ___ a porta.', options: ['fechasse', 'fecho', 'feche'], answer: 'fechasse' },
      { type: 'mc', prompt: '"Você quer café?" → Perguntou ___ eu queria café.', options: ['se', 'que', 'o que'], answer: 'se' },
    ]),
  lesson(L, 'connectors', 4, 44, 'grammar', 'Connectors',
    `Addition: além disso, também, ainda · Contrast: mas, porém, no entanto, contudo, entretanto · Concession: embora (+ subjuntivo), apesar de · Cause: porque, pois, já que, visto que · Result: portanto, por isso, logo, então · Conclusion: enfim, em suma.
    *Estava chovendo; no entanto, saímos.* *Embora esteja cansado, vou trabalhar.*`,
    [
      { type: 'mc', prompt: '"however" (formal)', options: ['no entanto', 'por isso', 'além disso'], answer: 'no entanto' },
      { type: 'mc', prompt: 'Embora ele ___ cansado, trabalha.', options: ['esteja', 'está', 'estava'], answer: 'esteja' },
      { type: 'mc', prompt: '"therefore"', options: ['portanto', 'porém', 'embora'], answer: 'portanto' },
    ]),

  // ============================ LEVEL 5 (C1) ============================
  lesson(L, 'pronoun-placement', 5, 50, 'grammar', 'Formal pronoun placement (for reading)',
    `Formal writing and European Portuguese place pronouns after the verb (**ênclise**): *Diga-me. Encontrei-o.*
    Words like **não, que, quem, já, sempre** attract the pronoun before the verb (**próclise**): *Não me diga. O homem que o viu.*
    In the future/conditional, very formal texts use **mesóclise** (the pronoun inside the verb): *Dir-lhe-ei* "I will tell him", *Far-se-ia* "it would be done". Recognise it in old texts and legal writing.`,
    [
      { type: 'mc', prompt: '"Dir-lhe-ei" means…', options: ['I will tell him/her', 'Tell him!', 'He told me'], answer: 'I will tell him/her' },
      { type: 'mc', prompt: 'With "não", formal placement is…', options: ['Não me diga', 'Não diga-me'], answer: 'Não me diga' },
      { type: 'mc', prompt: 'The European/formal way to write "Tell me!"', options: ['Diga-me!', 'Me diga!'], answer: 'Diga-me!' },
    ]),
  lesson(L, 'formal-writing', 5, 51, 'register', 'Formal letters and register',
    `Formal letters use **o senhor / a senhora** or the impersonal style, never *você* to a stranger in writing.
    Openings: *Prezado(a) Senhor(a),* · *Prezados Senhores,* · Official: *Excelentíssimo(a) Senhor(a)* (abbr. Exmo./Exma.).
    Closings: *Atenciosamente,* · *Cordialmente,*
    Phrases: *Venho por meio desta solicitar…* "I am writing to request…" · *Agradeço desde já* "Thanking you in advance" · *Segue em anexo* "Please find attached".`,
    [
      { type: 'register-scene', prompt: 'Opening of a formal email to a company', options: ['Prezados Senhores,', 'Oi, galera!', 'Querido amigo,'], answer: 'Prezados Senhores,', register: 'formal' },
      { type: 'mc', prompt: 'Standard formal closing', options: ['Atenciosamente,', 'Beijos,', 'Valeu!'], answer: 'Atenciosamente,' },
      { type: 'mc', prompt: '"Please find attached"', options: ['Segue em anexo', 'Olha aí o anexo', 'Toma o anexo'], answer: 'Segue em anexo', register: 'formal' },
    ]),
  lesson(L, 'brazil-portugal', 5, 52, 'grammar', 'Brazilian vs European Portuguese (for reading)',
    `You'll read texts from both. Key differences:
    -ing: BR *estou fazendo* / PT *estou a fazer* · "you": BR *você* / PT *tu* (informal) and *você* (can sound distant)
    Vocabulary: ônibus/autocarro (bus), trem/comboio (train), celular/telemóvel (mobile), café da manhã/pequeno-almoço (breakfast), banheiro/casa de banho (bathroom)
    Spelling: BR *fato* "fact" / PT *facto*; BR *ônibus* (circumflex) vs PT *ó* forms (*António* vs BR *Antônio*).`,
    [
      { type: 'mc', prompt: '"autocarro" (Portugal) is in Brazil…', options: ['ônibus', 'trem', 'carro'], answer: 'ônibus' },
      { type: 'mc', prompt: '"estou a ler" (Portugal) means…', options: ["I'm reading", "I'm going to read"], answer: "I'm reading" },
      { type: 'mc', prompt: '"telemóvel" (Portugal) =', options: ['celular', 'televisão', 'carro'], answer: 'celular' },
    ]),
  lesson(L, 'false-friends', 5, 53, 'grammar', 'False friends and translation traps',
    `**pretender** intend (pretend → *fingir*) · **puxar** pull (push → *empurrar*) · **atualmente** currently · **livraria** bookshop (library → *biblioteca*) · **esquisito** strange/weird (not exquisite) · **parentes** relatives (parents → *pais*) · **assistir** watch/attend · **costume** custom/habit (costume → *fantasia*).
    Translation traps: Portuguese drops subjects (add "he/she/it"), and *a gente* means "we".`,
    [
      { type: 'mc', prompt: '"puxe" on a door means…', options: ['pull', 'push'], answer: 'pull' },
      { type: 'mc', prompt: '"Meus parentes" means…', options: ['my relatives', 'my parents'], answer: 'my relatives' },
      { type: 'mc', prompt: '"Pretendo viajar" means…', options: ['I intend to travel', 'I pretend to travel'], answer: 'I intend to travel' },
      { type: 'mc', prompt: '"esquisito" means…', options: ['strange', 'exquisite'], answer: 'strange' },
    ]),
];
