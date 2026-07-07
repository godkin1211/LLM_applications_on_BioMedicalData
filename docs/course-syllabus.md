# 醫療大數據：生醫資料庫與人工智慧應用 - AI agent 課程細綱

_課程細綱版本：2026-07-05。對象為大學生、研究生與生醫研究相關業界人士。_

---

## 課程定位

本課程聚焦於如何把 AI agent 與大型語言模型放進可檢查、可重現、可追溯的 biomedical workflow。課程不以「prompt 技巧」為主，而是讓學生理解 agent 的工程結構：目標、模型、工具、狀態、證據、驗證、迴圈與人工審查。

課程總時數為 18 小時，三天授課，每天 6 小時。每天固定包含上午休息、午休與下午休息。第一堂課保留原訂安排：`Course introduction`，時間為 7/11 08:30-09:00。

## 學習目標

完成課程後，學生應能做到以下事項：

- 說明 AI agent 與 chatbot 的差異，並畫出基本 agent loop
- 解釋 LLM 的基本使用邊界，包括 token、context window、embedding、hallucination 與 tool use
- 把模糊 prompt 改寫成可檢查的 task spec
- 使用 desktop agent 或 coding agent 協助文獻搜尋、資料整理、程式開發與研究筆記
- 設計 biomedical workflow 的 evidence table、citation check、not found rule 與 human review gate
- 理解 harness engineering 與 loop engineering 在 agent workflow 中的角色
- 完成一個小型 biomedical agent workflow demo，並能說明其輸入、輸出、資料來源、驗證方式與限制

## 核心觀念

| 主題 | 課程中的定位 | 學生要帶走的判斷 |
| --- | --- | --- |
| AI agent | 把 LLM 放進工具、狀態與回饋迴圈 | Agent 不是單次聊天，而是可操作與可檢查的 workflow |
| LLM basics | 理解模型行為與失敗模式 | 流暢輸出不等於正確，尤其不能替代 biomedical database |
| Desktop agent | 研究工作流的實用入口 | 可用於讀檔、查資料、整理證據與產出初稿 |
| Coding agent | repo-grounded 的開發與除錯助手 | 需要明確規格、版本控制、測試與人工 review |
| Spec-driven development | 把需求轉成可執行規格 | 好規格比好 prompt 更能讓 agent 穩定工作 |
| Harness engineering | 替 agent 建立可測、可記錄、可重跑的外部架構 | 要有 fixtures、tool contract、schema、logs、eval cases 與 failure policy |
| Loop engineering | 設計 observe、evaluate、revise、stop 的迴圈 | 可靠 agent 需要停止條件、重試策略、檢查點與 human-in-the-loop |
| Biomedical safety | 將安全要求轉成工程規則 | 臨床、藥物、variant、citation 與 causal claim 都需要外部驗證 |

## 三天總時程

| 日期 | 時間 | 課程 | 時數 | 主要產出 |
| --- | --- | --- | ---: | --- |
| 7/11 | 08:30-09:00 | Course introduction | 0.5 | 課程定位與學習路線圖 |
| 7/11 | 09:00-10:00 | Introduction to AI agents, vibe coding, and desktop utilities | 1.0 | Agent loop 與使用情境判斷 |
| 7/11 | 10:00-10:20 | 休息 | - | - |
| 7/11 | 10:20-11:50 | Basics behind a large language model | 1.5 | 可檢查 task spec 初稿 |
| 7/11 | 11:50-13:00 | 午休 | - | - |
| 7/11 | 13:00-14:30 | Desktop agent workflow: literature search, evidence table, research notes | 1.5 | Evidence table 與 research note |
| 7/11 | 14:30-14:50 | 休息 | - | - |
| 7/11 | 14:50-16:20 | Hands-on Lab 1: desktop biomedical workflow | 1.5 | 可重現的桌面 agent 工作流程紀錄 |
| 7/12 | 08:30-10:00 | MCP and skills for agent tools | 1.5 | 工具清單與安全邊界 |
| 7/12 | 10:00-10:20 | 休息 | - | - |
| 7/12 | 10:20-11:50 | Coding agents and CLI workflows | 1.5 | repo-grounded agent 操作流程 |
| 7/12 | 11:50-13:00 | 午休 | - | - |
| 7/12 | 13:00-14:30 | Spec-driven development for biomedical workflows | 1.5 | `SPEC.md` 與 acceptance criteria |
| 7/12 | 14:30-14:50 | 休息 | - | - |
| 7/12 | 14:50-16:20 | Harness engineering for AI agents | 1.5 | Harness checklist 與 eval cases |
| 7/13 | 08:30-10:00 | Loop engineering for biomedical agents | 1.5 | Loop design 與停止條件 |
| 7/13 | 10:00-10:20 | 休息 | - | - |
| 7/13 | 10:20-11:50 | Biomedical hackathon: task framing and scaffold | 1.5 | 專題 task spec 與 scaffold |
| 7/13 | 11:50-13:00 | 午休 | - | - |
| 7/13 | 13:00-14:30 | Biomedical hackathon: build, test, and evidence check | 1.5 | 可展示 demo 與 evidence trail |
| 7/13 | 14:30-14:50 | 休息 | - | - |
| 7/13 | 14:50-16:20 | Presentation and demo | 1.5 | 小組展示、QA 與課程收束 |

