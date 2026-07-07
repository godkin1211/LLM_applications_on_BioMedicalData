# SPEC: Clinical trial summarizer

## Goal

Create a tool that summarizes selected fields from clinical trial records for research-note use.

## Non-goals

- Do not advise patients.
- Do not determine trial eligibility for a person.
- Do not infer recruitment status from model memory.

## Inputs

| Field | Type | Required | Validation | Notes |
| --- | --- | --- | --- | --- |
| `nct_id` | string | yes | `NCT` plus 8 digits | fail fast if invalid |
| `source_record` | JSON | yes | ClinicalTrials.gov-style record | local file or API result |
| `retrieved_date` | date | yes | ISO date | status can change |
| `summary_scope` | list | yes | allowed fields only | no extra sections |
| `audience` | string | yes | research_note | no clinical advice |

## Outputs

| Field | Type | Allowed values | Required | Notes |
| --- | --- | --- | --- | --- |
| `nct_id` | string | valid NCT ID | yes | from input |
| `official_title` | string | source title | yes | no generated title |
| `phase` | string | source value or unknown | yes | do not infer |
| `recruitment_status` | string | source value | yes | retrieved-date specific |
| `condition` | list | source values | yes | source fields |
| `interventions` | list | source values | yes | source fields |
| `primary_outcomes` | list | source values | yes | source fields |
| `inclusion_summary` | string | summarized text | yes | source fields required |
| `exclusion_summary` | string | summarized text | yes | source fields required |
| `source_fields` | list | JSON paths | yes | traceability |
| `review_status` | string | pass, needs_review | yes | high-risk outputs need review |

## Boundary Conditions

- The tool summarizes the provided record only.
- It must not update recruitment status from memory.
- It must not recommend that a patient enroll.
- It must preserve missing fields as `missing`.

## Error Handling

| Condition | Expected status | Required message | Continue? |
| --- | --- | --- | --- |
| invalid NCT ID | `invalid_input` | expected format | no |
| missing source field | `missing` | JSON path | yes |
| conflicting records | `conflicting` | source identifiers | no |
| PHI detected | `stop_and_report` | field name only | no |

## Validation

- JSON schema validation.
- Fixture with one complete record and one record with missing criteria.
- Negative fixture with invalid NCT ID.
- Field trace check: every summary field must list source paths.

## Acceptance Criteria

- [ ] Recruitment status exactly matches the source record.
- [ ] Criteria summaries list source fields.
- [ ] Missing fields are marked `missing`, not inferred.
- [ ] No eligibility or treatment recommendation is generated.
- [ ] Any clinical interpretation is marked `needs_review`.
