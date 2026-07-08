# Evidence Table Writer Skill

Use this skill when the task is to produce or revise a biomedical evidence table.

Workflow:

1. Read `PROMPT.md`.
2. Extract the biomedical entity, claim, evidence type, source ID, citation, quoted evidence, confidence, limitation, and human-review flag.
3. Prefer fewer well-verified rows over many weak rows.
4. Mark `needs_human_review=true` for treatment, diagnosis, prognosis, clinical action, low confidence, or conflicting evidence.
5. Run the verifier before finalizing.

Do not:

- Invent citations.
- Convert association into causation.
- Convert evidence summary into patient-level advice.