## Day 1: foundations and desktop workflow

### 1. Course introduction

| 項目 | 內容 |
| --- | --- |
| 時間 | 7/11 08:30-09:00 |
| 投影片 | `slides/course-introduction-ai-agent-biomedical-workflow.pptx` |
| 教學目標 | 建立課程期待、說明 biomedical workflow 的風險與本課程的工程化取向 |
| 核心問題 | 為什麼 biomedical AI agent 不能只追求方便，還必須追求可檢查與可追溯 |

細項內容：

- 課程名稱、授課對象、三天學習路線與每日產出
- AI 工具在研究中的合理定位：協助整理、查找、草擬、檢查、開發
- Biomedical workflow 的特殊風險：錯 citation、錯 gene symbol、錯 variant、錯資料版本、錯臨床推論
- 本課程的安全邊界：不處理真實病人識別資料，不把 LLM 輸出當成診斷或治療建議
- 最終專題說明：不是展示炫技 demo，而是展示有 evidence trail、verification gate 與 human review 的工作流程

學生產出：

- 知道三天課程如何從 LLM basics 推進到 desktop workflow、coding agent、harness、loop 與 hackathon

### 2. Introduction to AI agents, vibe coding, and desktop utilities

| 項目 | 內容 |
| --- | --- |
| 時間 | 7/11 09:00-10:00 |
| 投影片 | `slides/lesson-02-ai-agents-vibe-coding-desktop-utilities.pptx` |
| 教學目標 | 讓學生理解 agent 和 chatbot 的差異，並能判斷 vibe coding 與 desktop utilities 適合用在哪些研究情境 |
| 核心問題 | AI agent 比 chatbot 多了什麼，為什麼 biomedical workflow 必須設計 verification |

細項內容：

- Chatbot 與 agent 的差異
  - Chatbot 主要回答使用者輸入
  - Agent 會在目標、工具、狀態與回饋之間反覆操作
  - Agent 的價值不只在生成文字，而在於可以連接外部工具與資料
- Agent 的基本組件
  - Goal：任務目標與成功條件
  - Model：LLM call 與 decision point
  - Tools：browser、terminal、database、script、API
  - State：任務記憶、檔案、log、版本資訊
  - Action loop：plan、act、observe、verify、revise、stop
  - Human review：高風險輸出需要人工判斷
- Claude、Gemini、Codex、Copilot、Perplexity、Antigravity 類工具的使用場景比較
  - Claude 類：長文推理、文件整理、研究筆記與摘要初稿
  - Gemini 類：長 context、多模態資料理解、Google 生態整合與大量文件對照
  - Codex 類：repo-grounded 程式修改、測試、diff review 與 CLI workflow
  - Copilot 類：IDE 內即時補完、局部重構與常用 API 輔助
  - Perplexity 類：web-grounded 搜尋、文獻線索、citation 與來源追蹤
  - Antigravity 類：agentic IDE、多 agent 工作、browser / terminal 操作與可驗證 artifacts
  - 工具選擇要回到 artifact、檢查點與 biomedical 風險，而不是只看品牌名稱
