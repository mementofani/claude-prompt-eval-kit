function normalize(text = '') {
  return String(text).toLowerCase().replace(/\s+/g, ' ').trim();
}

function includesAll(output, terms = []) {
  if (!terms.length) return 1;
  const haystack = normalize(output);
  const hits = terms.filter((term) => haystack.includes(normalize(term))).length;
  return hits / terms.length;
}

function avoidsAll(output, terms = []) {
  if (!terms.length) return 1;
  const haystack = normalize(output);
  const violations = terms.filter((term) => haystack.includes(normalize(term))).length;
  return Math.max(0, 1 - violations / terms.length);
}

export function scoreSpec(spec) {
  if (!spec || typeof spec !== 'object') throw new TypeError('spec must be an object');
  const output = spec.candidate_output ?? '';
  const rubric = Array.isArray(spec.rubric) ? spec.rubric : [];
  const totalWeight = rubric.reduce((sum, item) => sum + Number(item.weight ?? 1), 0) || 1;

  const checks = rubric.map((item) => {
    const includeScore = includesAll(output, item.must_include);
    const avoidScore = avoidsAll(output, item.avoid);
    const score = Number(((includeScore + avoidScore) / 2).toFixed(4));
    return { name: item.name, weight: item.weight ?? 1, score };
  });

  const weighted = checks.reduce((sum, item) => sum + item.score * Number(item.weight ?? 1), 0);
  const score = Number((weighted / totalWeight).toFixed(4));

  return {
    name: spec.name,
    score,
    passed: score >= Number(spec.pass_threshold ?? 0.8),
    pass_threshold: Number(spec.pass_threshold ?? 0.8),
    checks
  };
}

export function compareSpecs(baseline, candidate) {
  const base = scoreSpec(baseline);
  const next = scoreSpec(candidate);
  return {
    baseline: base,
    candidate: next,
    delta: Number((next.score - base.score).toFixed(4)),
    improved: next.score > base.score
  };
}
