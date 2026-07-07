# SPEC: Gene list annotation tool

## Goal

Create a tool that normalizes a gene list against a declared source database and flags ambiguous or invalid entries for review.

## Non-goals

- Do not annotate variants.
- Do not infer disease relevance.
- Do not replace a symbol silently.

## Inputs

| Field | Type | Required | Validation | Notes |
| --- | --- | --- | --- | --- |
| `gene_input` | string | yes | non-empty | preserve original value |
| `species` | string | yes | human, mouse | default must be explicit |
| `source_database` | string | yes | HGNC, NCBI Gene, Ensembl | record version |
| `allow_synonym` | boolean | no | true or false | default false |
| `batch_id` | string | no | letters, numbers, `_`, `-` | trace batch |

## Outputs

| Field | Type | Allowed values | Required | Notes |
| --- | --- | --- | --- | --- |
| `gene_input` | string | any | yes | original input |
| `approved_symbol` | string | source value or empty | yes | empty if not found |
| `gene_id` | string | source ID or empty | no | database-specific |
| `species` | string | human, mouse | yes | copied from input |
| `match_type` | string | exact, synonym, withdrawn, not_found, invalid_input | yes | no silent correction |
| `confidence` | string | high, medium, low | yes | not evidence level |
| `evidence_source` | string | database name | yes | source used |
| `evidence_version` | string | version/date | yes | retrieval trace |
| `review_status` | string | pass, needs_review | yes | ambiguity requires review |

## Boundary Conditions

- Species must be explicit.
- Synonym matches require source evidence.
- Multiple matches must be returned as ambiguous candidates.
- Non-gene terms must not be coerced into gene symbols.

## Error Handling

| Condition | Expected status | Required message | Continue? |
| --- | --- | --- | --- |
| empty input | `invalid_input` | row number | yes |
| database unavailable | `source_unavailable` | database and timestamp | no |
| multiple matches | `needs_review` | candidate IDs | yes |
| no match | `not_found` | original input | yes |

## Validation

- Fixture contains exact symbol, synonym, withdrawn symbol, invalid spelling, and species mismatch.
- Golden output fixes `match_type`, `confidence`, and `review_status`.
- Database version is included in output metadata.

## Acceptance Criteria

- [ ] Original input is never overwritten.
- [ ] Synonym replacements include source evidence.
- [ ] Ambiguous matches are not auto-resolved.
- [ ] Every output row records source database and version.
