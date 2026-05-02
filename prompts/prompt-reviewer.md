# Prompt Reviewer Template

Use this when reviewing a prompt change in a pull request.

<task>
Review the proposed prompt change for clarity, testability, and regression risk.
</task>

<review_checklist>
- Does the prompt define success criteria?
- Does it specify an output schema?
- Does it include representative examples?
- Does it tell the model what to do when information is missing?
- Could the wording cause overclaiming, hidden assumptions, or format drift?
</review_checklist>

<output_format>
Return: Summary / Risks / Suggested tests / Merge recommendation.
</output_format>
