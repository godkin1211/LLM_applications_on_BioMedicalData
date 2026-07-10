# Demo evidence review

## Review decisions

| Row | Decision | Reason | Required human check |
| --- | --- | --- | --- |
| EGFR / osimertinib | Keep as `literature_evidence` | The verified trial record supports a comparative progression-free-survival claim. | Confirm the exact analysis population and source wording. |
| ALK / crizotinib | Keep as `literature_evidence` | The verified trial record supports a comparative progression-free-survival claim. | Confirm comparator wording and denominator. |
| Lung adenocarcinoma profiling | Keep as `molecular_context` | The source supports alteration context, not treatment efficacy. | Prevent downstream summaries from turning this row into a recommendation. |
| TP53 / targeted therapy outcome | Keep isolated as `model_inference` or change to `not_found` after a documented search | No supporting PMID or DOI is attached to the demo row. | Run the rescue query and verify an exact source before upgrading the row. |

## Row-level checklist

- The PMID or DOI exists and matches title, year, and journal.
- The source supports the exact claim rather than a related background statement.
- `study_type` matches the claim boundary.
- `sample_n` uses the denominator relevant to the claim.
- Raw entity text and normalized fields are both retained when normalization is needed.
- `literature_evidence`, `molecular_context`, `conflicting`, `not_found`, and `model_inference` are not mixed.
- Every accepted row still records its human-review decision.
