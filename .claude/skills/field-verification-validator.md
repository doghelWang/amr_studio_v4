# field-verification-validator Skill

Validate module fields against XML constraint specification

## Usage

/skill verify-fields [project_id] [--module-type TYPE] [--verbose]

## Description

This skill validates frontend JSON module files against the XML constraint specification
to identify missing or extra attributes.

## Implementation

Use this skill to:
1. Load the constraint specification from audits/CONSTRAINT_SPECIFICATION.json
2. Scan all module JSON files in the project
3. Compare each module's attributes with the expected XML template
4. Generate a detailed verification report

## Example

```
/skill verify-fields proj_12345
/skill verify-fields proj_12345 --module-type driveWheel
/skill verify-fields proj_12345 --verbose
```

## Output

The skill generates:
- Summary table with module counts
- Per-module attribute comparison
- Missing/extra attributes list
- Validation score
