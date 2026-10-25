import type { GameEvent } from "@/game/types";

export const newbornEvents: GameEvent[] = [
  {
    id: "newborn-night-feeding",
    stageId: "newborn",
    title: "凌晨三點的哭聲",
    description: "寶寶又醒了，這已經是今晚第三次。你們怎麼分工？",
    sourceIds: ["sfaa-childcare"],
    choices: [
      {
        id: "take-turns",
        label: "和伴侶排班輪流起床，白天找時間補眠",
        effects: { bond: 5, selfCare: 4, support: 6 },
        feedback: "分工讓兩個人都撐得下去，寶寶也感受到穩定的回應。",
      },
      {
        id: "do-it-all",
        label: "自己全包，不想吵醒另一半",
        effects: { bond: 6, selfCare: -8, support: -2 },
        feedback: "你很愛孩子，但長期睡眠不足會讓情緒和健康亮紅燈。",
      },
    ],
  },
];
