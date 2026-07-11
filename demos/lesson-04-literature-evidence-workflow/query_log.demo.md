# Demo query log

This file records the search decisions used for the Lesson 04 NSCLC evidence-table demo. It is a teaching example, not a claim that the search is systematic or exhaustive. All queries were run live against PubMed (via the PubMed search/metadata tools) on 2026-07-11.

| Run | Focus | Query | Filters | Purpose | Change from previous | Candidate source count | Decision | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | Broad gene map | `non-small-cell lung cancer AND (EGFR OR ALK OR TP53)` | none | Confirm terminology and scope; check volume of literature | Baseline | 25,625 total hits, 10 inspected | Too broad to extract sources directly; narrow by drug/trial per gene | Add drug + study-design terms for each gene |
| 02 | EGFR treatment | `osimertinib EGFR-mutated advanced non-small-cell lung cancer randomized trial` | none | Find a phase 3 treatment-efficacy source for EGFR/osimertinib | Added drug, mutation status, and trial-design terms | 67 total hits; top hit PMID 29151359 (FLAURA) | Verified via get_article_metadata; matches disease/gene/drug scope | Accept as `literature_evidence` |
| 03 | ALK treatment | `crizotinib ALK-positive non-small-cell lung cancer chemotherapy randomized trial` | none | Find a phase 3 treatment-efficacy source for ALK/crizotinib | Changed gene and drug, reused trial-design terms | 110 total hits; PMID 25470694 (PROFILE 1014) present | Verified via get_article_metadata; matches disease/gene/drug scope | Accept as `literature_evidence` |
| 04 | Chemotherapy backbone | `pemetrexed platinum chemotherapy advanced non-small-cell lung cancer phase 3` | none | Find a phase 3 source specifically for pemetrexed-plus-platinum efficacy | Changed drug to the chemotherapy backbone named in task_spec.md | 174 total hits; PMID 18506025 present | Verified via get_article_metadata; histology-specific (adenocarcinoma) superiority result | Accept as `literature_evidence`, scoped to the adenocarcinoma subgroup only |
| 05 | Molecular context | `comprehensive molecular profiling lung adenocarcinoma TCGA` | none | Find the molecular-profiling source for lung adenocarcinoma context | Changed evidence type from treatment efficacy to molecular profiling | 112 total hits; confirmed by title search to PMID 25079552 | Verified via get_article_metadata | Accept as `molecular_context`; do not convert to a treatment-efficacy claim |
| 06 | TP53 rescue | `TP53 mutation non-small-cell lung cancer targeted therapy outcome` | none | Look for a source connecting TP53 to targeted-therapy outcomes | Added outcome and drug-class terms for the unresolved TP53 row | 176 total hits, 10 inspected | No direct phase 3 efficacy source found; several retrospective cohort studies present | Run a narrower rescue query |
| 07 | TP53 rescue, narrowed | `TP53 mutation prognosis non-small-cell lung cancer EGFR-TKI resistance` | none | Find a source on TP53 co-mutation and EGFR-TKI outcome specifically | Narrowed run 06 to prognosis + EGFR-TKI resistance | 36 total hits; PMID 40414016 identified and verified | Retrospective cohort (n=58) reporting TP53 co-mutation associated with shorter PFS on osimertinib | Accept as `molecular_context` (prognostic association within a single-arm cohort, not a drug-vs-drug efficacy trial) |
| 08 | TP53 x ALK cross-check | (manual check; no new PubMed query run) | none | Check whether the TP53/EGFR-TKI finding from run 07 has an ALK-inhibitor equivalent | Attempted to extend run 07's finding to a different drug class | 0 verified sources found in this demo's search budget | Stop; no verifiable source for a TP53-ALK-inhibitor claim was found | Record as `model_inference`, not `not_found`, because the claim was never independently searched to a stopping point across ALK-specific literature; a full search is a valid next action outside this demo |

## Inclusion rules

- Disease scope matches NSCLC or lung adenocarcinoma.
- PMID or DOI can be opened and checked (verified here via PubMed metadata retrieval, including abstract text).
- Study type is relevant to the claim (a phase 3 comparative trial for a treatment-efficacy claim; a profiling or cohort study for a molecular-context claim).
- The source can support at least one narrow evidence row.

## Exclusion or parking rules

- Secondary summaries without a traceable primary source.
- Disease, intervention, or outcome outside the task scope.
- Background-only sources that cannot support an evidence row.
- Duplicate reports from the same study until their relationship is resolved.

## Stop rule

Stop when a new query no longer adds a verifiable source relevant to the question, or when full-text access or expert review is required. Runs 01-07 each added a verifiable source or a scoping decision; run 08 added no verifiable source, so the TP53/ALK-inhibitor question was parked as `model_inference` rather than pursued further within this demo's budget. A follow-up search specifically for ALK-inhibitor and TP53 co-mutation outcomes is a valid next action before this row could be upgraded.
