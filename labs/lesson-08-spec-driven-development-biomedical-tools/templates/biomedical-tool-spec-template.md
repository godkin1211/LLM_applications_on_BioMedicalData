# SPEC: <tool name>

## Goal

Describe the biomedical research task this tool supports.

## Non-goals

- Do not make clinical recommendations.
- Do not infer missing biomedical facts without a cited source.
- Do not process patient-identifying data.

## Users

- Primary user:
- Reviewer:
- Expected usage context:

## Inputs

| Field | Type | Required | Validation | Notes |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Outputs

| Field | Type | Allowed values | Required | Notes |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Boundary Conditions

- Allowed data sources:
- Disallowed data sources:
- Species / disease / cohort scope:
- Date or database version rules:
- PHI / privacy boundary:

## Error Handling

| Condition | Expected status | Required message | Continue? |
| --- | --- | --- | --- |
| invalid input | `invalid_input` | explain field and row | no |
| not found | `not_found` | preserve original input | yes |
| conflicting evidence | `conflicting` | list sources | yes |
| high-risk clinical claim | `needs_review` | require human review | yes |

## Validation

- Schema validation:
- Fixture cases:
- Golden output:
- Negative tests:
- Required command:

## Acceptance Criteria

- [ ] Every output row conforms to the schema.
- [ ] Every biomedical claim has a source field or is marked `not_found`.
- [ ] No high-risk clinical statement is emitted without `needs_review`.
- [ ] The tool records source version or retrieval date.
- [ ] The validation command is reproducible.

## Agent Handoff Rules

- The agent must read this spec before editing code.
- The agent must not add features outside this spec.
- The agent must stop and ask if a requirement is ambiguous.
- The agent must report deviations from this spec.