- Vibe coding 的合理使用方式
  - 適合快速探索、草擬 prototype、改寫小工具、產生測試案例
  - 不適合無規格地產生大型系統或高風險分析結論
  - 要求 agent 說明假設、列出改動、跑測試、留下 commit
- Desktop utilities 的角色
  - 文獻搜尋與摘要
  - PDF 或網頁資訊整理
  - 表格與研究筆記生成
  - 與 terminal、檔案系統、瀏覽器和資料庫工具銜接
- Biomedical 使用情境
  - 建立 gene-drug-disease evidence table
  - 整理研究問題與搜尋策略
  - 比對資料來源與欄位定義
  - 將文獻或資料庫查詢結果轉成可審核筆記

課堂活動：

- 以「找出 EGFR、ALK、TP53 與肺癌治療或研究關聯」為例，請學生畫出一個最小 agent loop
- 標出哪些步驟可以由 LLM 協助，哪些步驟必須使用外部來源或人工確認

學生產出：

- 一張 biomedical agent loop 草圖
- 一份初步風險清單，列出 citation、gene symbol、variant、drug claim 與 clinical claim 的檢查方式

### 3. Basics behind a large language model

| 項目 | 內容 |
| --- | --- |
| 時間 | 7/11 10:20-11:50 |
| 投影片 | `slides/lesson-03-llm-basics-for-agent-users.pptx` |
| 教學目標 | 讓非模型開發背景的學生理解 LLM 在 agent workflow 中的能力邊界 |
| 核心問題 | LLM 為什麼可以很好用，但仍然不能被當成 biomedical database |

細項內容：

- LLM 不是資料庫
  - LLM 產生的是最像答案的文字
  - 資料庫查詢則是回傳可追溯紀錄
  - 研究流程要區分 language layer 與 evidence layer
- Next-token prediction
  - 模型根據 context 預測下一個 token
  - 機率最高不代表事實正確
  - 流暢文字常常讓錯誤看起來合理
- Token 與 context window
  - Token 不是一定等於一個字
  - Context window 是模型當下可見的工作材料
  - 長文件、PDF、表格與程式碼不能假設全部都被模型穩定使用
- Embedding 與 retrieval
  - Embedding 用於找語意相近內容
  - Retrieval 可以幫助找可能相關的 evidence
  - 相近不等於正確，retrieval 後仍需來源檢查
- Prompt packet 的分層
  - System prompt：角色、規則、限制
  - User task：本次任務要求
  - Context：工作材料
  - Retrieved content：外部取回證據
  - Tool result：工具或程式輸出
- Hallucination 的常見來源
  - 編造 citation、PMID、DOI
  - 混合相似概念
  - 把推測寫成結論
  - 缺 evidence 時仍然回答
- Biomedical failure modes
  - Gene symbol 舊名或物種混淆
  - Variant HGVS 或 genome build 錯誤
  - Drug indication 與 evidence level 混淆
  - Clinical claim 過度推論
- Reasoning 的限制
  - 模型可以摘要、比較、規劃、推理
  - 推理若建立在錯誤事實上，結論仍然錯
  - 需要資料來源、程式輸出、統計假設與人工判斷的 verification gate
- Tool use 與 function calling
  - LLM 可決定呼叫工具
  - 工具可執行查詢、計算、讀檔與跑程式
  - 工具輸出必須結構化，才能檢查與重跑
- Temperature 與 reproducibility
  - 高 temperature 產生較多樣輸出
  - 低 temperature 較穩定，但不等於完全可重現
  - 要保存 model、prompt、context、工具版本與資料版本

課堂活動：

- 將模糊 prompt「分析這些基因和癌症的關係，整理成表格」改寫成可檢查 task spec
- 要求補上 input、output schema、evidence source、not found rule、citation rule 與 review rule

學生產出：

- 一版可檢查的 biomedical LLM task spec

### 4. Desktop agent workflow: literature search, evidence table, research notes

