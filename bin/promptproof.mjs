#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { scoreSpec, compareSpecs } from '../lib/score.mjs';
import { compilePrompt } from '../lib/compile.mjs';

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    console.error(`Could not read JSON file: ${path}`);
    console.error(error.message);
    process.exit(1);
  }
}

const [command, ...args] = process.argv.slice(2);

if (!command || ['help', '--help', '-h'].includes(command)) {
  console.log(`promptproof\n\nUsage:\n  promptproof score <spec.json>\n  promptproof compile <spec.json>\n  promptproof compare <baseline.json> <candidate.json>`);
  process.exit(0);
}

if (command === 'score') {
  const spec = await readJson(args[0]);
  console.log(JSON.stringify(scoreSpec(spec), null, 2));
} else if (command === 'compile') {
  const spec = await readJson(args[0]);
  console.log(compilePrompt(spec));
} else if (command === 'compare') {
  const baseline = await readJson(args[0]);
  const candidate = await readJson(args[1]);
  console.log(JSON.stringify(compareSpecs(baseline, candidate), null, 2));
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
