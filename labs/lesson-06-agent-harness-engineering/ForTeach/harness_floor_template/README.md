# Harness Floor Template

這個資料夾示範一個 biomedical agent harness 可以怎麼落成檔案結構。

重點不是工具多，而是每個設定都有地方放：

- `.claude/CLAUDE.md`: agent 的固定工作規則。
- `.claude/settings.json`: 權限、approval、allowed tools。
- `.claude/agents/verifier.md`: evaluator / verifier 的角色規格。
- `skills/evidence-table-writer/SKILL.md`: evidence table 任務 SOP。
- `.mcp.json`: 外部工具 server 的設定位置。
- `PROMPT.md`: 本次任務需求。
- `IMPLEMENTATION_PLAN.md`: loop 的步驟與停止條件。
- `MEMORY.md`: 可保留的專案記憶。
- `run.sh`: 穩定 demo 入口。
- `logs/`: 執行紀錄。

## Demo

```bash
bash run.sh
```

預期會產生：

```text
logs/harness_run.log
```

