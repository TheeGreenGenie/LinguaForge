// Mandarin Chinese (Simplified characters, Hànyǔ Pīnyīn).
import { lesson, sentence, word } from './helpers';

const L = 'zh' as const;
const SRC = ['CC-CEDICT (CC BY-SA)', 'Hànyǔ Pīnyīn standard (ISO 7098)'];

export const zhLessons = [
  lesson(L, 'tones', 0, 1, 'tone', 'The four tones + neutral',
    `Mandarin syllables carry one of **four tones** or a light **neutral** tone. The tone changes the word.

    **1st** ā: high and flat (like holding a note)
    **2nd** á: rising (like asking "huh?")
    **3rd** ǎ: low, dipping (in a sentence it's mostly just *low*)
    **4th** à: sharply falling (like a firm "No!")
    **neutral** a: short and light, no mark

    **mā** 妈 mother · **má** 麻 hemp · **mǎ** 马 horse · **mà** 骂 scold · **ma** 吗 (question particle)

    Typing: you may type tone numbers. **ma3** becomes **mǎ**, and **lv4** becomes **lǜ**. A wrong tone counts as a wrong answer.`,
    [
      { type: 'tone-id', prompt: 'mǎ', options: ['3rd (dipping)', '1st (high, flat)', '2nd (rising)', '4th (falling)'], answer: '3rd (dipping)' },
      { type: 'tone-id', prompt: 'mā', options: ['1st (high, flat)', '2nd (rising)', '3rd (dipping)', '4th (falling)'], answer: '1st (high, flat)' },
      { type: 'tone-id', prompt: 'mà', options: ['4th (falling)', '3rd (dipping)', '2nd (rising)', 'neutral'], answer: '4th (falling)' },
      { type: 'tone-id', prompt: 'má', options: ['2nd (rising)', '4th (falling)', '1st (high, flat)', 'neutral'], answer: '2nd (rising)' },
      { type: 'minimal-pair', prompt: 'Which means "horse" (马)?', options: ['mǎ', 'mā', 'mà', 'má'], answer: 'mǎ' },
      { type: 'minimal-pair', prompt: 'Which means "mother" (妈)?', options: ['mā', 'mǎ', 'má', 'mà'], answer: 'mā' },
      { type: 'type', prompt: 'Type the pinyin for 你好 (hello), with tones', answer: 'nǐ hǎo', accept: ['ni3 hao3', 'nǐhǎo', 'ni3hao3'], side: 'target' },
    ], SRC),

  lesson(L, 'sandhi', 0, 2, 'tone', 'Tone changes (sandhi)',
    `Some tones change next to others. The dictionary spelling stays the same, but you **say** it differently:

    **3 + 3 becomes 2 + 3**: 你好 nǐ hǎo is said *ní hǎo*.
    **不 bù** becomes **bú** before a 4th tone: 不是 *bú shì* "is not".
    **一 yī** becomes **yí** before a 4th tone (一个 *yí gè*) and **yì** before tones 1-3 (一天 *yì tiān*).

    For reading and writing, you write the dictionary tones (nǐ hǎo). Knowing sandhi stops you from being confused when you hear them.`,
    [
      { type: 'mc', prompt: 'How is 你好 (nǐ hǎo) actually pronounced?', options: ['ní hǎo', 'nǐ hǎo', 'nǐ háo', 'nì hào'], answer: 'ní hǎo' },
      { type: 'mc', prompt: '不 before a 4th tone (不是) is said…', options: ['bú', 'bù', 'bū', 'bǔ'], answer: 'bú' },
      { type: 'mc', prompt: '一 in 一天 (yī + tiān, 1st tone) is said…', options: ['yì', 'yí', 'yī', 'yǐ'], answer: 'yì' },
    ], SRC),

  lesson(L, 'pinyin', 0, 3, 'script', 'Pinyin sounds that surprise English speakers',
    `Pinyin uses Latin letters, but some don't sound like English:

    **q**: like "ch" in *cheap* · **x**: like "sh" in *she* · **j**: like "j" in *jeep*
    **zh**: "j" with the tongue curled back · **c**: "ts" as in *cats* · **z**: "dz" as in *adds*
    **r**: between English r and the "s" in *pleasure*
    **ü** (written u after j q x y): say "ee" with rounded lips
    **-i** after z c s zh ch sh r is a buzzy vowel, not "ee": **sì** 四 (four), **shí** 十 (ten)`,
    [
      { type: 'letter-sound', prompt: 'Pinyin "x" sounds like…', options: ['sh in she', 'ks in box', 'z in zoo', 'ch in cheap'], answer: 'sh in she' },
      { type: 'letter-sound', prompt: 'Pinyin "q" sounds like…', options: ['ch in cheap', 'k in key', 'kw in queen', 'sh in she'], answer: 'ch in cheap' },
      { type: 'letter-sound', prompt: 'Pinyin "c" sounds like…', options: ['ts in cats', 'k in cat', 's in sun', 'ch in chair'], answer: 'ts in cats' },
      { type: 'mc', prompt: 'In "xué" (学, learn), the u is pronounced as…', options: ['ü (rounded ee)', 'oo', 'uh', 'w'], answer: 'ü (rounded ee)' },
    ], SRC),

  lesson(L, 'radicals', 0, 4, 'script', 'Characters and radicals',
    `Chinese characters are built from components. A **radical** often hints at meaning, and another part often hints at sound.

    **亻** (person) in 你 you, 他 he, 们 (plural) · **氵** (water) in 河 river, 海 sea, 汉 Han
    **口** (mouth) in 吃 eat, 喝 drink, 吗 question particle · **女** (woman) in 妈 mother, 好 good, 她 she
    **木** (tree) in 林 woods, 李 plum · **讠** (speech) in 说 speak, 话 speech, 语 language

    Writing on a phone means typing pinyin and choosing the character. The app also has stroke-order practice for characters you learn.`,
    [
      { type: 'mc', prompt: 'Which radical means "water"?', options: ['氵', '亻', '口', '木'], answer: '氵' },
      { type: 'mc', prompt: 'Which radical appears in 说 (speak) and 语 (language)?', options: ['讠 speech', '口 mouth', '女 woman', '亻 person'], answer: '讠 speech' },
      { type: 'mc', prompt: '妈 (mother) contains which meaning radical?', options: ['女 woman', '马 horse', '口 mouth', '木 tree'], answer: '女 woman', explanation: '马 (mǎ) is the sound part, which is why 妈 is mā.' },
    ], SRC),

  lesson(L, 'politeness', 1, 10, 'register', 'Politeness: 你 vs 您',
    `**你 nǐ** is the everyday "you". **您 nín** (你 + 心 heart) is the respectful "you" for elders, teachers, customers and formal situations.

    **您好** nín hǎo: respectful hello · **你好** nǐ hǎo: everyday hello
    **请** qǐng: please (polite request) · **谢谢** xièxie: thank you · **不客气** bú kèqi: you're welcome

    您 has no plural; for a group use **大家** dàjiā "everyone" or **你们** nǐmen.`,
    [
      { type: 'register-scene', prompt: "You greet your friend's grandfather.", options: ['您好', '你好'], answer: '您好', register: 'honorific', seniority: 'elder' },
      { type: 'register-scene', prompt: 'You greet a classmate.', options: ['你好', '您好'], answer: '你好', register: 'casual', seniority: 'peer', explanation: '您好 to a classmate would sound stiff.' },
      { type: 'register-scene', prompt: 'A hotel clerk speaks to a guest. Which "you"?', options: ['您', '你'], answer: '您', register: 'formal' },
      { type: 'type', prompt: 'Type "thank you" (characters or pinyin)', answer: '谢谢', accept: ['xièxie'], side: 'target' },
    ], SRC),

  lesson(L, 'word-order', 1, 11, 'grammar', 'Word order, 是, 不/没, and 吗',
    `Chinese verbs never change form. Order and small words do the work.

    Basic order: **Subject + Time + Place + Verb + Object**: 我**明天**在家看书 "I'll read at home tomorrow".
    **是 shì** "to be" links nouns: 我是学生 "I am a student". Adjectives don't use 是: 她**很**好 "She is (very) good".
    **不 bù** negates the present/future and habits: 我不喝茶. **没 méi** negates the past and 有: 我没去, 我没有书.
    **吗 ma** at the end turns a statement into a yes/no question: 你喝茶**吗**？
    Numbers need a **measure word**: 一**个**人 "one person", 三**本**书 "three books".`,
    [
      { type: 'mc', prompt: 'Make "You drink tea" a question:', options: ['你喝茶吗？', '吗你喝茶？', '你吗喝茶？'], answer: '你喝茶吗？' },
      { type: 'mc', prompt: '"I didn\'t go" uses…', options: ['没', '不'], answer: '没', explanation: '没 negates past actions; 不 negates present/future and habits.' },
      { type: 'mc', prompt: '"She is good" is…', options: ['她很好', '她是好'], answer: '她很好', explanation: 'Adjectives take 很, not 是.' },
      { type: 'mc', prompt: '"three books" is…', options: ['三本书', '三书', '三个本书'], answer: '三本书' },
    ], SRC),
];

