# Claude Prompt Eval Kit

A small, dependency-free CLI for maintainers who want to make Claude prompts **testable before they become production folklore**.

Instead of storing prompts as loose text files, this repo turns each prompt into a portable spec:

- a clear task definition
- XML-style sections for context, constraints, examples, and output format
- a rubric with weighted checks
- deterministic regression scoring you can run in CI
- before/after comparisons for prompt changes

> Not affiliated with Anthropic. Built for open-source teams who want practical prompt QA around Claude, Claude Code, and other LLM workflows.

## Why this exists

Most prompt repos collect examples. That is useful, but maintainers also need a way to answer:

- Did this prompt revision improve the output?
- Did we break the required format?
- Are hallucination guardrails still present?
- Can contributors add prompt changes without bikeshedding taste?

This kit focuses on repeatable, reviewable prompt engineering.

## Install locally

```bash
git clone https://github.com/mementofani/claude-prompt-eval-kit.git
cd claude-prompt-eval-kit
npm install
npm test
```

You can also run it without installing:

```bash
node bin/promptproof.mjs score examples/customer-support.json
node bin/promptproof.mjs compile examples/customer-support.json
```

## Commands

### Score a prompt output

```bash
promptproof score examples/customer-support.json
```

Example result:

```json
{
  "score": 0.86,
  "passed": true,
  "checks": [
    { "name": "mentions_escalation", "score": 1 },
    { "name": "contains_exact_schema", "score": 1 },
    { "name": "avoids_unverified_claims", "score": 0.5 }
  ]
}
```

### Compile a prompt spec into XML-ish Claude prompt text

```bash
promptproof compile examples/customer-support.json
```

### Compare two specs

```bash
promptproof compare examples/customer-support.json examples/legal-summarization.json
```

## Prompt spec format

```json
{
  "name": "customer-support-triage",
  "task": "Classify a customer support ticket and produce a concise escalation plan.",
  "context": "The user is a SaaS support analyst handling billing and account-access issues.",
  "constraints": [
    "Do not invent account state.",
    "Ask for missing identifiers when required.",
    "Use exactly the requested output schema."
  ],
  "output_schema": ["category", "urgency", "reason", "next_action"],
  "examples": [
    {
      "input": "I was charged twice and cannot access my workspace.",
      "ideal": "category: billing/access; urgency: high; reason: payment issue plus account lockout; next_action: verify invoice IDs and escalate to billing ops"
    }
  ],
  "candidate_output": "category: billing/access\nurgency: high\nreason: duplicate charge and workspace lockout\nnext_action: ask for invoice IDs, verify account email, escalate to billing ops",
  "rubric": [
    { "name": "contains_exact_schema", "weight": 0.35, "must_include": ["category:", "urgency:", "reason:", "next_action:"] },
    { "name": "mentions_escalation", "weight": 0.25, "must_include": ["escalate"] },
    { "name": "avoids_unverified_claims", "weight": 0.25, "avoid": ["refund has been issued", "your account is fixed"] },
    { "name": "asks_for_identifiers", "weight": 0.15, "must_include": ["invoice", "email"] }
  ]
}
```

## Design principles

1. **Evaluation before prompt polish** — define what success means before tweaking wording.
2. **Hard output contracts** — use schemas, not vague instructions like “be concise.”
3. **Examples over vibes** — small ideal examples beat abstract advice.
4. **Regression checks in CI** — every prompt change should be reviewable.
5. **Model-agnostic by default** — useful for Claude, but not locked to one vendor.

## Roadmap

- [ ] Add `promptproof init` for new spec scaffolding
- [ ] Add JSON Schema validation
- [ ] Add optional Anthropic API runner for live candidate generation
- [ ] Add GitHub Action that comments score deltas on PRs
- [ ] Add curated prompt packs for docs, code review, legal summary, and issue triage
- [ ] Add npm publishing workflow

## Contributing

Contributions are welcome. Good first issues:

- Add a new example spec under `examples/`
- Improve scoring heuristics
- Add docs for maintainers using Claude Code
- Add adapters for other output formats

Please keep examples realistic and avoid copying proprietary prompts.

## License

MIT
