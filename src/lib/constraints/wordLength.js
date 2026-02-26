import { getWords } from '../engine/analyzer.js';

export default {
  id: 'wordLength',
  name: 'Word Length Limit',
  description: 'No word longer than N letters',
  difficulty: 2,
  parameters: [
    {
      id: 'maxLength',
      label: 'Maximum letters',
      type: 'number',
      min: 2,
      max: 10,
      default: 5
    }
  ],
  validate(text, params) {
    const maxLength = params.maxLength || 5;
    const words = getWords(text);
    const violations = [];

    for (const word of words) {
      if (word.word.length > maxLength) {
        violations.push({
          start: word.start,
          end: word.end,
          message: `"${word.word}" is ${word.word.length} letters (max ${maxLength})`
        });
      }
    }

    return violations;
  }
};
