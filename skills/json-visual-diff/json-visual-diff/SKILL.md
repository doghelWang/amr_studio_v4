---
name: json-visual-diff
description: "Visually compares two JSON files (e.g. compdesc.json) and requires manual confirmation from the user. Use when the user wants to see a visual diff of two JSON files and explicitly confirm the changes."
---
# JSON Visual Diff

This skill visually compares two JSON files by outputting a colored diff in the terminal and requires manual user confirmation using the `ask_user` tool.

## Usage

1. **Run the comparison script:**
   Execute the `scripts/compare.py` script using `run_shell_command` tool to generate a visual, color-coded diff of the two JSON files.
   
   ```bash
   python3 <path-to-skill>/scripts/compare.py <file1.json> <file2.json>
   ```

2. **Present the diff and ask for confirmation:**
   After the script outputs the visual diff to the terminal, you MUST explicitly ask the user for confirmation using the `ask_user` tool before proceeding with any further actions that depend on this diff. 

   Example using `ask_user`:
   ```json
   {
     "questions": [
       {
         "type": "yesno",
         "header": "Confirm Diff",
         "question": "Please review the visual diff above. Do you confirm these differences?"
       }
     ]
   }
   ```

3. **Handle User Response:**
   - If the user confirms (Yes), proceed with your workflow.
   - If the user denies (No), stop and ask the user how they would like to proceed.

## Notes
- The comparison normalizes the JSON by formatting it with indentation and sorted keys before diffing.
- The script output is color-coded using ANSI escape sequences (Green for additions, Red for deletions).
