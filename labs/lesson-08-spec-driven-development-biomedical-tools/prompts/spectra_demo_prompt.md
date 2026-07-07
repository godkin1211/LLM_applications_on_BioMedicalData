# Prompt: Spectra demo for a PubMed evidence extractor

Use this prompt as a classroom demo for Spectra-style spec-driven workflow.

## Step 1: Discuss before writing code

```text
/spectra:discuss

Topic:
Design a PubMed evidence extractor for a biomedical research class.

Please inspect:
- templates/biomedical-tool-spec-template.md
- examples/pubmed-evidence-extractor/SPEC.md

The tool should read gene-disease queries and produce an evidence table.

Please converge on:
1. allowed evidence sources
2. input schema
3. output schema
4. not_found behavior
5. human review gates
6. validation fixtures

Do not write code yet.
Ask one question at a time if the scope is ambiguous.
```

## Step 2: Propose artifacts

```text
/spectra:propose

Use the previous discussion to create or update proposal, spec, design, and tasks.
Keep the first version minimal.
The spec must include PMID traceability, evidence_status, model_inference, and review_status.
```

## Step 3: Review before apply

Before running `/spectra:apply`, manually check:

- Is PubMed the only allowed source?
- Does every output claim require PMID or `not_found`?
- Are model inference and literature evidence separated?
- Are therapeutic interpretations marked `needs_review`?
- Are validation fixtures defined?

## Step 4: Apply only after approval

```text
/spectra:apply

Implement only the tasks that are already present in tasks.md.
If a task requires a missing requirement, stop and recommend `/spectra:ingest`.
Run the validation command after each completed task.
```

## Step 5: Ingest if the spec changes

```text
/spectra:ingest

New decision:
The tool must preserve the exact PubMed query string and query_date in the output metadata.

Update the relevant spec and task artifacts before any code change.
```
