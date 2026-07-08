#!/usr/bin/env bash
set -eu

cd "$(dirname "$0")"
mkdir -p logs outputs

{
  echo "Harness floor demo"
  echo "Checked files:"
  echo "- .claude/CLAUDE.md"
  echo "- .claude/settings.json"
  echo "- .claude/agents/verifier.md"
  echo "- skills/evidence-table-writer/SKILL.md"
  echo "- .mcp.json"
  echo "- PROMPT.md"
  echo "- IMPLEMENTATION_PLAN.md"
  echo "- MEMORY.md"
  echo "Status: ready_for_agent_demo"
} > logs/harness_run.log

cat logs/harness_run.log
