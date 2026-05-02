import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreSpec } from '../lib/score.mjs';

const spec = {
  name: 'basic',
  candidate_output: 'category: billing\nurgency: high\nnext_action: escalate with invoice id',
  rubric: [
    { name: 'schema', weight: 1, must_include: ['category:', 'urgency:', 'next_action:'] },
    { name: 'avoid', weight: 1, avoid: ['refund has been issued'] }
  ]
};

test('scores passing prompt specs', () => {
  const result = scoreSpec(spec);
  assert.equal(result.passed, true);
  assert.equal(result.score, 1);
});

test('penalizes missing required terms', () => {
  const result = scoreSpec({ ...spec, candidate_output: 'category: billing' });
  assert.ok(result.score < 1);
});
