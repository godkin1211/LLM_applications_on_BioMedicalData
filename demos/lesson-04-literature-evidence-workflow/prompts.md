# Lesson 04 demo prompts

## Prompt 1: Search strategy

```text
You are assisting with a biomedical literature evidence table.

Research question:
For non-small-cell lung cancer, identify literature-backed claims involving EGFR, ALK, or TP53, and separate treatment-efficacy evidence from molecular-context evidence and model speculation.

Before searching, produce a search strategy only.

Return:
1. Concept blocks: disease, genes, drugs, evidence type.
2. PubMed-style query strings.
3. Inclusion criteria.
4. Exclusion criteria.
5. What fields should be captured for each candidate source.

Rules:
- Do not answer the biomedical question yet.
- Do not invent PMIDs, DOIs, sample sizes, or conclusions.
- Mark any unsupported biological guess as "model_inference_candidate".
```

## Prompt 2: Candidate source inventory

```text
Using only PubMed or source records that can be opened and checked, create a candidate source inventory.

Required columns:
PMID, DOI, title, journal, year, study_type, sample_n, disease, gene, drug_or_intervention, why_candidate, verification_status.

Rules:
- If the abstract or source record states sample size, copy it into sample_n.
- If sample size is not visible in the source record, write UNKNOWN.
- Do not summarize beyond what the source supports.
- Use verification_status = candidate until the PMID or DOI has been opened.
```

## Prompt 3: Evidence table extraction

```text
Convert the verified source inventory into an evidence table.

Required columns:
question, entity_type, gene, disease, drug, claim, evidence_kind, study_type, sample_n, source_title, PMID, DOI, year, quoted_or_source_note, agent_summary, status, needs_human_review, model_inference.

Evidence_kind must be one of:
- literature_evidence
- molecular_context
- model_inference
- not_found
- conflicting

Rules:
- Only use "literature_evidence" when the source directly supports the claim.
- Use "molecular_context" when the source supports gene/disease biology but not treatment efficacy.
- Use "model_inference" when the statement is plausible but not sourced.
- Keep claims narrow. One row should make one claim.
- Every row must start with needs_human_review=TRUE.
```

## Prompt 4: Review and separate evidence from inference

```text
Review this evidence table row by row.

For each row, answer:
1. Does the PMID or DOI exist?
2. Does the source support the exact claim?
3. Is the sample size copied from the source or inferred?
4. Is the claim literature evidence, molecular context, model inference, conflicting, or not found?
5. What should a human reviewer check before accepting the row?

Output a corrected table plus a short review note.
```

