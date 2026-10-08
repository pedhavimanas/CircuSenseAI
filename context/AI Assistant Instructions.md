# CircuSense AI — AI Assistant Instructions

This document provides mandatory operational instructions for any AI coding assistant collaborating on the CircuSense AI repository.

---

## 1. Core Operating Rules

Every AI assistant working on this codebase **MUST** follow these rules without exception:

1. **Read Context First**: Read all documentation in `/context` before planning or executing non-trivial code modifications.
2. **Context is Guidance, Code is Truth**: Treat `/context` documents as architectural guidance, but treat the actual source code files as the final implementation truth.
3. **No Phantom Assumptions**: Never assume a planned, documented, or UI-referenced feature is already implemented unless verified directly in active code.
4. **No Full Rewrites**: Never rewrite modules, components, or the repository from scratch unless explicitly ordered by the user.
5. **Preserve Working Functionality**: Do not break existing features, working UI components, mock demo datasets, or established API contracts.
6. **Incremental Changes**: Make changes in small, focused, verifiable increments.
7. **Explain Changes Upfront**: Clearly explain which files will be modified and why before performing major code edits.
8. **Test After Every Step**: Verify changes using TypeScript type checks (`npm run lint`), backend unit tests (`python backend/test_backend.py`), or integration scripts after each meaningful edit.
9. **Transparent Error Reporting**: Honestly report runtime errors, missing packages, and failed tests instead of suppressing them or introducing silent mock workarounds.
10. **Zero Unnecessary Dependencies**: Do not install additional npm or pip packages if existing utilities, standard libraries, or minimal native code can solve the problem.
11. **Update the Progress Tracker**: Always update `context/Progress Tracker.md` after completing a milestone or discovering a new bug.
12. **Update Architecture Documentation**: Update `context/Architecture.md` whenever endpoints, schemas, or storage mechanisms change.
13. **Update AI Workflow Types**: Update `context/AI Workflow Types.md` whenever AI/ML pipeline behavior or models change.
14. **No Silent Scope Creep**: Never unilaterally expand or alter the project scope beyond the user's specific prompt.
15. **No Unauthorized Feature Removal**: Never delete existing pages, components, or diagnostic flows without explicit user approval.
16. **Discrepancy Reporting Rule**:
    > **"If the repository and context documentation disagree, inspect the actual implementation and explicitly report the discrepancy before making a major architectural decision."**

---

## 2. Standard Execution Workflow

When tasked with implementing a feature, refactoring, or fixing a bug, follow this sequential workflow:

```text
1. Read Context
   └── Review relevant files in /context to understand existing patterns and constraints.
         │
         ▼
2. Inspect Source Code
   └── View the actual implementation files directly using view_file or grep_search.
         │
         ▼
3. Understand Implementation
   └── Trace data flow, variable names, interfaces, and state dependencies.
         │
         ▼
4. Plan Smallest Safe Change
   └── Devise the minimal, least disruptive code modification that achieves the goal.
         │
         ▼
5. Implement
   └── Apply the edit cleanly using replace_file_content or write_to_file.
         │
         ▼
6. Test & Verify
   └── Run linting, unit tests, or runtime verification commands to confirm correctness.
         │
         ▼
7. Review for Regressions
   └── Ensure related components or downstream callers were not broken.
         │
         ▼
8. Update Context Documentation
   └── Record changes in Progress Tracker.md (and Architecture.md if applicable).
         │
         ▼
9. Report Result
   └── Provide a concise, factual summary of changes and verification results to the user.
```

---

## 3. Technology-Specific Checklists

### When Modifying the Frontend:
- Run `npm run lint` (`tsc --noEmit`) to verify zero TypeScript errors.
- Ensure all interactive buttons, inputs, and canvas elements have clear accessibility labels or descriptive IDs.
- Do not bypass `storageService.ts` to write raw base64 image strings directly into `localStorage`.
- Maintain dark and light theme compatibility by using established CSS variable tokens from `src/index.css`.

### When Modifying the Backend:
- Keep the `PCBDetector` singleton pattern in `backend/detector.py`; never reload `models/best.pt` per request.
- Ensure all new API endpoints have corresponding Pydantic response models in `backend/schemas.py`.
- Ensure boundary clamping in `backend/postprocessing.py` is maintained so coordinates never exceed image bounds.
- Run `python backend/test_backend.py` to ensure unit tests pass.

### When Modifying AI / ML Pipelines:
- Never replace real model outputs with simulated responses without clearly signaling demo/fallback state.
- Keep default confidence and IoU thresholds configurable via environment variables and API parameters.
- Verify tensor device handling (`cuda` with automatic `cpu` fallback).