| 項目 | 內容 |
| --- | --- |
| 時間 | 7/11 13:00-14:30 |
| 投影片 | `slides/lesson-04-desktop-agent-literature-evidence-workflow.pptx` |
| Demo bundle | `demos/lesson-04-literature-evidence-workflow/` |
| 教學目標 | 示範如何把 desktop agent 用在文獻搜尋、證據表與研究筆記 |
| 核心問題 | 如何讓 agent 產出的 evidence table 能被人檢查，而不是只有看起來整齊 |

細項內容：

- 研究問題拆解
  - 定義研究主題、gene list、disease scope、資料類型與輸出格式
  - 區分探索性問題與需要嚴格查證的問題
- Literature search workflow
  - 從研究問題產生搜尋 query
  - 搜尋結果要保留來源、日期、關鍵字與排除條件
  - PMID、DOI、title、journal、year 必須能回查
- Evidence table schema
  - Entity：gene、variant、drug、disease、pathway
  - Evidence：source、claim、evidence level、context、species、cohort
  - Trace：PMID、DOI、URL、retrieved date、quoted span 或 source note
  - Status：supported、conflicting、not found、needs review
- Research note structure
  - Problem statement
  - Search strategy
  - Evidence table
  - Unresolved questions
  - Human review notes
  - Next actions
- Tool selection
  - Desktop agent 用於搜尋、讀檔、摘要、整理與草擬
  - Browser 用於確認來源
  - Spreadsheet 或 Markdown table 用於保存結構化結果
  - Terminal 或 script 用於資料清理與格式驗證

示範流程：

1. 給定一個 gene-disease 問題
2. 要求 agent 產生 search strategy
3. 取回候選文獻並建立 evidence table
4. 人工抽查 PMID、DOI 與 claim
5. 將結果整理成 research note

學生產出：

- 一份 evidence table
- 一份 research note 草稿

### 5. Hands-on Lab 1: desktop biomedical workflow

| 項目 | 內容 |
| --- | --- |
| 時間 | 7/11 14:50-16:20 |
| 教學目標 | 讓學生實作第一個可重現的 desktop agent 工作流程 |
| 核心問題 | 如何把 agent 的操作變成之後能檢查、能重跑、能交接的工作紀錄 |

實作任務：

- 選擇一個 biomedical mini-task
  - Gene-disease evidence table
  - Drug-gene relation summary
  - Variant interpretation evidence collection
  - Dataset metadata summary
- 寫出 task spec
- 使用 desktop agent 執行搜尋、摘要或整理
- 將輸出整理為 evidence table
- 抽查至少 3 個 claim 的來源
- 記錄哪些地方需要 human review

學生產出：

- `task_spec.md`
- `evidence_table.md` 或 `evidence_table.csv`
- `research_note.md`
- 一段簡短 reflection：agent 幫了什麼、哪裡不可信、如何檢查

## Day 2: tools, coding agents, specs, and harnesses

### 6. MCP and skills for agent tools

| 項目 | 內容 |
| --- | --- |
| 時間 | 7/12 08:30-10:00 |
| 教學目標 | 讓學生理解 agent 如何透過工具、connector、skills 與外部資源互動 |
| 核心問題 | 工具越多不代表越安全，如何設計工具邊界與權限 |

細項內容：

- MCP 的基本概念
  - Tool：讓 agent 執行具體動作
  - Resource：讓 agent 讀取結構化或非結構化資料
  - Prompt 或 skill：封裝任務流程與 domain-specific 指令
  - Connector：連接外部服務或資料來源
- 工具選擇原則
  - 優先使用可追溯、可驗證、可重跑的工具
  - 高風險任務要限制寫入、刪除、寄送與外部 side effect
  - 讀資料與改資料要分開授權
- Biomedical tool examples
  - Literature lookup
  - Gene and variant database lookup
  - Clinical trial or drug database lookup
  - Local script execution
  - Spreadsheet or CSV transformation
- 安全與權限
  - 不把敏感資料直接丟給不受控服務
  - 不讓 agent 自動做臨床決策
  - 工具呼叫要保留輸入、輸出、時間與版本

課堂活動：

- 針對一個 biomedical task，列出需要的工具清單
- 將工具分成 read-only、write、external action 與 human approval required

學生產出：

- 一份 tool inventory
- 一份 permission boundary checklist

### 7. Coding agents and CLI workflows

