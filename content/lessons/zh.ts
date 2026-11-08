// Mandarin grammar curriculum, Levels 1–5 (≈ HSK 1–6 / A1–C1). Simplified characters.
// Authored; verified:false until reviewed.
import { lesson } from '../helpers';

const L = 'zh' as const;

export const zhCurriculum = [
  // ============================ LEVEL 1 (A1) ============================
  lesson(L, 'de-possession', 1, 12, 'grammar', '的: possession and description',
    `**的 de** links a modifier to a noun, like English "'s" or "of": *我的书* "my book", *老师的车* "the teacher's car".
    It also links descriptions: *红色的花* "a red flower", *我买的书* "the book I bought".
    With close relationships and familiar things, 的 is often dropped: *我妈妈* "my mum", *我们学校* "our school".`,
    [
      { type: 'mc', prompt: '"my book"', options: ['我的书', '书的我', '我书的'], answer: '我的书' },
      { type: 'mc', prompt: '"the book I bought"', options: ['我买的书', '书我买的', '我的买书'], answer: '我买的书' },
      { type: 'mc', prompt: 'Which is natural for "my mum"?', options: ['我妈妈', '妈妈的我'], answer: '我妈妈' },
    ]),
  lesson(L, 'numbers-measure', 1, 13, 'grammar', 'Numbers and measure words',
    `一 二 三 四 五 六 七 八 九 十 · 十一 (11) · 二十 (20) · 二十五 (25) · 一百 (100).
    "Two" before a measure word is **两 liǎng**: *两个人* (not 二个人).
    A number + **measure word** + noun: **个 gè** (general), **本 běn** (books), **张 zhāng** (flat things: paper, tables), **杯 bēi** (cups of), **只 zhī** (many animals), **辆 liàng** (vehicles), **件 jiàn** (clothes, matters).
    这/那 + measure word: *这本书* "this book", *那个人* "that person".`,
    [
      { type: 'mc', prompt: '"two people"', options: ['两个人', '二个人', '两人个'], answer: '两个人' },
      { type: 'mc', prompt: '"three books"', options: ['三本书', '三个书', '三张书'], answer: '三本书' },
      { type: 'mc', prompt: '"a cup of tea"', options: ['一杯茶', '一个茶', '一本茶'], answer: '一杯茶' },
      { type: 'mc', prompt: '"25" is…', options: ['二十五', '五二十', '二五十'], answer: '二十五' },
    ]),
  lesson(L, 'you-zai', 1, 14, 'grammar', '有 and 在',
    `**有 yǒu** = have / there is: *我有一个哥哥.* *桌子上有一本书* "There's a book on the table." Negative is always **没有**: *我没有钱.*
    **在 zài** = be at / in: *我在家* "I'm at home". Location phrase before the verb: *我在学校学习* "I study at school."
    Place words: 上 (on), 下 (under), 里 (in), 旁边 (next to): *书在桌子上.*`,
    [
      { type: 'mc', prompt: '"I don\'t have money"', options: ['我没有钱', '我不有钱', '我没钱有'], answer: '我没有钱' },
      { type: 'mc', prompt: '"I study at school"', options: ['我在学校学习', '我学习在学校', '我学校在学习'], answer: '我在学校学习' },
      { type: 'mc', prompt: '"The book is on the table"', options: ['书在桌子上', '书有桌子上', '桌子上在书'], answer: '书在桌子上' },
    ]),
  lesson(L, 'question-words', 1, 15, 'grammar', 'Question words',
    `Question words sit **where the answer goes**, with no word-order change:
    **什么 shénme** what · **谁 shéi** who · **哪儿 nǎr / 哪里** where · **什么时候** when · **怎么** how · **为什么** why · **几 jǐ** how many (small) · **多少** how many/much.
    *你叫什么名字？* "What's your name?" *你去哪儿？* "Where are you going?" *你有几个孩子？*
    Don't add 吗 to a question that already has a question word.`,
    [
      { type: 'mc', prompt: '"Where are you going?"', options: ['你去哪儿？', '哪儿你去？', '你去哪儿吗？'], answer: '你去哪儿？' },
      { type: 'mc', prompt: '"Who is he?"', options: ['他是谁？', '谁是他吗？', '他谁是？'], answer: '他是谁？' },
      { type: 'mc', prompt: '"why"', options: ['为什么', '怎么样', '什么时候'], answer: '为什么' },
    ]),
  lesson(L, 'le-basic', 1, 16, 'grammar', '了: something happened or changed',
    `**了 le** after a verb marks a **completed** action: *我买了一本书* "I bought a book".
    **了** at the end of a sentence marks a **change of state**: *下雨了* "It's (started) raining", *我饿了* "I'm hungry (now)".
    Negative of a completed action uses **没(有)** and drops 了: *我没买书* "I didn't buy a book."`,
    [
      { type: 'mc', prompt: '"I bought a book"', options: ['我买了一本书', '我了买一本书', '我买一本书了吗'], answer: '我买了一本书' },
      { type: 'mc', prompt: '"I didn\'t go"', options: ['我没去', '我没去了', '我不去了'], answer: '我没去' },
      { type: 'mc', prompt: '"下雨了" means…', options: ["It's started raining", 'It will rain', 'It rained yesterday'], answer: "It's started raining" },
    ]),
  lesson(L, 'adjectives-hen', 1, 17, 'grammar', 'Adjectives as predicates',
    `Adjectives work like verbs and don't use 是: *她很漂亮* "She is pretty". **很 hěn** is usually added (it's often not "very").
    Negative: **不** + adjective: *不贵* "not expensive".
    Questions: *贵不贵？* (A-not-A) or *贵吗？*
    Before a noun: one-syllable adjectives attach directly (*大房子*); longer ones use 的 (*漂亮的房子*).`,
    [
      { type: 'mc', prompt: '"The tea is good"', options: ['茶很好', '茶是好', '茶好是'], answer: '茶很好' },
      { type: 'mc', prompt: '"Is it expensive?" (A-not-A)', options: ['贵不贵？', '是贵吗？', '贵没贵？'], answer: '贵不贵？' },
      { type: 'mc', prompt: '"a beautiful house"', options: ['漂亮的房子', '房子漂亮的', '很漂亮房子'], answer: '漂亮的房子' },
    ]),

  // ============================ LEVEL 2 (A2) ============================
  lesson(L, 'guo-experience', 2, 20, 'grammar', '过: past experience',
    `**过 guo** after a verb = "have ever done": *我去过中国* "I've been to China." *你吃过北京烤鸭吗？* "Have you ever eaten Peking duck?"
    Negative: **没(有)…过**: *我没去过.*
    Compare: *我去了中国* (I went, specific event) vs *我去过中国* (I have the experience).`,
    [
      { type: 'mc', prompt: '"I have been to China"', options: ['我去过中国', '我过去中国', '我去中国过'], answer: '我去过中国' },
      { type: 'mc', prompt: '"I have never eaten it"', options: ['我没吃过', '我不吃过', '我吃过没'], answer: '我没吃过' },
      { type: 'mc', prompt: '"你看过这本书吗？" means…', options: ['Have you ever read this book?', 'Are you reading this book?', 'Will you read this book?'], answer: 'Have you ever read this book?' },
    ]),
  lesson(L, 'progressive', 2, 21, 'grammar', '在 / 正在: actions in progress',
    `**(正)在 + verb** = "is …-ing": *我在吃饭* "I'm eating." *他正在开会* "He's in a meeting right now."
    Often with **呢** at the end: *他在睡觉呢.*
    Negative: *我没在看电视* "I'm not watching TV."`,
    [
      { type: 'mc', prompt: '"I am eating"', options: ['我在吃饭', '我吃饭在', '我了吃饭'], answer: '我在吃饭' },
      { type: 'mc', prompt: '"他正在开会" means…', options: ["He's in a meeting right now", 'He had a meeting', 'He will have a meeting'], answer: "He's in a meeting right now" },
    ]),
  lesson(L, 'comparisons', 2, 22, 'grammar', 'Comparisons with 比',
    `**A 比 B + adjective**: *他比我高* "He's taller than me." Don't add 很: ✗ *他比我很高*.
    Degree after: *他比我高一点儿* "a bit taller", *高得多* "much taller", *高三厘米*.
    Equal: **A 跟 B 一样 + adj**: *我跟你一样高.*
    Not as: **A 没有 B + adj**: *我没有他高* "I'm not as tall as him."`,
    [
      { type: 'mc', prompt: '"He is taller than me"', options: ['他比我高', '他比我很高', '他高比我'], answer: '他比我高' },
      { type: 'mc', prompt: '"I\'m not as tall as him"', options: ['我没有他高', '我不比他高', '我比他不高'], answer: '我没有他高' },
      { type: 'mc', prompt: '"as tall as you"', options: ['跟你一样高', '比你一样高', '像你高一样'], answer: '跟你一样高' },
    ]),
  lesson(L, 'modal-verbs', 2, 23, 'grammar', '会, 能, 可以, 要, 想',
    `**会 huì**: know how (learned skill): *我会游泳.* Also "will (probably)": *明天会下雨.*
    **能 néng**: able to (ability/circumstance): *我今天不能来.*
    **可以 kěyǐ**: may / allowed: *这儿可以抽烟吗？*
    **想 xiǎng**: would like to · **要 yào**: want to / will / must.`,
    [
      { type: 'mc', prompt: '"I can swim" (learned skill)', options: ['我会游泳', '我能游泳了', '我可以游泳吗'], answer: '我会游泳' },
      { type: 'mc', prompt: '"May I sit here?"', options: ['我可以坐这儿吗？', '我会坐这儿吗？', '我想坐这儿吗？'], answer: '我可以坐这儿吗？' },
      { type: 'mc', prompt: '"It will probably rain tomorrow"', options: ['明天会下雨', '明天能下雨', '明天可以下雨'], answer: '明天会下雨' },
    ]),
  lesson(L, 'time-duration', 2, 24, 'grammar', 'Time words and duration',
    `**Time when** goes before the verb (often at the front): *我昨天去了* / *昨天我去了.*
    **Duration** goes after the verb: *我学了两年中文* "I studied Chinese for two years." Ongoing to now: add 了 at the end: *我学中文学了两年了* "I've been learning for two years."
    Times: 点 (o'clock), 分 (minute), 半 (half), 刻 (quarter): *三点半* "3:30".
    Dates go large → small: *2024年5月3号*.`,
    [
      { type: 'mc', prompt: '"I studied for two hours"', options: ['我学了两个小时', '我两个小时学了', '我学两个小时了吗'], answer: '我学了两个小时' },
      { type: 'mc', prompt: '"3:30"', options: ['三点半', '半三点', '三半点'], answer: '三点半' },
      { type: 'mc', prompt: '"May 3rd, 2024" in order', options: ['2024年5月3号', '3号5月2024年', '5月3号2024年'], answer: '2024年5月3号' },
    ]),
  lesson(L, 'directional', 2, 25, 'grammar', 'Direction complements: 来 and 去',
    `**来** = toward the speaker, **去** = away from the speaker. They follow motion verbs:
    *进来* come in · *出去* go out · *上来* come up · *下去* go down · *回来* come back.
    With objects of place, the place goes before 来/去: *他回家去了* "He went home." *请进来！* "Please come in!"`,
    [
      { type: 'mc', prompt: '"Please come in!" (toward speaker)', options: ['请进来！', '请进去！', '请来进！'], answer: '请进来！' },
      { type: 'mc', prompt: '"He went out" (away)', options: ['他出去了', '他出来了', '他去出了'], answer: '他出去了' },
    ]),

  // ============================ LEVEL 3 (B1) ============================
  lesson(L, 'ba', 3, 30, 'grammar', 'The 把 construction',
    `**Subject + 把 + object + verb + result**: focuses on what is done *to* the object.
    *我把作业做完了* "I finished the homework." *请把门关上* "Please close the door."
    The verb needs something after it (了, a complement, a place): ✗ *我把书看* → ✓ *我把书看完了*.
    Negative goes before 把: *我没把书带来.*`,
    [
      { type: 'mc', prompt: '"Please close the door"', options: ['请把门关上', '请关上把门', '请门把关上'], answer: '请把门关上' },
      { type: 'mc', prompt: 'Which 把 sentence is correct?', options: ['我把书看完了', '我把书看', '我看把书完了'], answer: '我把书看完了' },
      { type: 'mc', prompt: '"I didn\'t bring the book"', options: ['我没把书带来', '我把书没带来', '我把没书带来'], answer: '我没把书带来' },
    ]),
  lesson(L, 'bei', 3, 31, 'grammar', 'The passive with 被',
    `**Subject + 被 (+ doer) + verb + result**: *我的自行车被(人)偷了* "My bike was stolen."
    Traditionally used for unpleasant events; modern written Chinese uses it more widely.
    Spoken alternatives: 叫 / 让: *杯子叫他打破了.*
    Many passives in English are active in Chinese: *这本书写得很好* "This book is well written."`,
    [
      { type: 'mc', prompt: '"My bike was stolen"', options: ['我的自行车被偷了', '我的自行车偷被了', '被我的自行车偷了'], answer: '我的自行车被偷了' },
      { type: 'mc', prompt: '"The cup was broken by him"', options: ['杯子被他打破了', '他被杯子打破了', '杯子打破被他了'], answer: '杯子被他打破了' },
    ]),
  lesson(L, 'result-complements', 3, 32, 'grammar', 'Result complements',
    `Verb + result = what the action achieved: **完** finish (*做完*), **懂** understand (*听懂*), **到** reach/succeed (*找到* find), **见** perceive (*看见* see), **好** done well (*准备好*), **错** wrongly (*写错*).
    *我听懂了* "I understood (what I heard)." Negative: *我没听懂.*
    看 is "look", 看见 is "see": the result matters.`,
    [
      { type: 'mc', prompt: '"I found it"', options: ['我找到了', '我找了', '我到找了'], answer: '我找到了' },
      { type: 'mc', prompt: '"I didn\'t understand (listening)"', options: ['我没听懂', '我不听懂了', '我听没懂'], answer: '我没听懂' },
      { type: 'mc', prompt: '"I wrote it wrong"', options: ['我写错了', '我错写了', '我写了错'], answer: '我写错了' },
    ]),
  lesson(L, 'potential', 3, 33, 'grammar', 'Potential complements: 得 / 不',
    `Insert **得** (can) or **不** (can't) between a verb and its result:
    *听得懂* "can understand" / *听不懂* "can't understand" · *看得见* / *看不见* · *做得完* / *做不完* · *买不到* "can't get (sold out)".
    *这么多菜，我吃不完* "So much food, I can't finish it."
    Also **得** for manner: *他说得很快* "He speaks fast."`,
    [
      { type: 'mc', prompt: '"I can\'t understand (what I hear)"', options: ['我听不懂', '我不听懂', '我听懂不'], answer: '我听不懂' },
      { type: 'mc', prompt: '"Can you see it?"', options: ['你看得见吗？', '你得看见吗？', '你看见得吗？'], answer: '你看得见吗？' },
      { type: 'mc', prompt: '"He speaks Chinese very well"', options: ['他中文说得很好', '他说中文很好得', '他得说中文很好'], answer: '他中文说得很好' },
    ]),
  lesson(L, 'shi-de-zhe', 3, 34, 'grammar', '是…的 and 着',
    `**是…的** highlights *when, where, how* a known past event happened: *我是昨天来的* "It was yesterday that I came." *你是怎么来的？* "How did you get here?"
    **着 zhe** marks a continuing state: *门开着* "The door is open." *他穿着红衣服* "He's wearing red." Also "while": *他笑着说* "he said with a smile".`,
    [
      { type: 'mc', prompt: '"How did you come here?" (focus on how)', options: ['你是怎么来的？', '你怎么来了？', '你来怎么的？'], answer: '你是怎么来的？' },
      { type: 'mc', prompt: '"The door is open (state)"', options: ['门开着', '门开了着', '门在开'], answer: '门开着' },
    ]),

  // ============================ LEVEL 4 (B2) ============================
  lesson(L, 'complex-connectors', 4, 40, 'grammar', 'Paired connectors',
    `Chinese often uses pairs:
    **虽然…但是** although…(but) · **因为…所以** because…so · **如果…就** if…then · **不但…而且** not only…but also · **只要…就** as long as · **只有…才** only if · **即使…也** even if · **一…就** as soon as.
    *虽然很贵，但是很好.* *如果下雨，我们就不去.* *他一到家就睡觉了.*`,
    [
      { type: 'mc', prompt: '"Although it\'s expensive, it\'s good"', options: ['虽然很贵，但是很好', '因为很贵，所以很好', '如果很贵，就很好'], answer: '虽然很贵，但是很好' },
      { type: 'mc', prompt: '"As soon as he got home he slept"', options: ['他一到家就睡觉了', '他到家一就睡觉了', '他一就到家睡觉了'], answer: '他一到家就睡觉了' },
      { type: 'mc', prompt: '只有…___ (only if…then)', options: ['才', '就', '也'], answer: '才' },
    ]),
  lesson(L, 'lian-dou', 4, 41, 'grammar', 'Emphasis: 连…都/也, 就, 才',
    `**连…都/也** "even": *他连一个字都不认识* "He doesn't know even one character."
    **就** = sooner/less than expected: *他八点就来了* "He came as early as 8."
    **才** = later/more than expected: *他十点才来* "He didn't come until 10."
    Rhetorical questions: *难道你不知道吗？* "Don't tell me you don't know?"`,
    [
      { type: 'mc', prompt: '"He didn\'t come until 10"', options: ['他十点才来', '他十点就来了', '他才十点来了'], answer: '他十点才来' },
      { type: 'mc', prompt: '"Even children know"', options: ['连孩子都知道', '孩子连都知道', '都连孩子知道'], answer: '连孩子都知道' },
    ]),
  lesson(L, 'written-spoken', 4, 42, 'register', 'Written vs spoken vocabulary',
    `News and formal texts use different words from conversation:
    但是 → **但** / **然而** · 因为 → **由于** · 所以 → **因此** · 在 → **于** · 和 → **与 / 及** · 没有 → **未** / **无** · 这个 → **此** · 的 → **之** · 现在 → **目前**
    *由于天气原因，航班取消.* "Due to the weather, the flight was cancelled."
    Recognising these is key for reading passages and certification translations.`,
    [
      { type: 'mc', prompt: 'Formal written equivalent of 因为', options: ['由于', '所以', '于是'], answer: '由于' },
      { type: 'mc', prompt: '"此" means…', options: ['this', 'that', 'no'], answer: 'this' },
      { type: 'mc', prompt: 'Formal written equivalent of 所以', options: ['因此', '因为', '但是'], answer: '因此' },
    ]),
  lesson(L, 'long-modifiers', 4, 43, 'grammar', 'Reading long modifiers',
    `All modifiers come **before** the noun, however long, with 的 before the noun:
    *[昨天在图书馆跟我说话的]那个人* "the person [who talked to me in the library yesterday]".
    To translate, find the noun after the last 的, then read the modifier as an English relative clause.
    Several 的 in a row: *[我朋友的]妹妹的书* "my friend's younger sister's book".`,
    [
      { type: 'mc', prompt: '"我昨天买的书" means…', options: ['the book I bought yesterday', 'I bought a book yesterday', 'yesterday\'s book buyer'], answer: 'the book I bought yesterday' },
      { type: 'mc', prompt: 'In "在北京工作的朋友", the head noun is…', options: ['朋友', '北京', '工作'], answer: '朋友' },
    ]),

  // ============================ LEVEL 5 (C1) ============================
  lesson(L, 'classical-particles', 5, 50, 'grammar', 'Classical particles in modern writing',
    `Formal Chinese keeps classical function words:
    **之** = 的 (*三分之一* "one third", *原因之一* "one of the reasons") · **其** = 他/她/它的 (*其中* "among them") · **以** = 用 / in order to (*以…为* "take…as") · **于** = 在 / than / to (*大于* "greater than") · **而** = and/but (*而且, 然而*) · **所** + verb = "that which" (*所说的* "what was said") · **为 wéi** = be/as (*成为*).`,
    [
      { type: 'mc', prompt: '"三分之一" means…', options: ['one third', 'three ones', 'a third time'], answer: 'one third' },
      { type: 'mc', prompt: '"大于" means…', options: ['greater than', 'big in', 'mostly'], answer: 'greater than' },
      { type: 'mc', prompt: '"原因之一" means…', options: ['one of the reasons', 'the first reason', 'a reason only'], answer: 'one of the reasons' },
    ]),
  lesson(L, 'chengyu', 5, 51, 'grammar', 'Chengyu (four-character idioms)',
    `Educated writing is full of 成语, fixed four-character idioms often from classical stories:
    **马马虎虎** so-so / careless · **一心一意** wholeheartedly · **半途而废** give up halfway · **自言自语** talk to oneself · **入乡随俗** when in Rome… · **画蛇添足** overdo it (draw legs on a snake) · **对牛弹琴** waste words on someone (play the lute to a cow).
    Translate the meaning, not word by word.`,
    [
      { type: 'mc', prompt: '"半途而废" means…', options: ['give up halfway', 'halfway home', 'a wasted road'], answer: 'give up halfway' },
      { type: 'mc', prompt: '"入乡随俗" means…', options: ['when in Rome, do as the Romans do', 'enter the countryside', 'follow the crowd blindly'], answer: 'when in Rome, do as the Romans do' },
      { type: 'mc', prompt: '"画蛇添足" means…', options: ['ruin something by overdoing it', 'draw a snake', 'add feet to walk faster'], answer: 'ruin something by overdoing it' },
    ]),
  lesson(L, 'formal-letters', 5, 52, 'register', 'Formal writing and letters',
    `Formal letters: **尊敬的…** "Respected…" (*尊敬的王经理：*) · Closing wishes: **此致 敬礼** (on two lines) · **祝您工作顺利** "wishing you success in your work".
    Polite forms: **您**, **贵** (your honourable: *贵公司* "your company"), **敝/本** (my humble: *本公司*), **请问** (may I ask), **麻烦您** (sorry to trouble you).
    Avoid 了/吧/啊 and slang. Prefer written vocabulary (由于, 因此, 此外).`,
    [
      { type: 'register-scene', prompt: 'Opening a formal letter to Manager Wang', options: ['尊敬的王经理：', '嗨，老王！', '王，你好呀'], answer: '尊敬的王经理：', register: 'formal' },
      { type: 'mc', prompt: '"贵公司" means…', options: ['your (honourable) company', 'an expensive company', 'our company'], answer: 'your (honourable) company', register: 'formal' },
      { type: 'mc', prompt: 'A standard formal letter ending', options: ['此致 敬礼', '拜拜', '好吧'], answer: '此致 敬礼' },
    ]),
  lesson(L, 'translation-strategies', 5, 53, 'grammar', 'Translating paragraphs',
    `Chinese ↔ English differences to handle:
    • No tense: infer time from 了/过/时间词 and context.
    • Subjects are often dropped: supply "he/she/they/we".
    • Topic-comment: *这本书我看过* "I've read this book."
    • Long pre-noun modifiers: restructure as English relative clauses.
    • Commas join several clauses (流水句): split into multiple English sentences.
    • Plurals are rarely marked: decide "a/the/some" from context.
    Then confirm every character is accounted for, which the certification exam requires.`,
    [
      { type: 'mc', prompt: '"这本书我看过" is best translated…', options: ["I've read this book", 'This book has read me', 'I read this book now'], answer: "I've read this book" },
      { type: 'mc', prompt: 'A long Chinese sentence joined by commas should often be…', options: ['split into several English sentences', 'kept as one comma-spliced sentence', 'shortened by deleting clauses'], answer: 'split into several English sentences' },
    ]),
];