export const zhWords = [
  word(L, '你', 'you', 'pron', { pinyin: 'nǐ' }),
  word(L, '您', 'you (respectful)', 'pron', { pinyin: 'nín', register: 'honorific' }),
  word(L, '我', ['I', 'me'], 'pron', { pinyin: 'wǒ' }),
  word(L, '他', ['he', 'him'], 'pron', { pinyin: 'tā' }),
  word(L, '她', ['she', 'her'], 'pron', { pinyin: 'tā' }),
  word(L, '我们', ['we', 'us'], 'pron', { pinyin: 'wǒmen' }),
  word(L, '好', ['good', 'well'], 'adj', { pinyin: 'hǎo' }),
  word(L, '你好', 'hello', 'intj', { pinyin: 'nǐ hǎo' }),
  word(L, '您好', 'hello (respectful)', 'intj', { pinyin: 'nín hǎo', register: 'honorific' }),
  word(L, '谢谢', 'thank you', 'intj', { pinyin: 'xièxie' }),
  word(L, '请', 'please', 'verb', { pinyin: 'qǐng' }),
  word(L, '是', ['to be', 'is'], 'verb', { pinyin: 'shì' }),
  word(L, '不', 'not', 'adv', { pinyin: 'bù' }),
  word(L, '吗', 'question particle', 'particle', { pinyin: 'ma' }),
  word(L, '妈', 'mother', 'noun', { pinyin: 'mā', level: 0 }),
  word(L, '马', 'horse', 'noun', { pinyin: 'mǎ', level: 0 }),
  word(L, '骂', 'scold', 'verb', { pinyin: 'mà', level: 0 }),
  word(L, '人', 'person', 'noun', { pinyin: 'rén' }),
  word(L, '中国', 'China', 'noun', { pinyin: 'Zhōngguó' }),
  word(L, '中文', 'Chinese language', 'noun', { pinyin: 'Zhōngwén' }),
  word(L, '学习', ['study', 'learn'], 'verb', { pinyin: 'xuéxí' }),
  word(L, '喜欢', 'like', 'verb', { pinyin: 'xǐhuan' }),
  word(L, '吃', 'eat', 'verb', { pinyin: 'chī' }),
  word(L, '喝', 'drink', 'verb', { pinyin: 'hē' }),
  word(L, '水', 'water', 'noun', { pinyin: 'shuǐ' }),
  word(L, '茶', 'tea', 'noun', { pinyin: 'chá' }),
  word(L, '饭', ['rice', 'meal'], 'noun', { pinyin: 'fàn' }),
  word(L, '书', 'book', 'noun', { pinyin: 'shū' }),
  word(L, '看', ['look', 'read', 'watch'], 'verb', { pinyin: 'kàn' }),
  word(L, '写', 'write', 'verb', { pinyin: 'xiě' }),
  word(L, '说', ['speak', 'say'], 'verb', { pinyin: 'shuō' }),
  word(L, '去', 'go', 'verb', { pinyin: 'qù' }),
  word(L, '来', 'come', 'verb', { pinyin: 'lái' }),
  word(L, '有', 'have', 'verb', { pinyin: 'yǒu' }),
  word(L, '一', 'one', 'num', { pinyin: 'yī' }),
  word(L, '二', 'two', 'num', { pinyin: 'èr' }),
  word(L, '三', 'three', 'num', { pinyin: 'sān' }),
  word(L, '四', 'four', 'num', { pinyin: 'sì' }),
  word(L, '十', 'ten', 'num', { pinyin: 'shí' }),
  word(L, '今天', 'today', 'noun', { pinyin: 'jīntiān' }),
  word(L, '明天', 'tomorrow', 'noun', { pinyin: 'míngtiān' }),
  word(L, '老师', 'teacher', 'noun', { pinyin: 'lǎoshī' }),
  word(L, '朋友', 'friend', 'noun', { pinyin: 'péngyou' }),
  word(L, '家', ['home', 'family'], 'noun', { pinyin: 'jiā' }),
];

