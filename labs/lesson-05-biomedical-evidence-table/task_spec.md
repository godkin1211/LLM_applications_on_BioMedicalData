# Task Spec

Read `question.md`.

Create or update `evidence_table.csv` using the required columns:

- `question`
- `entity_type`
- `entity`
- `claim`
- `evidence_type`
- `source_title`
- `source_id`
- `PMID_or_DOI`
- `year`
- `quoted_evidence`
- `agent_summary`
- `confidence`
- `limitation`
- `needs_human_review`
- `reviewer_correction`

## Rules

- Do not invent citations.
- If evidence is missing, write `not_found`.
- Every non-empty claim must have a source ID and quoted evidence.
- Use `confidence` values only from: `high`, `medium`, `low`, `not_found`.
- Use `needs_human_review` values only from: `TRUE`, `FALSE`.
- Mark clinical or treatment-related claims as `needs_human_review=TRUE`.
- Keep limitations explicit.
