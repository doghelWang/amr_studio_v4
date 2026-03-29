---
name: Audit Analyzer
description: Skill to parse the '人工检查.md' document and update the project's requirement tracking table and task list.
---

# Audit Analyzer Skill

This skill provides a systematic way to process user feedback from the manual audit document (`docs/audit/人工检查.md`).

## Structured Audit Schema

Every entry in `人工检查.md` MUST follow this structure to ensure precise analysis:

### [ID] - [Batch/Title]
- **Date**: YYYY-MM-DD
- **Category**: [Bug / Requirement]
- **Description**: Detailed description of the issue or feature request.
- **Expected Result**: Specific criteria for success.
- **Test Method**: How to verify (Browser / Command / Manual).
- **Status**: [Pending / Completed / Verified]

## Workflow

1. **Read and Extract**: Locate the latest `[ID]` entries in `docs/audit/人工检查.md`.
2. **Analysis**: Correlate the `Description` and `Expected Result` with existing code.
3. **Update Tracking**: Synchronize with `<appDataDir>/brain/<conversation-id>/requirement_tracking.md`.
4. **Task Breakdown**: Update `task.md` with granular implementation steps.
5. **Implementation & Walkthrough**: Follow standard EXECUTION and VERIFICATION modes.

## Evaluation Criteria
- **Formatting**: Strictly adhere to the markdown schema.
- **Traceability**: Link every audit item to a persistent requirement ID.
- **Verification**: Ensure `Test Method` is actionable and documented in `walkthrough.md`.