export const zhSentences = [
  sentence(L, '您好！', 'Hello! (respectful)', { pinyin: 'Nín hǎo!', register: 'honorific', seniority: 'elder', altEn: ['Hello!'] }),
  sentence(L, '你好！', 'Hello!', { pinyin: 'Nǐ hǎo!', register: 'casual' }),
  sentence(L, '谢谢你。', 'Thank you.', { pinyin: 'Xièxie nǐ.', altEn: ['Thanks.', 'Thank you'] }),
  sentence(L, '我是学生。', 'I am a student.', { pinyin: 'Wǒ shì xuésheng.' }),
  sentence(L, '我喜欢学习中文。', 'I like studying Chinese.', { pinyin: 'Wǒ xǐhuan xuéxí Zhōngwén.', altEn: ['I like learning Chinese.'] }),
  sentence(L, '你喝茶吗？', 'Do you drink tea?', { pinyin: 'Nǐ hē chá ma?', altEn: ['Would you like tea?'] }),
  sentence(L, '我不吃肉。', "I don't eat meat.", { pinyin: 'Wǒ bù chī ròu.', altEn: ['I do not eat meat.'] }),
  sentence(L, '老师，您好！', 'Hello, teacher!', { pinyin: 'Lǎoshī, nín hǎo!', register: 'honorific', seniority: 'elder' }),
  sentence(L, '他是我的朋友。', 'He is my friend.', { pinyin: 'Tā shì wǒ de péngyou.' }),
  sentence(L, '明天我去中国。', 'Tomorrow I am going to China.', { pinyin: 'Míngtiān wǒ qù Zhōngguó.', altEn: ['I am going to China tomorrow.', 'Tomorrow I will go to China.'] }),
];
