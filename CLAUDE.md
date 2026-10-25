# BeAParent｜當爸媽這件事

台灣育兒人生模擬網站。玩家從懷孕開始，航行十座「人生島嶼」（懷孕 → 新生兒 → … → 孩子成家 → 空巢 → 告別），在每座島上面對情境事件並做選擇，最後以多維度評分回顧這一生做得如何。設計參考 puma.taipei/heart-island 的島嶼探索形式。

@AGENTS.md

## 技術選型

| 項目 | 選擇 | 備註 |
| --- | --- | --- |
| 框架 | Next.js 16（App Router）+ TypeScript strict | 版本與訓練資料不同，寫 Next 相關程式前先讀 `node_modules/next/dist/docs/` |
| 樣式 | Tailwind CSS v4 | 色票定義在 `src/app/globals.css` 的 `@theme`（`sea` / `island` / `sand`） |
| 動畫 | Motion（`motion/react`） | 轉場、島嶼脈動、卡片進場 |
| 音效 | Howler.js，經 `src/lib/audio.ts` 包裝 | 預設靜音；音檔放 `public/audio/` |
| 狀態 | Zustand + `persist`（localStorage） | 無後端、無帳號 |
| 測試 | Vitest | 測 `src/game/` 純邏輯 |
| Lint/格式 | ESLint（eslint-config-next）+ Prettier | |

## 指令

```bash
npm run dev        # 開發伺服器
npm run build      # 正式建置
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm test           # Vitest
npm run format     # Prettier
```

提交前必須通過：`npm run lint && npm run typecheck && npm test && npm run build`。

## 目錄結構

```
src/
  app/            # 路由：/（首頁）、/play（島嶼地圖與事件）、/result（評分）
  components/     # React UI 元件，只負責呈現
  game/           # 純 TypeScript 遊戲規則：型別、數值、引擎、評分（不可 import React）
  content/        # 遊戲內容資料：stages.ts、events/<stageId>.ts、sources.ts
  store/          # Zustand store，把 game/ 的純函式接到 UI
  lib/            # 瀏覽器工具（音效等）
public/audio/     # 音效檔
```

## 架構規則

1. **規則與畫面分離**：所有數值變化、階段推進、評分邏輯寫在 `src/game/`，必須是無副作用的純函式並有測試。元件和 store 不得自行計算數值。
2. **內容即資料**：新增事件只改 `src/content/`，不改引擎。每個階段一個檔案 `events/<stageId>.ts`，並在 `events/index.ts` 註冊。
3. **五個評分維度**固定為 `childWellbeing`（孩子身心）、`bond`（親子關係）、`selfCare`（自我照顧）、`finance`（家庭經濟）、`support`（支持系統），數值 0–100。新增或更改維度需同步更新 `stats.ts`、`scoring.ts` 權重（總和 = 1）與測試。
4. **存檔相容**：改動 `GameState` 結構時，調升 `gameStore.ts` 的 `persist.version` 並寫 `migrate`。
5. **Hydration**：讀取 store 的頁面要先用 `useHasHydrated()` 判斷，避免 SSR 與 localStorage 不一致。
6. 優先用 Server Component；只有需要互動或 store 的元件才加 `"use client"`。

## 內容撰寫規則

- **語言**：繁體中文（台灣用語），例如「產檢」「托育」「國小」，不用中國大陸用語。
- **語氣**：溫暖、不評斷。沒有「錯誤」選項，只有不同取捨；回饋文字說明影響，不說教。每個選項都應有得有失，避免單一最佳解。
- **多元家庭**：不預設父母性別或家庭型態，用「伴侶」「另一半」等中性詞。
- **事件格式**：每個事件 2–4 個選項，單一選項的單一數值變動幅度建議在 ±10 以內。
- **心態變化**：每個階段在 `stages.ts` 寫明 `parentRole`（父母角色）與 `mindset`（心態轉變），這是網站要傳達的核心。

## 官方資料引用規則

- 涉及醫療、補助、法規（產檢、疫苗時程、育兒津貼、育嬰假等）的內容，必須在 `src/content/sources.ts` 登記來源，並在事件的 `sourceIds` 引用。
- 只引用台灣政府或公信機構（國健署、疾管署、社家署、勞動部、教育部等）。
- 每筆來源要有 `verifiedAt`（最後人工查證日期）。`null` 代表尚未查證，**上線前不得有 `null`**。
- 遊戲內數字（補助金額、天數）會隨政策變動，文案寫「依現行規定」並附連結，不要把金額寫死在選項文字中。
- 本網站不提供醫療建議；需要時加註「請諮詢專業醫療人員」。

## 音效與動畫規則

- 音效預設靜音，使用者主動開啟才播放；不自動播放背景音樂。
- 尊重 `prefers-reduced-motion`：無限循環或大幅位移的動畫要提供降級。
- 音檔使用可商用授權素材，在 `public/audio/CREDITS.md` 註明來源與授權。

## 其他

- 無後端、無帳號、不收集個資。
- 行動裝置優先（RWD），按鈕可點擊區域至少 44px。
- 圖片與音檔需壓縮後再提交。