| 項目 | 內容 |
| --- | --- |
| 時間 | 7/12 10:20-11:50 |
| 投影片 | `slides/lesson-07-coding-agents-cli-workflows.pptx` |
| Lab bundle | `labs/lesson-07-coding-agents-cli-workflows/` |
| 教學目標 | 讓學生學會用 coding agent 處理 repo-grounded 的開發、除錯與資料處理任務 |
| 核心問題 | 如何讓 coding agent 讀實際程式與資料，而不是憑空建議 |

細項內容：

- Coding agent 的使用情境
  - 讀懂既有程式碼
  - 撰寫小型資料清理腳本
  - 加上輸入驗證與錯誤訊息
  - 補測試與修 bug
  - 產生 README 或使用說明
- CLI agent 基本工作流
  - 先讀 repo、資料與測試
  - 再提出小範圍 plan
  - 修改檔案
  - 執行測試或驗證命令
  - 回報 diff、風險與未完成處
- Git workflow
  - 每個任務小 commit
  - 不混入無關重構
  - 不覆蓋他人變更
  - 重要輸出要能由 commit 追溯
- Biomedical coding examples
  - 將文獻表格轉成乾淨 CSV
  - 檢查 gene symbol 欄位格式
  - 將 JSON 或 HTML 報告抽成 table
  - 產生資料處理 pipeline 的 validation report
- Seqera AI / Co-Scientist for bioinformatics workflow development
  - 將 Seqera AI 定位成 Nextflow、nf-core 與 Seqera Platform context 的 domain coding agent
  - 使用 `seqera ai` 協助設計、檢查與除錯 Nextflow pipeline
  - 讓一般 coding agent 負責 repo patch、測試與 diff，讓 Seqera AI 負責 workflow domain review
  - 以 prompt 明確要求不要未經同意啟動 cloud run、修改 workspace 或使用敏感資料
  - 將 Seqera AI 的建議轉成可 review 的 patch plan、local validation commands 與 human approval checklist

課堂活動：

- 給定一個小型資料表或腳本，要求 coding agent：
  - 讀取現有檔案
  - 加入欄位檢查
  - 產生 summary report
  - 回報測試方式
- 補充活動：給定一個 toy Nextflow scaffold，要求學生設計 Seqera AI prompt：
  - 提供 `sample_manifest.csv`、`nextflow/main.nf` 與 `nextflow.config` context
  - 要求 Seqera AI 回報 DSL2、params、channel、process I/O 與 test profile 可能問題
  - 要求它只提出 local validation commands，不得自行啟動 cloud execution

學生產出：

- 一個小 patch 或 pseudo-patch plan
- 一段驗證紀錄，包含執行了哪些 command 與結果
- 一份 Seqera AI / Nextflow review prompt，包含外部 action approval boundary

### 8. Spec-driven development for biomedical tools

| 項目 | 內容 |
| --- | --- |
| 時間 | 7/12 13:00-14:30 |
| 投影片 | `slides/lesson-08-spec-driven-development-biomedical-tools.pptx` |
| Lab bundle | `labs/lesson-08-spec-driven-development-biomedical-tools/` |
| 教學目標 | 讓學生把研究任務轉成 agent 可執行、可驗證、可測試的規格 |
| 核心問題 | 為什麼清楚的規格比更長的 prompt 更重要 |

細項內容：

- Spec 的基本欄位
  - Goal：任務目的
  - Inputs：輸入資料、格式與版本
  - Constraints：限制、排除條件、安全邊界
  - Evidence sources：允許使用的資料來源
  - Output schema：欄位、格式、允許值
  - Checks：驗證規則與錯誤處理
  - Not found rule：找不到證據時要明確標記，不得編造
  - Review rule：哪些輸出必須人工確認
- Acceptance criteria
  - 每個 claim 都有來源
  - 每個資料欄位都符合 schema
  - 找不到資料時填入 `not found`
  - 程式輸出能重跑
  - 風險欄位標記 `needs review`
- Spec 與 prompt 的差異
  - Prompt 是一次對話指令
  - Spec 是可執行合約
  - Spec 可被 agent、助教、同學、未來自己重複使用
