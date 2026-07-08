# Lesson 06 Mini Lab: Biomedical Agent Harness Config

這個 mini lab 用來示範：agent harness 的安全設定可以被程式檢查。

目標不是寫完整 agent，而是學會把「不能亂讀、不能亂寫、不能亂上網、不能偷存 PHI」變成可驗證規則。

這版 lab 也加入三個新的 harness 設計重點：

- observability: 每個 harness component、每段經驗、每個設計決策都要可追查。
- full trajectory audit: 不只檢查最後答案，也要檢查中間有沒有越權讀檔、亂傳資料或跳過驗證。
- state externalization: 把任務進度、artifact、verification record 放在 harness 管理，不要全部塞在 prompt 或聊天紀錄裡。

另外新增 `harness_floor_template/`，用來示範文章裡提到的精神：

> The harness is the floor.

也就是說，harness 不是一段更長的 prompt，而是一組放在 repo 裡的固定檔案：指令、工具設定、skill、prompt、plan、memory、run script 和 logs。

## 使用方式

```bash
bash demo.sh
```

或是逐步跑：

```bash
bash harness_floor_template/biomed-loop/run.sh
python3 scripts/check_harness_config.py harness_config.safe.yaml
python3 scripts/check_harness_config.py harness_config.unsafe.yaml
```

預期結果：

- `demo.sh` 會依序展示 harness floor、safe config、unsafe config。
- `harness_floor_template/biomed-loop/run.sh` 應該產生 `logs/harness_run.log`。
- `harness_config.safe.yaml` 應該通過。
- `harness_config.unsafe.yaml` 應該列出多個錯誤。

## 課堂練習

1. 先跑 unsafe config，觀察錯誤。
2. 修改 unsafe config，讓它通過 validator。
3. 打開 `harness_floor_template/biomed-loop/`，說出每個檔案負責哪一層 harness。
4. 加上一條新規則：如果 `human_review_required_if` 沒有包含 `clinical_action`，就報錯。
5. 加上一條新規則：如果 `audit.information_flow` 沒有開，就報錯。
6. 討論：哪些規則可以機器檢查？哪些仍然需要 human-in-the-loop？
