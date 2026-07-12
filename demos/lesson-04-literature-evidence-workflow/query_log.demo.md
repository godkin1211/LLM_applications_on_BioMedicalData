# Query Ladder Log (Step 5)

This document records the search history, search logic, and progressive narrowing strategy used to retrieve evidence for the NSCLC precision oncology evidence table.

## Reproducible Query Ladder

| run_id | database | query | filters | purpose | change_from_previous | candidate_source_count | decision | next_action |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| **Run 1** | PubMed | `("Carcinoma, Non-Small-Cell Lung"[Mesh] OR "non-small-cell lung cancer"[tiab] OR "NSCLC"[tiab]) AND (EGFR[tiab] OR ALK[tiab] OR TP53[tiab]) AND (osimertinib[tiab] OR crizotinib[tiab] OR "EGFR-TKI"[tiab] OR pemetrexed[tiab])` | None | Broad concept search for focus disease, genes, and drugs. | Baseline (First search) | 5 | Retain all 5 abstracts for initial scanning. | Narrow down search for EGFR-mutated NSCLC and osimertinib trials. |
| **Run 2** | PubMed | `("Carcinoma, Non-Small-Cell Lung"[Mesh] OR "NSCLC"[tiab]) AND EGFR[tiab] AND osimertinib[ti] AND ("clinical trial"[pt] OR "randomized"[tiab] OR trial[ti])` | None | Identify clinical trials of osimertinib in EGFR-mutant advanced NSCLC. | Narrowed to `osimertinib[ti]` and added study design filters (`trial[ti]`, `[pt]`). | 5 | Retained and verified PMIDs 37937763 (FLAURA2), 36720083 (ADAURA), 29151359 (FLAURA), 38828946 (LAURA). | Search specifically for ALK-positive NSCLC and crizotinib trials. |
| **Run 3** | PubMed | `("Carcinoma, Non-Small-Cell Lung"[Mesh] OR "NSCLC"[tiab]) AND ALK[tiab] AND crizotinib[ti] AND ("clinical trial"[pt] OR trial[ti] OR efficacy[tiab])` | None | Identify clinical trials of crizotinib in ALK-rearranged advanced NSCLC. | Changed gene to `ALK` and drug to `crizotinib[ti]`. | 5 | Retained and verified PMIDs 38819031 (CROWN 5-yr), 33207094 (CROWN initial), 36535300 (CROWN 3-yr), 28586279 (ALEX). | Search specifically for TP53 co-mutations in EGFR or ALK NSCLC. |
| **Run 4** | PubMed | `("Carcinoma, Non-Small-Cell Lung"[Mesh] OR "NSCLC"[tiab]) AND TP53[tiab] AND (EGFR[tiab] OR ALK[tiab] OR osimertinib[tiab] OR crizotinib[tiab]) AND (prognosis[tiab] OR resistance[tiab] OR survival[tiab])` | None | Identify prognostic and resistance associations of TP53 co-mutations in EGFR/ALK NSCLC. | Added `TP53` gene focus and prognosis/resistance/survival outcome terms. | 5 | Retained and verified PMIDs 38942080 (MARIPOSA secondary analysis), 34537440 (ALTA-1L), 28445112 (TRACERx). | Search for pemetrexed-plus-platinum chemotherapy trials. |
| **Run 5** | PubMed | `("Carcinoma, Non-Small-Cell Lung"[Mesh] OR "NSCLC"[tiab]) AND pemetrexed[tiab] AND (platinum[tiab] OR cisplatin[tiab] OR carboplatin[tiab]) AND ("clinical trial"[pt] OR trial[ti] OR efficacy[tiab])` | None | Identify clinical trials establishing pemetrexed-plus-platinum chemotherapy outcomes. | Changed drug focus to pemetrexed and platinum-based agents. | 5 | Retained and verified PMID 36809080 (KEYNOTE-189 5-yr update). | Search for comparative trials of crizotinib vs. osimertinib in double-driver EGFR+/ALK+ patients. |
| **Run 6** | PubMed | `("Carcinoma, Non-Small-Cell Lung"[Mesh] OR "NSCLC"[tiab]) AND EGFR[tiab] AND ALK[tiab] AND osimertinib[tiab] AND crizotinib[tiab]` | None | Search for studies comparing osimertinib and crizotinib in EGFR-mutated and ALK-rearranged NSCLC. | Intersected EGFR, ALK, osimertinib, and crizotinib directly. | 0 | Concluded as `not_found` due to lack of randomized clinical trials. | **Stop Search** (Reached stopping rule: no new comparative trials found; full-text expert review required). |

---

## Search Stopping Rules applied

1. **Information Redundancy**: Search is terminated when subsequent queries (e.g., Run 6) return 0 new clinical trials or prospective cohorts that compare the target therapies.
2. **Unresolved Claims (`not_found`)**: For the comparative efficacy of osimertinib vs. crizotinib in concurrent EGFR-mutated and ALK-rearranged NSCLC, no clinical trials exist. This has been cataloged as `not_found` (Searched scope: PubMed database up to 2026-07-11; next action: manual expert review of case reports).