- SDD 的實務取捨
  - SDD 可降低 vibe coding 的猜測空間
  - 過厚文件會造成 review 負擔與 spec drift
  - 生醫工具適合使用輕量、可驗證、可版本控制的 `SPEC.md`
  - Spec Kit、OpenSpec、Spectra 類工具可作為 scaffold，但不能取代 biomedical evidence rule 與人工審查
- Spectra demo
  - 使用 `/spectra:discuss` 先把 PubMed evidence extractor 的需求收斂
  - 使用 `/spectra:propose` 產生 proposal、spec、design 與 tasks
  - 在 `/spectra:apply` 前人工檢查 PMID traceability、not found rule、model inference 與 review gate
  - 發現規格缺口時使用 `/spectra:ingest` 更新 artifacts，而不是讓 agent 直接補功能
  - 完成後使用 `/spectra:archive` 歸檔並保留 trace
- Biomedical spec 範例
  - PubMed evidence extractor：要求 PMID、study type、claim、evidence status 與 not found rule
  - Gene list annotation tool：要求 approved symbol、species、match type、source version 與 ambiguity handling
  - Clinical trial summarizer：要求 NCT ID、retrieved date、source fields、eligibility summary 與 human review gate

課堂活動：

- 將 Day 1 的 task spec 擴充成 `SPEC.md`
- 補上 output schema、acceptance criteria 與 failure modes
- 從三個 biomedical tool 範例中選一個，寫出：
  - clarification questions
  - input / output schema
  - boundary conditions
  - error handling
  - validation command
  - agent handoff prompt
- Spectra demo 活動：
  - 用 PubMed evidence extractor 範例跑一次 discuss、propose、review、apply、ingest 的流程
  - 比較 Spectra 產生的 artifacts 是否符合 biomedical spec checklist

學生產出：

- 一份 `SPEC.md`
- 一份簡短 acceptance checklist
- 一份可交給 coding agent 的 implementation prompt
- 一份 Spectra demo artifact review note

### 9. Harness engineering for AI agents

| 項目 | 內容 |
| --- | --- |
| 時間 | 7/12 14:50-16:20 |
| 教學目標 | 讓學生理解如何替 agent 建立可測、可記錄、可重跑的外部架構 |
| 核心問題 | 如何避免 agent 只在 demo 當下看起來成功，卻無法檢查與重現 |

定義：

> Harness engineering 是替 agent 建立執行環境、工具合約、測試案例、輸入輸出 schema、紀錄格式與驗證規則的工程工作。它的目標是讓 agent workflow 可以被測試、比較、除錯與維護。

細項內容：

- Harness 的組成
  - Task spec
  - Tool contract
  - Input fixtures
  - Output schema
  - Evaluation cases
  - Log format
  - Error taxonomy
  - Human review gate
- Tool contract
  - 每個工具的輸入欄位
  - 每個工具的輸出欄位
  - 錯誤格式
  - 版本與資料來源
- Evaluation cases
  - 正常案例
  - 找不到資料案例
  - 衝突證據案例
  - 錯誤 gene symbol 或 variant 格式案例
  - 高風險 clinical claim 案例
- Logging and traceability
  - 保存 prompt、context、tool input、tool output
  - 保存模型版本、資料版本、執行時間
  - 保存人工修改與 review note
- Failure policy
  - 何時重試
  - 何時停止
  - 何時回報 `needs review`
  - 何時拒絕回答或要求更多資料

課堂活動：

- 為 Day 1 或 Day 2 的任務設計最小 harness
- 寫出 3 個 eval cases：正常、not found、conflicting evidence

學生產出：

- `harness_checklist.md`
- `eval_cases.md`
- 一份 output schema 草案

## Day 3: loops and biomedical hackathon

### 10. Loop engineering for biomedical agents

| 項目 | 內容 |
| --- | --- |
| 時間 | 7/13 08:30-10:00 |
| 教學目標 | 讓學生理解如何設計 agent 的反覆檢查、修正與停止機制 |
| 核心問題 | Agent 的可靠性不是來自一次回答，而是來自設計良好的 loop |

定義：

> Loop engineering 是設計 agent 在任務中如何 observe、evaluate、revise、retry、ask for help 與 stop 的工程工作。它讓 agent 不只是會做事，也知道何時要檢查、何時要修正、何時要停止。

