export default {
  id: 'lipogram',
  name: 'Lipogram',
  description: 'Forbid specific letters from your writing',
  difficulty: 2,
  parameters: [
    {
      id: 'letters',
      label: 'Forbidden letters',
      type: 'letters',
      default: ['e']
    }
  ],
  validate(text, params) {
    const forbidden = new Set((params.letters || ['e']).map(l => l.toLowerCase()));
    const violations = [];

    for (let i = 0; i < text.length; i++) {
      const ch = text[i].toLowerCase();
      if (forbidden.has(ch)) {
        violations.push({
          start: i,
          end: i + 1,
          message: `Letter "${text[i]}" is forbidden`
        });
      }
    }

    return violations;
  }
};
