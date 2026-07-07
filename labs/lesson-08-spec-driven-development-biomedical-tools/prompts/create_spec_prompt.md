# Prompt: Create a biomedical tool spec

Do not write code yet.

Create a `SPEC.md` for the biomedical tool idea below.

Before drafting the spec, list up to 8 clarification questions. If an answer is missing, use a conservative assumption and mark it clearly as `ASSUMPTION`.

The spec must include:

- goal and non-goals
- users and usage context
- input schema
- output schema
- boundary conditions
- error handling
- validation commands
- acceptance criteria
- human review gate
- agent handoff rules

Biomedical safety rules:

- do not allow clinical recommendations
- do not allow invented citations, PMIDs, trial IDs, or gene IDs
- treat `not_found` and `needs_review` as valid outputs
- separate source-supported evidence from model inference

Tool idea:

```text
<paste tool idea here>
```
