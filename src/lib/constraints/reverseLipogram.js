import { getWords } from '../engine/analyzer.js';

export default {
  id: 'reverseLipogram',
  name: 'Reverse Lipogram',
  description: 'Every word must contain a specific letter',
  difficulty: 3,
  parameters: [
    {
      id: 'letter',
      label: 'Required letter',
      type: 'letter',
      default: 's'
    }
  ],
  validate(text, params) {
    const required = (params.letter || 's').toLowerCase();
    const words = getWords(text);
    const violations = [];

    for (const word of words) {
      if (!word.word.toLowerCase().includes(required)) {
        violations.push({
          start: word.start,
          end: word.end,
          message: `"${word.word}" doesn't contain the letter "${required}"`
        });
      }
    }

    return violations;
  }
};