細項內容：

- Loop 的基本結構
  - Plan：拆任務與設定成功條件
  - Act：呼叫工具或產生輸出
  - Observe：讀取工具結果或檔案狀態
  - Evaluate：檢查 schema、來源與風險
  - Revise：修正 query、prompt、程式或表格
  - Stop：達到條件、超出預算、證據不足或需要人工判斷
- Biomedical loop examples
  - 文獻搜尋結果不足時改 query
  - 找不到 DOI 時標記 `not found`
  - gene symbol 無法標準化時要求人工確認
  - tool output 與 LLM summary 不一致時停止並回報
- Stop criteria
  - 已達 acceptance criteria
  - 無法找到可靠來源
  - 工具連續失敗
  - 輸出涉及 clinical action
  - 超過時間、token 或 cost budget
- Metrics
  - Citation validity
  - Schema pass rate
  - Not found honesty
  - Human review burden
  - Re-run consistency
  - Error recovery rate
- Loop 與 harness 的關係
  - Harness 提供測試與紀錄環境
  - Loop 定義何時檢查、修正與停止
  - 兩者合在一起才是可維護的 agent workflow

課堂活動：

- 將一個線性 prompt 改成 loop design
- 設計至少 3 個檢查點與 2 個停止條件

學生產出：

- `loop_design.md`
- 一張 plan-act-observe-evaluate-revise-stop 流程表

### 11. Biomedical hackathon: task framing and scaffold

| 項目 | 內容 |
| --- | --- |
| 時間 | 7/13 10:20-11:50 |
| 教學目標 | 讓小組把專題問題縮小成可在下午完成的 agent workflow |
| 核心問題 | 如何把有趣的研究問題縮成可 demo、可檢查、可解釋的最小版本 |

專題方向：

- Literature evidence table builder
- Gene-drug-disease relation summarizer
- Variant annotation evidence collector
- Cohort eligibility criteria extractor
- Dataset metadata and data dictionary assistant
- Biomedical protocol or pipeline helper

Scaffold 內容：

- Problem statement
- Input data and allowed sources
- Output schema
- Task spec
- Tool inventory
- Harness checklist
- Loop design
- Evidence check rule
- Human review boundary
- Demo plan

課堂活動：

- 小組選題
- 寫出最小可行 task spec
- 決定工具與資料來源
- 建立 demo folder 結構
- 和老師或助教確認 scope

學生產出：

- `project_spec.md`
- `tool_inventory.md`
- `demo_plan.md`

### 12. Biomedical hackathon: build, test, and evidence check

| 項目 | 內容 |
| --- | --- |
| 時間 | 7/13 13:00-14:30 |
| 教學目標 | 完成小型 biomedical agent workflow demo，並留下可檢查紀錄 |
| 核心問題 | 如何讓 demo 不只是跑出結果，而是能說明來源、檢查與限制 |

實作要求：

- 至少使用一個 agent-assisted step
- 至少使用一個外部來源或工具檢查 step
- 至少產出一個結構化結果
- 至少保留一份 evidence trail
- 至少列出一個失敗或不確定案例
- 清楚標記 human review gate

建議 demo folder：

```text
project/
  project_spec.md
  task_spec.md
  evidence_table.md
  loop_design.md
  harness_checklist.md
  logs/
  outputs/
  demo_notes.md
```

助教檢查點：

- Scope 是否過大
- Output schema 是否清楚
- Evidence source 是否可回查
- Not found rule 是否真的執行
- 是否有停止條件
- 是否避免 clinical overclaim

學生產出：

- 可展示 demo
- evidence table 或 structured output
- demo notes

### 13. Presentation and demo

| 項目 | 內容 |
| --- | --- |
| 時間 | 7/13 14:50-16:20 |
| 教學目標 | 讓學生用工程方式展示 agent workflow，而不是只展示漂亮答案 |
| 核心問題 | 這個 workflow 怎麼知道自己何時可信、何時不可信、何時需要人 |

展示格式：

- 5 分鐘 demo
- 3 分鐘 QA
- 每組需展示輸入、輸出、工具、來源、檢查點與限制

展示內容：

