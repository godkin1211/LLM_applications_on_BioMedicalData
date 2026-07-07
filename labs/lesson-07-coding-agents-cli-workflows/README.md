# Lesson 07 Lab: Coding agents and CLI workflows

This lab is a small repo-grounded exercise for practicing coding-agent prompts and Seqera AI handoff prompts.

## Goal

Ask a CLI coding agent to inspect the existing files, improve `scripts/validate_manifest.py`, run a local validation command, and report the diff and remaining risks.

The optional Seqera AI prompt asks for a Nextflow-focused review of the toy workflow scaffold without launching cloud jobs.

## Files

- `sample_manifest.csv`: small demo manifest with valid and invalid rows.
- `scripts/validate_manifest.py`: intentionally minimal validator for students to improve.
- `prompts/coding_agent_task.md`: prompt packet for a general coding agent.
- `prompts/seqera_ai_task.md`: prompt packet for Seqera AI / Co-Scientist.
- `nextflow/main.nf` and `nextflow/nextflow.config`: tiny scaffold for workflow-review discussion.

## Suggested local command

```bash
python3 scripts/validate_manifest.py sample_manifest.csv
```

## Teaching constraints

- Do not use real patient identifiers.
- Do not put API tokens or Seqera access tokens in this repo.
- Do not let an agent launch cloud jobs or modify a Seqera Platform workspace without explicit human approval.
- Keep the first patch small and easy to review.
