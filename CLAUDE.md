# BeAParent｜當爸媽這件事

台灣育兒人生模擬網站。畫面是一座可探索的 3D 等角群島：十座島＝十個人生階段（懷孕 → 新生兒 → … → 孩子成家 → 空巢 → 告別），島上的建築＝該階段的任務，協作線＝貫穿多個階段的主題（健康、學習、家計…），小人沿著協作線在島間搬運道具。玩家依序解鎖島嶼、在建築裡做情境抉擇，走完告別島後以多維度評分回顧這一生。

互動與視覺參考 Heart Island，完整拆解見 [`docs/reference/heart-island-spec.md`](docs/reference/heart-island-spec.md)。**只參考機制與版面，不得沿用原站的品牌、標誌、人名與政見文字。**

@AGENTS.md

## 技術選型

| 項目 | 選擇 | 備註 |
| --- | --- | --- |
| 框架 | Next.js 16（App Router）+ TypeScript strict | 版本與訓練資料不同，寫 Next 相關程式前先讀 `node_modules/next/dist/docs/` |
| 3D | three + React Three Fiber + drei | 幾何一律程式化產生（六角柱、方塊、圓錐），不使用外部模型檔 |
| 樣式 | Tailwind CSS v4 | 色票在 `src/app/globals.css` 的 `@theme`；共用元件 class 在 `@layer components` |
| 動畫 | Motion（`motion/react`）＋ R3F `useFrame` | DOM 動畫用 Motion；3D 動畫在 `useFrame` 裡改 ref，不觸發 React 重繪 |
| 音效 | Howler.js，經 `src/lib/audio.ts` 包裝 | 預設靜音；音檔放 `public/audio/` |
| 狀態 | Zustand：`gameStore`（persist 到 localStorage）、`uiStore`（不存檔） | 無後端、無帳號 |
| 選取狀態 | URL hash（`#island=…` / `#building=…` / `#flow=…`） | `src/lib/selection.ts`；可分享、可上一頁 |
| 測試 | Vitest | 測 `src/game/`、`src/scene/` 純邏輯與 `src/content/` 內容規則 |
| Lint/格式 | ESLint（eslint-config-next）+ Prettier（printWidth 100） | |

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
  app/               # 路由：/（首頁）、/play（3D 群島）、/result（評分與人生回顧）
  components/
    scene/           # R3F 3D 元件：World、Islands、Bridges、FlowArcs、Walkers、CameraRig
    hud/             # 疊在 canvas 上的 DOM 介面：TopBar、IndexPanel、DetailCard、DilemmaPanel
  game/              # 純 TS 遊戲規則：型別、數值、引擎、評分、人生時鐘（不可 import React / three）
  scene/             # 純 TS 場景數學：六角座標、小人狀態機、燈光內插（不可 import React / three）
  content/           # 內容資料：islands.ts、flows.ts、sources.ts；world.ts 由資料推導場景配置
  store/             # Zustand store
  lib/               # 瀏覽器工具（音效、URL 選取）
