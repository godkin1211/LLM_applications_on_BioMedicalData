# SPEC: PubMed evidence extractor

## Goal

Create a small tool that reads a gene-disease query table and produces a PubMed evidence table with traceable claims.

## Non-goals

- Do not write clinical recommendations.
- Do not infer evidence from model memory.
- Do not rank therapies or suggest treatment.

## Inputs

| Field | Type | Required | Validation | Notes |
| --- | --- | --- | --- | --- |
| `gene` | string | yes | non-empty HGNC-style symbol | preserve `original_gene` |
| `disease` | string | yes | non-empty controlled phrase | do not expand disease scope unless specified |
| `max_records` | integer | no | 1-100 | default 20 |
| `query_date` | date | yes | ISO date | date the query was run |

## Outputs

| Field | Type | Allowed values | Required | Notes |
| --- | --- | --- | --- | --- |
| `pmid` | string | PMID or empty | yes | empty only when `not_found` |
| `title` | string | source title | yes | no generated title |
| `year` | integer | 1900-current year | no | from source |
| `journal` | string | source journal | no | from source |
| `claim` | string | source-supported statement | yes | no unsupported inference |
| `evidence_type` | string | clinical, cohort, preclinical, review, unknown | yes | unknown is allowed |
| `evidence_status` | string | supported, conflicting, not_found | yes | not_found is valid |
| `model_inference` | string | text or empty | yes | separate from evidence |
| `review_status` | string | pass, needs_review | yes | therapeutic claims need review |

## Boundary Conditions

- Source is PubMed metadata and abstracts provided to the tool.
- The tool must preserve the actual search query.
- If no PMID is found, output one row with `evidence_status = not_found`.
- If evidence conflicts, do not collapse it into one conclusion.

## Error Handling

| Condition | Expected status | Required message | Continue? |
| --- | --- | --- | --- |
| empty gene or disease | `invalid_input` | field name and row number | no |
| source API unavailable | `source_unavailable` | retry advice and timestamp | no |
| no PubMed hit | `not_found` | original query | yes |
| therapeutic implication | `needs_review` | human review required | yes |

## Validation

- Fixture with three known PMID records.
- Negative fixture with a query that returns no records.
- Output schema validation.
- Golden CSV comparison for fixture records.
- PMID existence check for non-empty PMID values.

## Acceptance Criteria

- [ ] Every non-empty PMID exists in the retrieved records.
- [ ] No row contains a generated PMID.
- [ ] `claim` never contains text unsupported by source fields.
- [ ] `model_inference` is separate from `claim`.
- [ ] High-risk therapeutic interpretation is marked `needs_review`.
