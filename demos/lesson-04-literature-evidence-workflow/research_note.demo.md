# Demo research note

## Problem statement

Can an AI agent help assemble a small evidence table for NSCLC precision oncology while keeping literature evidence separate from model speculation?

## Search strategy

- Disease terms: non-small-cell lung cancer, lung adenocarcinoma, NSCLC
- Gene terms: EGFR, ALK, TP53
- Drug terms: osimertinib, crizotinib, EGFR-TKI, chemotherapy
- Evidence filters: clinical trial, phase 3, molecular profiling, PubMed PMID, DOI

## Evidence summary

- EGFR / osimertinib has direct phase 3 trial evidence in previously untreated EGFR-mutated advanced NSCLC.
- ALK / crizotinib has direct phase 3 trial evidence in previously untreated ALK-positive advanced nonsquamous NSCLC.
- TCGA lung adenocarcinoma profiling supports molecular context for lung adenocarcinoma but does not itself support a drug-efficacy claim.
- TP53 statements should be treated as model inference until a source is identified and checked.

## Human review notes

- Open every PMID or DOI before accepting a row.
- Confirm that `sample_n` appears in the source text.
- Confirm that the source supports the exact claim, not merely a related background statement.
- Keep treatment evidence separate from molecular context.

## Next actions

- Search specifically for TP53 and targeted therapy outcomes in NSCLC.
- Add `quoted_span` or `source_note` from the reviewed source.
- Run a CSV/schema validator before using the table in a report.

