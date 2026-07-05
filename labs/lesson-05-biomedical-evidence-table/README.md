# Lesson 05 Hands-on Lab: Biomedical Evidence Table

This lab teaches a safe AI-agent workflow for building a biomedical evidence table.

The goal is not to trust the agent's first answer. The goal is to produce a human-reviewed table with source IDs, quoted evidence, confidence labels, and reviewer corrections.

## Files

- `question.md`: focused research question and scope.
- `task_spec.md`: instructions for Codex, Gemini, or another AI agent.
- `evidence_table.csv`: the student working table.
- `review_checklist.md`: manual review log.
- `final_summary.md`: final 5-8 sentence summary.
- `scripts/check_table.py`: validation script for CSV structure and required fields.
- `examples/`: valid and intentionally broken CSV files for demo.

## Stable Demo Commands

Run from this folder:

```bash
python3 scripts/check_table.py examples/evidence_table.valid.csv
python3 scripts/check_table.py examples/evidence_table.missing_column.csv
python3 scripts/check_table.py examples/evidence_table.bad_values.csv
```

Expected behavior:

- The valid file passes.
- The missing-column file fails with a clear missing column message.
- The bad-values file fails with row-level citation, quote, confidence, and review-field messages.

## Student Workflow

1. Edit `question.md`.
2. Edit `task_spec.md`.
3. Ask an AI agent to produce `evidence_table.csv`.
4. Run `python3 scripts/check_table.py evidence_table.csv`.
5. Manually check PMID / DOI / source pages.
6. Record fixes in `review_checklist.md`.
7. Update `reviewer_correction` and `final_summary.md`.

## Rule

Do not submit raw AI output. Submit the reviewed artifact.
