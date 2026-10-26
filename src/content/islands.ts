import type { Island } from "@/game/types";

/**
 * 十座人生島，依序解鎖。有 dilemma 的建築是該島必經任務，其餘為知識建築。
 * 所有內容目前為草稿（review: "draft"），需人工審核後改為 "reviewed"。
 */
export const ISLANDS: Island[] = [
  {
    id: "pregnancy",
    number: 1,
    name: "懷孕期",
    childAge: "孕期 40 週",
    parentRole: "準備者",
    summary: "身體與生活開始改變，學著為一個還沒見面的人做準備。",
    mindset: "從「我」開始學著想「我們」。",
    axial: [0, 0],
    buildings: [
      {
        id: "pregnancy-checkup",
        name: "產檢診所",
        plain: "懷孕期間依建議時程做產前檢查，追蹤母體與胎兒健康。",
        who: "懷孕者與伴侶",
        facts: ["政府補助產前檢查，次數與項目依現行規定", "可領取孕婦健康手冊記錄每次檢查"],
        sourceIds: ["hpa-mammy"],
        review: "draft",
        dilemma: {
          prompt: "驗孕棒出現兩條線。接下來的產前檢查，你打算怎麼安排？",
          choices: [
            {
              id: "together",
              label: "依建議時程按時檢查，兩人一起去",
              effects: { childWellbeing: 8, support: 6, finance: -2 },
              feedback: "按時產檢能及早發現問題，伴侶陪同也讓彼此更有參與感；只是兩人都得請假。",
            },
            {
              id: "alone",
              label: "工作太忙，自己抽空去就好",
              effects: { childWellbeing: 5, support: -3, selfCare: -2 },
              feedback: "孩子的檢查有顧到，但一個人扛著，壓力悄悄累積。",
            },
          ],
        },
      },
      {
        id: "pregnancy-budget",
        name: "家計小屋",
        plain: "盤點收入與支出，預估生產、育嬰假與托育的開銷。",
        who: "準爸媽",
        facts: ["育兒津貼與托育補助資格依現行規定", "提早了解育嬰留職停薪的申請方式"],
        sourceIds: ["sfaa-childcare", "mol-parental-leave"],
        review: "draft",
        dilemma: {
          prompt: "算了算未來的開銷，你們決定怎麼準備？",
          choices: [
            {
              id: "save",
              label: "縮減娛樂支出，開始存一筆育兒預備金",
              effects: { finance: 8, selfCare: -4 },
              feedback: "財務安全感上升，但生活少了一些喘息的小確幸。",
            },
            {
              id: "babymoon",
              label: "趁還能出門，先去一趟兩人旅行",
              effects: { support: 7, selfCare: 5, finance: -6 },
              feedback: "兩人留下美好回憶、關係更緊密，存款則少了一截。",
            },
          ],
        },
      },
      {
        id: "pregnancy-class",
        name: "媽媽教室",
        plain: "參加孕產與育兒課程，認識分娩、哺乳與新生兒照顧。",
        who: "準爸媽與家人",
        facts: ["許多醫院與衛生所提供免費孕產課程"],
        review: "draft",
      },
    ],
  },
  {
    id: "newborn",
    number: 2,
    name: "新生兒期",
    childAge: "0–1 歲",
    parentRole: "全天候照顧者",
    summary: "日夜顛倒的第一年，學會讀懂一個還不會說話的人。",
    mindset: "睡眠不足中，學會回應一個無法說話的人。",
    axial: [1, 0],
    buildings: [
      {
        id: "newborn-night",
        name: "夜光育嬰室",
        plain: "新生兒需要頻繁餵食與安撫，照顧者的睡眠會大受影響。",
        who: "主要照顧者",
        facts: ["照顧者的身心狀況會影響照顧品質", "產後情緒低落持續時，請尋求專業協助"],
        review: "draft",
        dilemma: {
          prompt: "寶寶又醒了，這已經是今晚第三次。你們怎麼分工？",
          choices: [
            {
              id: "shifts",
              label: "和伴侶排班輪流起床，白天找時間補眠",
              effects: { bond: 5, selfCare: 4, support: 6 },
              feedback: "分工讓兩個人都撐得下去，寶寶也感受到穩定的回應。",
            },
            {
              id: "solo",
              label: "自己全包，不想吵醒另一半",
              effects: { bond: 6, selfCare: -8, support: -2 },
              feedback: "你很愛孩子，但長期睡眠不足會讓情緒和健康亮紅燈。",
            },
          ],
        },
      },
      {
        id: "newborn-vaccine",
        name: "預防接種站",
        plain: "依疫苗接種時程帶孩子施打公費疫苗，並記錄在兒童健康手冊。",
        who: "嬰兒與家長",
        facts: ["公費疫苗項目與時程依疾管署公告", "兒童預防保健服務可同時追蹤發展"],
        sourceIds: ["cdc-vaccine"],
        review: "draft",
      },
      {
        id: "newborn-care",
        name: "托育岔路",
        plain: "育嬰假結束前，要決定孩子白天由誰照顧。",
        who: "雙薪或單薪家庭",
        facts: ["公共托育、準公共保母與家人照顧各有補助規定"],
        sourceIds: ["sfaa-childcare"],
        review: "draft",
        dilemma: {
          prompt: "育嬰假快結束了，白天誰來照顧寶寶？",
          choices: [
            {
              id: "daycare",
              label: "送托嬰中心或保母，兩人都回到職場",
              effects: { finance: 6, selfCare: 3, bond: -3 },
              feedback: "經濟比較穩，也保有自己的工作身分；只是錯過了一些日常片刻。",
            },
            {
              id: "stay-home",
              label: "其中一人留職停薪，在家帶到一歲多",
              effects: { bond: 8, finance: -7, selfCare: -2 },
              feedback: "陪伴時間很充足，但收入減少，在家的那位也需要有人關心。",
            },
            {
              id: "grandparents",
              label: "請長輩幫忙帶",
              effects: { finance: 5, support: 4, bond: -2, selfCare: -1 },
              feedback: "省錢又安心，但教養觀念不同時，需要更多溝通。",
            },
          ],
        },
      },
    ],
  },
  {
    id: "toddler",
    number: 3,
    name: "幼兒期",
    childAge: "1–3 歲",
    parentRole: "安全基地",
    summary: "孩子開始走、開始說「不」，探索世界也測試界線。",
    mindset: "放手讓他探索，同時守住界線。",
    axial: [2, 0],
    buildings: [
      {
        id: "toddler-tantrum",
        name: "情緒小劇場",
        plain: "兩三歲的孩子還不會調節情緒，哭鬧是表達的方式。",
        who: "幼兒與家長",
        facts: ["先接住情緒、再處理行為，通常比斥責更有效"],
        review: "draft",
        dilemma: {
          prompt: "孩子在大賣場躺在地上大哭，因為想要一個玩具。你會？",
          choices: [
            {
              id: "empathize",
              label: "蹲下來抱著他，說出他的感受，等他平靜",
              effects: { bond: 7, childWellbeing: 4, selfCare: -3 },
              feedback: "孩子學到情緒被理解；你則需要很大的耐心，還得承受旁人眼光。",
            },
            {
              id: "buy",
              label: "先買給他，讓事情快點結束",
              effects: { finance: -3, selfCare: 3, childWellbeing: -3 },
              feedback: "當下平息了，但孩子可能學到「哭就能得到」。",
            },
            {
              id: "leave",
              label: "堅定地說不，帶他離開現場",
              effects: { childWellbeing: 3, bond: -2 },
              feedback: "界線清楚，孩子會慢慢明白規則，只是當下有點受傷。",
            },
          ],
        },
      },
      {
        id: "toddler-screen",
        name: "螢幕瞭望台",
        plain: "幼兒的螢幕使用需要大人陪伴與節制。",
        who: "幼兒與家長",
        facts: ["國健署有幼兒螢幕使用的建議，請依最新公告"],
        sourceIds: ["hpa-mammy"],
        review: "draft",
      },
      {
        id: "toddler-dev",
        name: "發展檢核站",
        plain: "透過兒童預防保健與發展檢核，及早發現需要協助的地方。",
        who: "幼兒與家長",
        facts: ["發現發展疑慮時，可洽詢早期療育資源", "請諮詢專業醫療人員"],
        review: "draft",
      },
    ],
  },
  {
    id: "preschool",
    number: 4,
    name: "學齡前",
    childAge: "3–6 歲",
    parentRole: "玩伴與引導者",
    summary: "上幼兒園、交朋友，孩子的世界開始不只有家。",
    mindset: "比起教會，更重要的是陪伴。",
    axial: [3, 0],
    buildings: [
      {
        id: "preschool-kindergarten",
        name: "幼兒園大門",
        plain: "選擇公立、非營利、準公共或私立幼兒園，各有費用與教學特色。",
        who: "家長",
        facts: ["幼兒園就學補助依教育部現行規定"],
        sourceIds: ["edu"],
        review: "draft",
        dilemma: {
          prompt: "要選哪一種幼兒園？",
          choices: [
            {
              id: "public",
              label: "抽公幼或非營利幼兒園，離家近就好",
              effects: { finance: 6, childWellbeing: 3 },
              feedback: "費用負擔小、生活規律；沒抽中的話還得另做打算。",
            },
            {
              id: "bilingual",
              label: "選學費較高的雙語或特色幼兒園",
              effects: { childWellbeing: 4, finance: -8, selfCare: -2 },
              feedback: "孩子接觸更多刺激，但家計吃緊，也要留意他是否玩得開心。",
            },
          ],
        },
      },
      {
        id: "preschool-play",
        name: "遊戲公園",
        plain: "自由遊戲幫助孩子發展身體、語言與社交能力。",
        who: "孩子與家長",
        facts: ["每天固定的親子時光，比昂貴的課程更重要"],
        review: "draft",
      },
    ],
  },
  {
    id: "primary",
    number: 5,
    name: "國小",
    childAge: "6–12 歲",
    parentRole: "教練",
    summary: "功課、才藝、同儕，孩子開始有自己的生活圈。",
    mindset: "成績之外，看見孩子的特質。",
    axial: [2, 1],
    buildings: [
      {
        id: "primary-afterschool",
        name: "放學十字路口",
        plain: "放學後的時間怎麼安排：安親班、才藝課，或回家自由玩。",
        who: "國小學童與家長",
        facts: ["學校多有課後照顧班，收費與資格依各校規定"],
        sourceIds: ["edu"],
        review: "draft",
        dilemma: {
          prompt: "同學都在上補習和才藝，你的孩子放學後要做什麼？",
          choices: [
            {
              id: "classes",
              label: "安排安親班加兩樣才藝，不想輸在起跑點",
              effects: { childWellbeing: -2, finance: -7, selfCare: 4 },
              feedback: "你有了下班後的緩衝時間，但孩子行程滿檔，也需要放空。",
            },
            {
              id: "choose",
              label: "讓孩子自己選一樣喜歡的，其餘時間自由玩",
              effects: { childWellbeing: 6, bond: 4, finance: -2, selfCare: -3 },
              feedback: "孩子更有熱情，你們也更常聊天；只是接送與陪伴時間變多了。",
            },
          ],
        },
      },
      {
        id: "primary-homework",
        name: "作業書桌",
        plain: "陪伴寫功課是建立學習習慣的時候，也常是親子衝突來源。",
        who: "國小學童與家長",
        facts: ["比起盯答案，關心學習過程更能培養自主"],
        review: "draft",
      },
      {
        id: "primary-friends",
        name: "友誼樹屋",
        plain: "孩子開始重視同儕關係，也可能遇到排擠或衝突。",
        who: "國小學童",
        facts: ["察覺孩子情緒變化，主動傾聽"],
        review: "draft",
      },
    ],
  },
  {
    id: "adolescence",
    number: 6,
    name: "青春期",
    childAge: "12–18 歲",
    parentRole: "顧問",
    summary: "身體劇烈變化、渴望獨立，關上的房門也是成長的一部分。",
    mindset: "學著被推開，但不離開。",
    axial: [1, 1],
    buildings: [
      {
        id: "adolescence-phone",
        name: "手機燈塔",
        plain: "手機與社群媒體是青少年社交的重心，也帶來沉迷與網路安全的風險。",
        who: "青少年與家長",
        facts: ["一起訂規則，比單方面沒收更容易被遵守"],
        review: "draft",
        dilemma: {
          prompt: "孩子每天滑手機到半夜，成績也開始下滑。你會？",
          choices: [
            {
              id: "negotiate",
              label: "坐下來一起討論使用時間，訂出雙方都同意的規則",
              effects: { bond: 6, childWellbeing: 4, selfCare: -2 },
              feedback: "孩子感受到被尊重，規則也比較守得住；談判很花心力。",
            },
            {
              id: "confiscate",
              label: "晚上十點直接收走手機",
              effects: { childWellbeing: 3, bond: -6 },
              feedback: "睡眠改善了，但孩子覺得不被信任，話變少了。",
            },
          ],
        },
      },
      {
        id: "adolescence-exam",
        name: "升學考場",
        plain: "會考與升學選擇，是孩子第一次面對重大的人生決定。",
        who: "國高中生與家長",
        facts: ["適性發展的升學資訊可參考教育部資源"],
        sourceIds: ["edu"],
        review: "draft",
        dilemma: {
          prompt: "孩子想念高職學設計，但你覺得普通高中比較有保障。",
          choices: [
            {
              id: "support",
              label: "支持他的選擇，一起去參觀學校",
              effects: { bond: 7, childWellbeing: 5, finance: -2 },
              feedback: "孩子知道你站在他這邊，更願意為自己的選擇負責。",
            },
            {
              id: "insist",
              label: "堅持先念普通高中，大學再說",
              effects: { childWellbeing: -3, bond: -5, finance: 2 },
              feedback: "你出於擔心，但孩子覺得自己的聲音沒被聽見。",
            },
          ],
        },
      },
    ],
  },
  {
    id: "youngAdult",
    number: 7,
    name: "成年獨立",
    childAge: "18–25 歲",
    parentRole: "後援",
    summary: "上大學、工作、搬出去住，孩子開始過自己的人生。",
    mindset: "尊重他的選擇，即使你不同意。",
    axial: [0, 1],
    buildings: [
      {
        id: "youngAdult-leave",
        name: "離巢車站",
        plain: "孩子離家求學或工作，家裡的節奏也跟著改變。",
        who: "成年子女與父母",
        facts: ["保持聯繫但不過度干涉，是新的平衡"],
        review: "draft",
        dilemma: {
          prompt: "孩子大學畢業想去外縣市工作，薪水不高。你會？",
          choices: [
            {
              id: "let-go",
              label: "祝福他，偶爾視訊關心近況",
              effects: { bond: 5, selfCare: 4, childWellbeing: 3 },
              feedback: "孩子在外摸索也知道家是後盾；你也多了屬於自己的時間。",
            },
            {
              id: "subsidize",
              label: "每個月固定貼補房租",
              effects: { childWellbeing: 3, finance: -7, bond: 2 },
              feedback: "孩子壓力小一些，但你的退休準備也因此延後。",
            },
            {
              id: "come-home",
              label: "勸他留在家附近工作",
              effects: { finance: 3, bond: -4 },
              feedback: "家人相聚容易，但孩子可能覺得錯過了想走的路。",
            },
          ],
        },
      },
      {
        id: "youngAdult-retire",
        name: "退休規劃所",
        plain: "孩子獨立後，是重新規劃自己退休生活與財務的時機。",
        who: "父母",
        facts: ["勞保與勞退制度可參考勞動部說明"],
        sourceIds: ["mol-parental-leave"],
        review: "draft",
      },
    ],
  },
  {
    id: "newFamily",
    number: 8,
    name: "孩子成家",
    childAge: "25 歲以後",
    parentRole: "長輩與朋友",
    summary: "孩子有了伴侶、組成自己的家庭，你從父母變成長輩。",
    mindset: "退一步，讓新的家庭長出自己的樣子。",
    axial: [-1, 2],
    buildings: [
      {
        id: "newFamily-wedding",
        name: "喜宴廣場",
        plain: "孩子決定與伴侶共組家庭，婚禮形式與兩家互動都需要協調。",
        who: "成年子女與兩家長輩",
        facts: ["每個家庭的樣貌都不同，尊重是共同語言"],
        review: "draft",
        dilemma: {
          prompt: "孩子說想簡單登記、不辦傳統喜宴，但親戚都在問。你會？",
          choices: [
            {
              id: "respect",
              label: "尊重他們的決定，幫忙向親戚解釋",
              effects: { bond: 7, support: 3, selfCare: -2 },
              feedback: "孩子感受到你的支持；面對親戚的壓力則由你承擔了一些。",
            },
            {
              id: "insist",
              label: "希望至少辦一場，費用由你出",
              effects: { finance: -8, bond: -3, support: 4 },
              feedback: "親友圓滿了，但新人覺得被安排，荷包也縮水。",
            },
          ],
        },
      },
      {
        id: "newFamily-boundary",
        name: "兩代之間",
        plain: "成年子女的家庭有自己的決定權，給建議前先問「需要嗎？」。",
        who: "父母",
        facts: ["保持適當界線，關係更長久"],
        review: "draft",
      },
    ],
  },
  {
    id: "emptyNest",
    number: 9,
    name: "空巢與含飴弄孫",
    childAge: "—",
    parentRole: "祖父母",
    summary: "家裡安靜下來，也可能迎來孫子女，重新找到自己的位置。",
    mindset: "重新找回自己的生活重心。",
    axial: [0, 2],
    buildings: [
      {
        id: "emptyNest-grandkids",
        name: "祖孫庭院",
        plain: "孫子女出生後，是否幫忙照顧需要兩代一起討論。",
        who: "祖父母與子女",
        facts: ["隔代照顧也有相關補助，依現行規定"],
        sourceIds: ["sfaa-childcare"],
        review: "draft",
        dilemma: {
          prompt: "孩子問你能不能平日幫忙帶孫子。你會？",
          choices: [
            {
              id: "fulltime",
              label: "答應全職幫忙",
              effects: { support: 7, bond: 4, selfCare: -7 },
              feedback: "兩代關係更緊密，但你的體力與自己的計畫都被壓縮。",
            },
            {
              id: "parttime",
              label: "一週幫忙兩天，其他時間留給自己",
              effects: { support: 4, selfCare: 4, bond: 2 },
              feedback: "有參與也有界線，雙方都比較自在。",
            },
          ],
        },
      },
      {
        id: "emptyNest-self",
        name: "第二人生社區",
        plain: "培養興趣、維持社交與運動，是健康老化的關鍵。",
        who: "中高齡者",
        facts: ["社區據點常有樂齡課程"],
        review: "draft",
      },
    ],
  },
  {
    id: "farewell",
    number: 10,
    name: "告別",
    childAge: "—",
    parentRole: "回憶",
    summary: "走到人生最後一段，回頭看看這一路。",
    mindset: "你留下的，是孩子心裡的樣子。",
    axial: [1, 2],
    buildings: [
      {
        id: "farewell-wishes",
        name: "心願燈塔",
        plain: "預立醫療決定與交代心願，是留給家人最後的體貼。",
        who: "父母與家人",
        facts: ["可了解預立醫療照護諮商與安寧緩和相關資源", "請諮詢專業醫療人員"],
        review: "draft",
        dilemma: {
          prompt: "身體漸漸不如從前，你想怎麼面對人生最後一段路？",
          choices: [
            {
              id: "talk",
              label: "和孩子坦白談談自己的心願與醫療意願",
              effects: { bond: 6, support: 5 },
              feedback: "這段對話不容易，但孩子未來不必在慌亂中替你做決定。",
            },
            {
              id: "avoid",
              label: "不想讓孩子擔心，什麼都不說",
              effects: { selfCare: 2, support: -4, bond: -2 },
              feedback: "你想保護他們，但沉默也可能讓家人在關鍵時刻更為難。",
            },
          ],
        },
      },
      {
        id: "farewell-letter",
        name: "時光信箱",
        plain: "寫一封信給孩子，把想說的話留下來。",
        who: "父母",
        facts: ["回憶與感謝，是最好的遺產"],
        review: "draft",
      },
    ],
  },
];

export function getIsland(id: string): Island | undefined {
  return ISLANDS.find((i) => i.id === id);
}

export function findBuilding(id: string) {
  for (const island of ISLANDS) {
    const building = island.buildings.find((b) => b.id === id);
    if (building) return { island, building };
  }
  return undefined;
}
