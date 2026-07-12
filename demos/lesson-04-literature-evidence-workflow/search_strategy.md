# Search Strategy: NSCLC Precision Oncology Evidence Table

This document outlines the search plan and criteria for identifying literature-backed claims about Non-Small-Cell Lung Cancer (NSCLC) precision oncology, focusing on EGFR, ALK, and TP53 genes, and osimertinib, crizotinib, standard EGFR-TKIs, and pemetrexed-plus-platinum chemotherapy.

## 1. Concept Blocks

| Concept Block | Elements |
| --- | --- |
| **Disease Scope** | Non-small-cell lung cancer (NSCLC), lung adenocarcinoma, advanced/metastatic NSCLC. |
| **Genes** | EGFR, ALK, TP53. |
| **Drugs / Interventions** | Osimertinib, crizotinib, standard EGFR-TKIs (gefitinib, erlotinib, afatinib), pemetrexed-plus-platinum chemotherapy (cisplatin/carboplatin). |
| **Evidence Type** | - `literature_evidence`: Treatment-efficacy clinical studies (RCTs, prospective/retrospective cohorts) showing comparative results.<br>- `molecular_context`: Biological mechanisms, co-mutation frequencies, or prognostic markers without treatment-efficacy comparisons.<br>- `model_inference_candidate`: Biologically plausible hypotheses or clinical assumptions requiring verification. |

### Model Inference Candidates (Biological Speculations to Verify)
1. **Candidate 1**: TP53 mutations act as a negative prognostic factor and are associated with resistance/shorter response duration to EGFR-TKIs (like osimertinib) in EGFR-mutated NSCLC.
2. **Candidate 2**: Crizotinib is superior to chemotherapy (pemetrexed-plus-platinum) in ALK-rearranged advanced NSCLC.
3. **Candidate 3**: Osimertinib is superior to standard first-generation EGFR-TKIs (gefitinib/erlotinib) in first-line treatment of EGFR-mutated advanced NSCLC.
4. **Candidate 4**: ALK rearrangements and TP53 co-mutations are associated with poorer clinical outcomes during ALK-TKI therapy.

---

## 2. PubMed-Style Query Strings

Queries are arranged from broad to narrow:

1. **Broad Concept Intersection (All targets):**
   `("Carcinoma, Non-Small-Cell Lung"[Mesh] OR "non-small-cell lung cancer"[tiab] OR "NSCLC"[tiab]) AND (EGFR[tiab] OR ALK[tiab] OR TP53[tiab]) AND (osimertinib[tiab] OR crizotinib[tiab] OR "EGFR-TKI"[tiab] OR pemetrexed[tiab])`

2. **EGFR-mutated NSCLC & Osimertinib Efficacy (Narrower):**
   `("Carcinoma, Non-Small-Cell Lung"[Mesh] OR "NSCLC"[tiab]) AND EGFR[tiab] AND osimertinib[ti] AND ("clinical trial"[pt] OR "randomized"[tiab] OR trial[ti])`

3. **ALK-rearranged NSCLC & Crizotinib Efficacy (Narrower):**
   `("Carcinoma, Non-Small-Cell Lung"[Mesh] OR "NSCLC"[tiab]) AND ALK[tiab] AND crizotinib[ti] AND ("clinical trial"[pt] OR trial[ti] OR efficacy[tiab])`

4. **TP53 Co-mutations in EGFR/ALK NSCLC (Prognostic & resistance molecular context):**
   `("Carcinoma, Non-Small-Cell Lung"[Mesh] OR "NSCLC"[tiab]) AND TP53[tiab] AND (EGFR[tiab] OR ALK[tiab] OR osimertinib[tiab] OR crizotinib[tiab]) AND (prognosis[tiab] OR resistance[tiab] OR survival[tiab])`

5. **Pemetrexed-Plus-Platinum Chemotherapy comparison (Control arm & salvage):**
   `("Carcinoma, Non-Small-Cell Lung"[Mesh] OR "NSCLC"[tiab]) AND pemetrexed[tiab] AND (platinum[tiab] OR cisplatin[tiab] OR carboplatin[tiab]) AND ("clinical trial"[pt] OR trial[ti] OR efficacy[tiab])`

---

## 3. Inclusion Criteria

- **Population**: Patients with pathologically confirmed NSCLC (especially lung adenocarcinoma, advanced, or metastatic disease).
- **Genes**: Studies must explicitly investigate EGFR mutations (e.g., L858R, Exon 19 deletions, T790M), ALK rearrangements/fusions, or TP53 alterations.
- **Interventions**: Must evaluate osimertinib, crizotinib, standard EGFR-TKIs (gefitinib, erlotinib, afatinib), or pemetrexed-plus-platinum chemotherapy.
- **Outcomes**:
  - For `literature_evidence`: Must report clinical efficacy metrics (PFS, OS, HR, ORR) comparing two or more therapeutic regimens.
  - For `molecular_context`: Must report genomic profiling, mutation frequency, co-mutation status, prognostic correlation, or resistance mechanisms.
- **Study Types**: Randomized controlled trials (RCTs), prospective cohorts, retrospective cohort/database analyses.

---

## 4. Exclusion Criteria

- **Preclinical/In Vitro**: Exclude basic science, cell-line, or animal model studies, unless no clinical data exists and they are explicitly marked as preclinical molecular context.
- **Study Design**: Exclude letters, editorials, guidelines, and reviews that do not report original clinical or genomic data (unless used as a reference source to find the primary publication).
- **Sub-analysis**: Exclude studies of generic lung cancers that do not separate NSCLC or provide subgroup analysis.
- **Sample Size**: Exclude single-patient case reports (N = 1) unless reporting a highly unique molecular resistance mechanism (must be labeled N=1 and flagged for human review).
- **Language**: Exclude non-English publications.

---

## 5. Fields to Capture for Each Candidate Source

Each candidate source entered into the inventory must capture:
- **PMID**: PubMed identifier.
- **DOI**: Digital Object Identifier.
- **title**: Title of the publication (exact, from PubMed metadata).
- **journal**: Publication journal name.
- **year**: Year of publication.
- **study_type**: Clinical study design (e.g., Phase III RCT, Retrospective Cohort).
- **sample_n**: Evaluated sample size (either overall or subgroup relevant to the claim; use `UNKNOWN` if not stated).
- **disease**: Fine-grained disease scope (e.g., advanced lung adenocarcinoma).
- **gene**: Specific gene(s) involved (EGFR, ALK, TP53).
- **drug_or_intervention**: Drug(s) investigated.
- **why_candidate**: Brief rationale for inclusion.
- **verification_status**: Set to `candidate` initially, changing to `verified` once the PMID or DOI record is opened and confirmed.
