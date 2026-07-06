# Lesson 07 Mini Lab: Biomedical Summary Loop

這個 lab 示範一個小型 loop：

```text
plan -> generate -> evaluate -> rule_check -> revise -> report
```

預設使用 mock mode，不需要 API key，也不需要網路。目標是讓學生先看懂 loop 的結構與停止條件。

## 執行方式

```bash
python3 scripts/loop_demo.py
python3 scripts/check_summary.py outputs/final_summary.md evidence_table.csv
```

產出檔案：

- `outputs/draft_summary.md`
- `outputs/final_summary.md`
- `outputs/issue_log.json`
- `outputs/loop_report.json`

## 課堂任務

1. 跑一次 mock loop。
2. 打開 `outputs/issue_log.json`，觀察第一輪 evaluator 找到什麼問題。
3. 打開 `outputs/final_summary.md`，確認修正後每個 claim 都有 source ID。
4. 修改 `question.md` 的需求，例如把字數改成 120 words，再討論 checker 要怎麼改。

