# Implementation Plan

Loop:

1. Plan the evidence-table columns and boundary.
2. Retrieve or read candidate sources.
3. Draft the evidence table.
4. Verify citation, quote, confidence, limitation, and human-review flags.
5. Revise or stop with a clear terminal state.

Stopping rules:

- Stop when all blocking verification issues are resolved.
- Stop if clinical action language remains after one revision.
- Stop if citations cannot be verified.
- Stop after three revision rounds.

