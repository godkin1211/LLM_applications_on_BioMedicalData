# Demo query log

This file records the search decisions used for the Lesson 04 NSCLC evidence-table demo. It is a teaching example, not a claim that the search is systematic or exhaustive.

| Run | Focus | Query pattern | Change | Decision |
| --- | --- | --- | --- | --- |
| 01 | Broad gene map | `NSCLC AND (EGFR OR ALK OR TP53)` | Baseline | Collect terminology and candidate study types. |
| 02 | EGFR treatment | `NSCLC AND EGFR AND osimertinib AND trial` | Add drug and trial terms | Build treatment-evidence inventory. |
| 03 | ALK treatment | `NSCLC AND ALK AND crizotinib AND chemotherapy` | Change gene, drug, and comparator | Reuse the same extraction schema for a second treatment question. |
| 04 | Molecular context | `lung adenocarcinoma AND molecular profiling` | Change evidence type | Keep molecular context separate from treatment efficacy. |
| 05 | TP53 rescue | `TP53 AND NSCLC AND outcome AND targeted therapy` | Add outcome terms for an unresolved row | If no exact source is verified, retain `not_found` or `needs_source`. |

## Inclusion rules

- Disease scope matches NSCLC or lung adenocarcinoma.
- PMID or DOI can be opened and checked.
- Study type is relevant to the claim.
- The source can support at least one narrow evidence row.

## Exclusion or parking rules

- Secondary summaries without a traceable primary source.
- Disease, intervention, or outcome outside the task scope.
- Background-only sources that cannot support an evidence row.
- Duplicate reports from the same study until their relationship is resolved.

## Stop rule

Stop when a new query no longer adds a verifiable source relevant to the question, or when full-text access or expert review is required. Record the searched scope and date before assigning `not_found`.
