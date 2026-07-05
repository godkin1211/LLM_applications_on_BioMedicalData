# 補充教材：從宝玉的 LLM / Agent 分享整理出的課程延伸材料

_版本：2026-07-05。用途：作為「醫療大數據：生醫資料庫與人工智慧應用」AI agent 課程的補充閱讀、課堂討論與小練習。_

## 使用範圍

這份補充教材整理自 X 使用者「宝玉」公開站台「宝玉的分享」中與 LLM、agent、coding agent、skills、MCP、context management、harness engineering 相關的文章。由於 X 本站未登入時不容易完整抓取 timeline，本教材以公開可讀的整理文章為主，不視為完整 Twitter archive。

這些內容適合當作課程補充，而不是取代原本課綱。使用原則如下：

- 優先納入能幫學生建立長期可用判斷力的概念，例如 harness、context、skills、verification、human-in-the-loop。
- 避免把課程變成工具新聞或品牌比較，因為工具名稱與介面變化很快。
- 所有內容都要回到 biomedical workflow：文獻證據、資料來源、schema、validation、not found rule、human review gate。

## 推薦閱讀清單

| 補充主題 | 來源 | 適合放入課程 | 教學用途 |
| --- | --- | --- | --- |
| Agent harness | [深度拆解：AI Agent Harness 的構造](https://baoyu.io/translations/2026-05-10/akshay-pachaar-2041146899319971922) | Harness engineering | 說明 agent 的能力主要來自模型外圍的 loop、tools、memory、context、state、guardrails、verification，而不是只有模型本身 |
| Coding harness | [編程智能體的核心組件](https://baoyu.io/translations/2026-04-04/components-of-a-coding-agent) | Coding agents and CLI workflows | 說明 Codex、Claude Code 類工具如何利用 repo context、tool validation、session memory、context slimming、bounded subagents |
| Skills 實務 | [構建 Claude Code 的經驗：我們如何使用 Skills](https://baoyu.io/translations/2026-03-17/claude-code-skills-lessons) | MCP and skills for agent tools | 引導學生把常見 biomedical workflow 固化成可重用 skill，例如 PubMed evidence table、ClinVar lookup、CSV validation |
| Context / session management | [使用 Claude Code：會話管理與 100 萬上下文](https://baoyu.io/translations/claude-code-session-management) | LLM basics / loop engineering | 討論何時繼續同一 session、何時 rewind、compact、clear、開新 session 或派 subagent |
| Token / context 成本 | [Claude Code 省 Token 指南](https://baoyu.io/blog/2026-04-06/claude-code-token-optimization) | LLM basics / coding agent workflow | 補充「長 context 不是免費午餐」；教學生用檔案路徑、搜尋、摘要與任務邊界控制上下文 |
| 多 agent 模式 | [多智能體協作指南：五種主流模式怎麼選](https://baoyu.io/translations/2026-04-11/multi-agent-coordination-patterns) | Loop engineering / hackathon | 將 generator-verifier、orchestrator-subagent 對應到 evidence table 產生與 citation review |
| Codex workflow | [來自 Codex 官方團隊的分享：如何把 Codex 用到極致](https://baoyu.io/blog/2026-05-20/jxnlco-2057153744630890620) | Desktop / coding agent workflow | 補充 durable threads、tools、MCP、automations、goals、side panel review 的實際工作流觀念 |
| Agent-friendly product design | [為 Agent 設計產品](https://baoyu.io/blog/2026-04-24/teddy-riker-2047312986696454584) | MCP / tool design | 強調 tool description、context gap、rationale logging、feedback loop，讓 agent 更容易正確使用工具 |
| AI 學習取捨 | [AI 發展太快跟不上？一張四象限圖幫你做減法](https://baoyu.io/blog/ai-learning-priority-quadrant) | Lesson 02 補充 | 幫學生判斷什麼要深學、什麼只需維持地圖感、什麼可以略過 |
| Vibe coding 風險 | [為什麼我不「憑感覺編程」](https://baoyu.io/translations/2026-05-17/i-dont-vibe-code) | Vibe coding / biomedical safety | 提醒學生模型不是現實，資料抽象會遮蔽重要脈絡；不能把所有摩擦都視為壞事 |
| HTML artifacts | [使用 Claude Code：HTML 難以置信的奇效](https://baoyu.io/translations/2026-05-08/trq212-status-2052809885763747935) | Research notes / demo report | 補充 agent 可以產生可讀性更高的 HTML artifact，用於研究報告、evidence dashboard、review interface |

## 建議放入課程的位置

| 課程段落 | 可加入的補充內容 | 建議時間 |
| --- | --- | ---: |
| Lesson 02: Introduction to AI agents | AI 學習四象限、vibe coding 風險、agent 不是 chatbot | 5-8 分鐘 |
| Lesson 04: Literature search and evidence table | Generator-verifier evidence review、context management、HTML research artifact | 5-10 分鐘 |
| Lesson 06: MCP and skills | Skills 如何觸發、description 如何寫、資料與腳本如何放進 skill | 10-15 分鐘 |
| Lesson 08: Harness engineering | Agent harness 的 12 個構件、verification loop、guardrails、state | 15-20 分鐘 |
| Lesson 09: Loop engineering | Continue / rewind / compact / clear / subagent 的決策；多 agent 模式選擇 | 15-20 分鐘 |
| Hackathon | 用 generator-verifier 檢查 demo、用 goals 定義終點線 | 5 分鐘簡報 + 實作中使用 |

## 可直接拿來上課的補充活動

### 活動 1：把 Lesson 04 workflow 拆成 harness

請學生拿 Lesson 04 的 NSCLC evidence table demo，將流程拆成下列表格：

| Harness component | Lesson 04 對應物 | Biomedical 檢查點 |
| --- | --- | --- |
| Goal | 建立可查證的 NSCLC gene-drug-disease evidence table | 問題範圍、gene list、disease scope 清楚 |
| Tools | PubMed / browser / CSV / script / spreadsheet | 來源可回查，工具輸出可保存 |
| State | `task_spec.md`、`source_inventory.csv`、`evidence_table.demo.csv` | 任務狀態不只存在聊天紀錄 |
| Context | 搜尋策略、候選文獻、已驗證 PMID / DOI | 不把無關文獻全部塞進 context |
| Verification loop | PMID / DOI / sample_n / claim check | 不通過就標 `needs_review` 或 `needs_source` |
| Guardrails | not found rule、no invented PMID、no clinical recommendation | 找不到要明確標記，不能補故事 |
| Human review | 最終接受 evidence row 前人工確認 | 臨床與治療推論必須人工審核 |

討論題：

- 如果這個 workflow 出錯，最可能是哪個 harness component 失效？
- 哪些錯誤可以靠 schema 或 script 抓到？哪些必須靠 domain expert？
- 若要把這個流程重跑在另一個疾病，哪些部分應該保留？哪些部分要重寫？

### 活動 2：Context management 決策小抄

請學生判斷下列情境該怎麼做：

| 情境 | 建議操作 | 理由 |
| --- | --- | --- |
| 還在整理同一批 PMID，且剛剛才查完來源 | Continue | 目前 context 仍高度相關 |
| agent 走錯搜尋方向，但剛讀到的文獻資訊仍有用 | Rewind | 保留有用觀察，丟掉錯誤行動 |
| 對話已塞滿很多失敗 query 和不相關摘要 | Clear + 手寫交接摘要 | 新 context 比自動壓縮更乾淨 |
| 已完成一段長流程，接下來要轉成 research note | Compact | 保留重點、降低歷史負擔 |
| 需要大量搜尋候選文獻，但主流程只需要候選清單 | Subagent | 讓中間搜尋輸出留在子 context，只回傳摘要 |

課堂提醒：

- 長 context 不等於高品質 context。
- 重要的研究狀態要寫成檔案，而不是只留在聊天窗。
- 若要換任務，先寫交接摘要，再開新 session。

### 活動 3：設計 biomedical Skill

請學生設計一個 `pubmed-evidence-table` skill，不需要真的實作，但必須寫出下列欄位：

```markdown
# pubmed-evidence-table skill sketch

## Trigger
Use this skill when the user asks to build a biomedical evidence table from literature, especially when PMID, DOI, study type, sample size, disease, gene, drug, and conclusion must be tracked.

## Inputs
- research_question
- disease_scope
- gene_list
- drug_list
- inclusion_criteria
- exclusion_criteria
- output_schema

## Required outputs
- search_strategy.md
- source_inventory.csv
- evidence_table.csv
- review_notes.md

## Rules
- Do not invent PMID, DOI, sample size, or conclusion.
- Use `UNKNOWN` when a source field is not visible.
- Use `not_found` when no source supports a claim.
- Use `model_inference` when a statement is plausible but not directly sourced.
- Every row starts with `needs_human_review=TRUE`.

## Validation
- Check required columns.
- Check PMID / DOI fields are present or explicitly `NA`.
- Check each supported claim has a source.
- Check model inference is not mixed with literature evidence.
```

延伸討論：

- 這個 skill 的 description 應該寫「什麼時候使用」，不是只寫「它是什麼」。
- 如果要處理 ClinVar、COSMIC、cBioPortal 或 clinical trial，應該拆成不同 skill，避免一個 skill 承擔太多責任。

### 活動 4：Generator-verifier evidence review

把學生分成兩個角色：

| 角色 | 任務 | 禁止事項 |
| --- | --- | --- |
| Generator agent | 根據 source inventory 產生 evidence table | 不得編造 PMID、DOI、sample_n |
| Verifier agent | 逐列檢查 source 是否支持 claim | 不得重寫成看起來更漂亮但無來源的 claim |

Verifier 檢查項目：

- PMID / DOI 是否存在？
- title / journal / year 是否對得上？
- sample size 是否來自來源，而不是推測？
- claim 是否被該來源直接支持？
- evidence kind 是否應該是 `literature_evidence`、`molecular_context`、`model_inference`、`not_found` 或 `conflicting`？
- 是否需要 human review？

停止條件：

- 最多修改 2 輪。
- 若仍無法支持 claim，標記 `needs_source` 或 `not_found`。
- 不允許為了讓表格完整而降低 evidence standard。

## 可轉成投影片的重點句

- Agent 的品質常常不是模型單獨決定，而是由 harness 決定。
- Context 是稀缺資源；不要把所有東西都丟進去。
- Skill 的價值在於把可重複的 workflow 固化，不是把 prompt 包裝得更神秘。
- 多 agent 不一定比較好；只有任務可拆、邊界清楚、回傳格式明確時才值得用。
- Verification loop 是 biomedical agent 的核心，不是最後補上的格式檢查。
- Vibe coding 可以加速探索，但不能取代 evidence、schema、test 和 human review。

## 不建議作為主教材的內容

下列內容可作為課外閱讀，但不建議放入正式課程主軸：

- AI 公司商業戰略、融資、裁員、模型廠商競爭
- 每月變動的模型排名與產品傳聞
- 與 biomedical workflow 無關的產品八卦
- 只能展示新奇感、無法轉成檢查規則或 workflow 的技巧

原因很直接：本課程要訓練學生做可檢查、可追溯、可重跑的 biomedical agent workflow。凡是不能提升 artifact quality、evidence traceability、tool boundary、validation 或 human review 的內容，都只能當背景知識。