- Problem：解決什麼 biomedical task
- Spec：任務範圍、輸入、輸出與限制
- Agent workflow：模型、工具、state、loop
- Evidence trail：如何保存與檢查來源
- Harness：使用哪些 eval cases 或 validation checks
- Loop：如何 retry、revise 或 stop
- Safety boundary：哪些地方必須 human review
- Limitation：哪些結果不能直接相信

評量規準：

| 項目 | 比重 | 判斷標準 |
| --- | ---: | --- |
| Problem framing | 20% | 問題明確、scope 合理、輸入輸出清楚 |
| Evidence and traceability | 25% | claim 可回查、來源保存、not found 不編造 |
| Harness design | 20% | schema、eval cases、logs、failure policy 清楚 |
| Loop and safety | 20% | 有檢查點、停止條件與 human review gate |
| Demo clarity | 15% | 展示順暢、能回答限制與風險 |

學生產出：

- 最終 demo
- 小組口頭報告
- 一份簡短 retrospective：下次要改進的 workflow 設計

## 建議教材與檔案對應

| 檔案 | 用途 | 狀態 |
| --- | --- | --- |
| `slides/course-introduction-ai-agent-biomedical-workflow.pptx` | Day 1 第 1 堂，課程介紹 | 已完成 |
| `slides/lesson-02-ai-agents-vibe-coding-desktop-utilities.pptx` | Day 1 第 2 堂，AI agents、vibe coding、desktop utilities | 已完成 |
| `slides/lesson-03-llm-basics-for-agent-users.pptx` | Day 1 第 3 堂，LLM basics | 已完成 |
| `slides/lesson-04-desktop-agent-literature-evidence-workflow.pptx` | Day 1 第 4 堂，文獻搜尋、evidence table、research notes | 已完成 |
| `demos/lesson-04-literature-evidence-workflow/` | Lesson 04 完整 demo：task spec、prompts、source inventory、evidence table、research note | 已完成 |
| `slides/lesson-05-biomedical-evidence-table-hands-on.pptx` | Day 1 第 5 堂，desktop biomedical workflow hands-on lab | 已完成 |
| `docs/supplement-baoyu-agent-practices.md` | 宝玉 LLM / agent 實務分享延伸教材：harness、context、skills、多 agent、verification activities | 已完成 |
| `docs/course-syllabus.md` | 本課程詳細課綱 | 本文件 |

後續投影片建議依照下列順序製作：

1. MCP and skills for agent tools
2. Coding agents and CLI workflows
3. Spec-driven development for biomedical workflows
4. Harness engineering for AI agents
5. Loop engineering for biomedical agents
6. Biomedical hackathon scaffold and demo rubric

## 教學設計原則

- 每堂課都要連回 biomedical workflow，不只講一般 AI agent 概念
- 每個工具都要有使用邊界、風險與檢查方式
- 每個 LLM 輸出都應盡量轉成結構化結果，例如 table、schema、checklist、log 或 spec
- 每個 biomedical claim 都要能被 evidence source 支撐，找不到時要明確標記
- 實作活動要小而完整，避免讓學生把時間花在過大 scope
- Hackathon 的重點是 workflow 品質，不是答案看起來完整

## 課前準備建議

學生建議具備：

- 基本檔案管理能力
- 基本 Markdown 閱讀與撰寫能力
- 基本表格資料概念
- 至少了解一種 biomedical database 或文獻查詢工具

授課前建議準備：

- 一組不含敏感資料的 biomedical mini-task examples
- 一份 gene-disease 或 drug-gene evidence table 範例
- 一份 `SPEC.md` 範本
- 一份 `harness_checklist.md` 範本
- 一份 `loop_design.md` 範本
- 一份 hackathon demo folder 範本

## 課程產出清單

學生三天下來應至少留下以下產出：

- `task_spec.md`
- `evidence_table.md` 或 `evidence_table.csv`
- `research_note.md`
- `tool_inventory.md`
- `SPEC.md`
- `harness_checklist.md`
- `eval_cases.md`
- `loop_design.md`
- `project_spec.md`
- `demo_notes.md`

這些檔案共同構成一個最小但完整的 biomedical agent workflow portfolio。
