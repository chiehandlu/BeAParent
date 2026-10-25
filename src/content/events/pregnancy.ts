import type { GameEvent } from "@/game/types";

export const pregnancyEvents: GameEvent[] = [
  {
    id: "pregnancy-prenatal-checkup",
    stageId: "pregnancy",
    title: "第一次產檢",
    description: "驗孕棒出現兩條線。接下來的產前檢查，你打算怎麼安排？",
    sourceIds: ["hpa-mammy"],
    choices: [
      {
        id: "follow-schedule",
        label: "依照政府補助的產檢時程按時檢查，兩人一起去",
        effects: { childWellbeing: 8, support: 6, selfCare: 2 },
        feedback: "按時產檢能及早發現問題，伴侶陪同也讓彼此更有參與感。",
      },
      {
        id: "go-alone",
        label: "工作太忙，自己抽空去就好",
        effects: { childWellbeing: 5, support: -3, selfCare: -2 },
        feedback: "孩子的檢查有顧到，但一個人扛著，壓力悄悄累積。",
      },
    ],
  },
];