docs/reference/      # Heart Island 規格書
```

## 架構規則

1. **規則與畫面分離**：數值變化、解鎖、評分寫在 `src/game/`；座標換算、小人移動、燈光計算寫在 `src/scene/`。兩者都必須是無副作用的純函式並有測試。元件和 store 只呼叫它們，不自行計算。
2. **內容即資料**：新增或修改島、建築、協作線只改 `src/content/`，不改引擎與場景元件。島的位置只由 `axial` 決定。
3. **遊戲進度**：有 `dilemma` 的建築是必經任務，完成目前島上所有抉擇才能啟航。進度只存 `stageIndex` 與 `history`（每筆＝建築 id＋選項 id），其餘狀態一律由此推導。
4. **五個評分維度**固定為 `childWellbeing`（孩子身心）、`bond`（親子關係）、`selfCare`（自我照顧）、`finance`（家庭經濟）、`support`（支持系統），數值 0–100。更改維度需同步更新 `stats.ts`、`scoring.ts` 權重（總和 = 1）與測試。
5. **存檔相容**：改動 `GameState` 結構時，調升 `gameStore.ts` 的 `persist.version` 並更新 `migrate`。
6. **Hydration**：讀取 `gameStore` 的頁面要先用 `useHasHydrated()` 判斷。3D 世界用 `next/dynamic`（`ssr: false`）載入。
7. **選取**：島、建築、協作線、清單的點擊一律呼叫 `select()`，不要另存選取狀態。
8. **3D 實作注意**：
   - 大量重複物件（小人）用 `InstancedMesh`，每幀在 `useFrame` 裡更新矩陣。
   - drei `<Html>` 名牌一律掛載，以 `hidden` 切換顯示，並傳 `portal={labelLayer}`。條件式卸載或掛在預設位置，會在 React 19 拋 `removeChild` 錯誤。
   - 場景色票集中在 `components/scene/palette.ts`，與 `globals.css` 保持一致。
   - 鏡頭動畫只在 `CameraRig` 裡處理；使用者拖曳時會取消飛行。
9. 優先用 Server Component；只有需要互動、store 或 WebGL 的元件才加 `"use client"`。

## 內容撰寫規則

- **語言**：繁體中文（台灣用語），例如「產檢」「托育」「國小」，不用中國大陸用語。
- **語氣**：溫暖、不評斷。沒有「錯誤」選項，只有不同取捨；回饋文字說明影響，不說教。每個選項都應有得有失，避免單一最佳解。
- **多元家庭**：不預設父母性別或家庭型態，用「伴侶」「另一半」等中性詞。
- **抉擇格式**：每個 dilemma 2–4 個選項，單一選項的單一數值變動在 ±10 以內（`content.test.ts` 會檢查）。每座島至少一個 dilemma。
- **心態變化**：每座島寫明 `parentRole`（父母角色）與 `mindset`（心態轉變），這是網站要傳達的核心。
- **審核狀態**：新內容一律 `review: "draft"`（介面顯示「內容草稿」），人工審核後才改成 `"reviewed"`。
- **關鍵數字**（`stats`）只放已查證、不易變動的數字，並附來源。

## 官方資料引用規則

- 涉及醫療、補助、法規（產檢、疫苗時程、育兒津貼、育嬰假等）的內容，必須在 `src/content/sources.ts` 登記來源，並在建築的 `sourceIds` 引用。
- 只引用台灣政府或公信機構（國健署、疾管署、社家署、勞動部、教育部等）。
- 每筆來源要有 `verifiedAt`（最後人工查證日期）。`null` 代表尚未查證，介面會顯示「待查證」。**上線前不得有 `null`**。
- 補助金額、天數會隨政策變動。文案寫「依現行規定」並附連結，不要把金額寫死在文字中。
- 本網站不提供醫療建議；需要時加註「請諮詢專業醫療人員」。

## 視覺、音效與動畫規則

- 風格：低多邊形等角小島＋米白紙感 UI＋橙色強調（`accent` #DB6A41）。大編號用 Georgia 斜體，小標籤用等寬全大寫（`.mono-label`）。
- 人生時鐘：天色隨人生階段從清晨（懷孕）走到深夜（告別），由 `game/lifeClock.ts`＋`scene/lighting.ts` 決定。
- 音效預設靜音，使用者主動開啟才播放；不自動播放背景音樂。
- 尊重 `prefers-reduced-motion`：無限循環或大幅位移的動畫要提供降級。
- 音檔使用可商用授權素材，在 `public/audio/CREDITS.md` 註明來源與授權。

## 其他

- 無後端、無帳號、不收集個資。
- 行動裝置優先：手機版清單與詳情卡在底部，按鈕可點擊區域至少 44px。
- 圖片與音檔需壓縮後再提交。

## 實作進度（對照規格書 6.2）

- [x] 1. 資料先行（islands / flows / sources 與型別）
- [x] 2. 島與鏡頭（六角島、海面、燈光、flyTo）
- [x] 3. 名牌＋右側清單＋左側詳情卡＋URL hash
- [x] 4. 協作線與走動小人（InstancedMesh、狀態機）
- [ ] 5. 時間系統（目前只有依階段變化的人生時鐘，沒有自動前進的遊戲時鐘與 dayCycle 亮燈）
- [ ] 6. 城市日誌（`stepWalker` 已會回傳 depart / arrive 事件，尚未接到介面）
- [ ] 7. 導覽與新手引導
- [ ] 8. 我的角色
- [ ] 9. 手機版與效能（低階機降級、減少小人）
- [ ] 10. 部署
