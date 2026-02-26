export default {
  id: 'univocalic',
  name: 'Univocalic',
  description: 'Only one vowel allowed in the entire text',
  difficulty: 4,
  parameters: [
    {
      id: 'vowel',
      label: 'Allowed vowel',
      type: 'select',
      options: ['a', 'e', 'i', 'o', 'u'],
      default: 'a'
    }
  ],
  validate(text, params) {
    const allowed = (params.vowel || 'a').toLowerCase();
    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
    vowels.delete(allowed);

    const violations = [];
    for (let i = 0; i < text.length; i++) {
      const ch = text[i].toLowerCase();
      if (vowels.has(ch)) {
        violations.push({
          start: i,
          end: i + 1,
          message: `Only the vowel "${allowed}" is allowed`
        });
      }
    }
    return violations;
  }
};
