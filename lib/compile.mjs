function tag(name, value) {
  if (Array.isArray(value)) {
    return `<${name}>\n${value.map((item) => `- ${item}`).join('\n')}\n</${name}>`;
  }
  return `<${name}>\n${value ?? ''}\n</${name}>`;
}

export function compilePrompt(spec) {
  const examples = (spec.examples ?? [])
    .map((example, index) => `<example id="${index + 1}">\n<input>${example.input}</input>\n<ideal>${example.ideal}</ideal>\n</example>`)
    .join('\n\n');

  return [
    tag('task', spec.task),
    tag('context', spec.context),
    tag('constraints', spec.constraints ?? []),
    tag('output_schema', spec.output_schema ?? []),
    tag('examples', examples),
    'Follow the output schema exactly. If required information is missing, say what is missing instead of inventing it.'
  ].join('\n\n');
}
