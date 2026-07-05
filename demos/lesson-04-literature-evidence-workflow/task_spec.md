# Lesson 04 demo task spec

## Demo question

Build a small, reviewable evidence table for literature-backed claims about NSCLC precision oncology.

Focus entities:

- Disease scope: non-small-cell lung cancer, especially lung adenocarcinoma and advanced NSCLC
- Genes: EGFR, ALK, TP53
- Drugs: osimertinib, crizotinib, standard EGFR-TKIs, pemetrexed-plus-platinum chemotherapy

## Required output

Produce `evidence_table.demo.csv` with these fields:

- `question`
- `entity_type`
- `gene`
- `disease`
- `drug`
- `claim`
- `evidence_kind`
- `study_type`
- `sample_n`
- `source_title`
- `PMID`
- `DOI`
- `year`
- `quoted_or_source_note`
- `agent_summary`
- `status`
- `needs_human_review`
- `model_inference`

## Rules

- A row is `literature_evidence` only when it has a PMID or DOI and the source supports the claim.
- If the model suggests a biological relationship but no supporting source is provided, use `model_inference`.
- Do not fill sample size from memory. Use the number stated in the source text; otherwise write `UNKNOWN`.
- Do not convert a prognostic or molecular-profiling paper into a treatment-efficacy claim.
- Every row starts as `needs_human_review=TRUE`.

