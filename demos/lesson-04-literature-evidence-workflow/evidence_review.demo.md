# Demo evidence review

This review applies Prompt 4 (row-by-row review) and Prompt 6 (adversarial review) from `prompts.md` to `evidence_table.demo.csv`. Source text used below is drawn only from PubMed abstracts retrieved live for this demo; no PDF or web page content was involved, so the prompt-injection defense in Prompt 6 was not exercised this run but remains part of the standing procedure.

## Row-by-row review (Prompt 4)

| Row | PMID/DOI exists? | Source supports the exact claim? | sample_n copied or inferred? | Evidence kind | Human reviewer should check |
| --- | --- | --- | --- | --- | --- |
| EGFR / osimertinib | Yes — PMID 29151359, DOI 10.1056/NEJMoa1713137 confirmed via PubMed metadata | Yes — abstract directly reports the PFS comparison against standard EGFR-TKIs | Copied from abstract (N=556) | `literature_evidence` | Confirm the claim states "progression-free survival," not "overall survival," since OS data were immature at the interim analysis reported in the abstract. |
| ALK / crizotinib | Yes — PMID 25470694, DOI 10.1056/NEJMoa1408440 confirmed via PubMed metadata | Yes — abstract directly reports the PFS comparison against pemetrexed-plus-platinum chemotherapy | Copied from abstract (N=343) | `literature_evidence` | Confirm "nonsquamous" is retained in the disease field; the trial excluded squamous histology. |
| Pemetrexed-plus-platinum chemotherapy | Yes — PMID 18506025, DOI 10.1200/JCO.2007.15.0375 confirmed via PubMed metadata | Yes, but only for the adenocarcinoma subgroup — the overall-population result was noninferiority, not superiority | Copied from abstract; subgroup n=847 used (not the overall trial N=1725), because the claim is subgroup-specific | `literature_evidence` | Confirm the claim is not silently broadened to "advanced NSCLC" in general; it must stay scoped to the adenocarcinoma/nonsquamous subgroup. |
| Lung adenocarcinoma molecular profiling | Yes — PMID 25079552, DOI 10.1038/nature13385 confirmed via PubMed metadata | Yes — abstract reports the alteration frequencies cited in the claim | Copied from abstract (N=230) | `molecular_context` | Confirm the row is never read downstream as a treatment recommendation; it reports alteration frequency only. |
| TP53 co-mutation / osimertinib PFS | Yes — PMID 40414016, DOI 10.1016/j.ctarc.2025.100945 confirmed via PubMed metadata | Yes — abstract directly reports the PFS hazard ratio for TP53 co-mutation vs EGFR-only | Copied from abstract (N=58) | `molecular_context` (deliberately not `literature_evidence`, since this is a single-arm retrospective cohort, not a comparative efficacy trial) | Confirm the OS trend is reported as non-statistically-significant (P=0.062) and not overstated as a proven survival difference. |
| TP53 / ALK-inhibitor cross-generalization | No PMID or DOI attached | N/A — no source to check | N/A — sample_n is `UNKNOWN` | `model_inference` | Run a dedicated ALK-inhibitor + TP53 search (see query_log.demo.md, run 08) before this row can be upgraded out of `model_inference`. |

## Adversarial review (Prompt 6)

Falsification checks applied to every row:

1. **Source identifier exists and matches title, year, journal.** All five sourced rows were checked against PubMed metadata directly (not from memory); title, year, and journal all match the CSV fields.
2. **Study design supports the claim type.** The two phase 3 randomized trials (FLAURA, PROFILE 1014) support head-to-head treatment-efficacy claims. The Scagliotti 2008 trial is also a randomized comparison, but its overall result was noninferiority — the claim was deliberately narrowed to the adenocarcinoma subgroup, where superiority was reported, rather than being stated as a general finding. The TCGA and TP53-co-mutation rows are cohort/profiling studies and were kept as `molecular_context`, not upgraded to `literature_evidence` for drug efficacy.
3. **`sample_n` uses the denominator relevant to the claim.** The pemetrexed-plus-platinum row uses the adenocarcinoma subgroup n=847, not the overall trial N=1725, because the claim is subgroup-specific. All other sourced rows use the study's full analysis population.
4. **Disease, gene, drug, and outcome are not silently broadened.** The ALK/crizotinib row keeps "nonsquamous" in the disease field. The TCGA row keeps "resected" and lists all four genes actually named in the abstract rather than generalizing to "lung cancer." The TP53/osimertinib row is scoped to "stage IV EGFR-mutated NSCLC," not to NSCLC in general.
5. **Source note supports the exact wording of the claim.** Each `quoted_or_source_note` field quotes or closely paraphrases the specific abstract sentence(s) the claim rests on, including the numeric results (PFS/OS medians, hazard ratios, p-values).
6. **Conflicts, missing sources, or model inference are explicitly labeled.** Only one row (TP53 / ALK-inhibitor cross-generalization) lacks a source; it is labeled `model_inference` with `model_inference=TRUE`, not folded into the sourced TP53/osimertinib row. No conflicting-evidence rows were identified in this demo's search scope.

### Corrected rows
None — all six rows in `evidence_table.demo.csv` passed the checks above as originally drafted.

### Rejected rows
None.

### Unresolved rows with next search action
- TP53 / ALK-inhibitor cross-generalization: run a dedicated PubMed search for `TP53 AND ALK-positive AND (crizotinib OR alectinib OR lorlatinib) AND (resistance OR progression-free survival)` before this row can move out of `model_inference`.

## Human-review checklist

- The PMID or DOI exists and matches title, year, and journal.
- The source supports the exact claim rather than a related background statement.
- `study_type` matches the claim boundary (comparative trial vs. cohort/profiling study).
- `sample_n` uses the denominator relevant to the claim, not the full trial population when the claim is subgroup-specific.
- Molecular-profiling and prognostic-cohort rows are kept as `molecular_context`, never silently promoted to `literature_evidence` for drug efficacy.
- `literature_evidence`, `molecular_context`, `conflicting`, `not_found`, and `model_inference` are not mixed within a single row.
- Every row still records `needs_human_review=TRUE` — this review is a check, not a substitute for the required human sign-off.
