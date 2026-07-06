# Lesson 06 Mini Lab: Biomedical Agent Harness Config

這個 mini lab 用來示範：agent harness 的安全設定可以被程式檢查。

目標不是寫完整 agent，而是學會把「不能亂讀、不能亂寫、不能亂上網、不能偷存 PHI」變成可驗證規則。

## 使用方式

```bash
python3 scripts/check_harness_config.py harness_config.safe.yaml
python3 scripts/check_harness_config.py harness_config.unsafe.yaml
```

預期結果：

- `harness_config.safe.yaml` 應該通過。
- `harness_config.unsafe.yaml` 應該列出多個錯誤。

## 課堂練習

1. 先跑 unsafe config，觀察錯誤。
2. 修改 unsafe config，讓它通過 validator。
3. 加上一條新規則：如果 `human_review_required_if` 沒有包含 `clinical_action`，就報錯。
4. 討論：哪些規則可以機器檢查？哪些仍然需要 human-in-the-loop？

