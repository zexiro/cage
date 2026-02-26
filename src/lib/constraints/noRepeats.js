import { getWords } from '../engine/analyzer.js';

export default {
  id: 'noRepeats',
  name: 'No Repeats',
  description: 'Every word can only appear once in the entire text',
  difficulty: 3,
  parameters: [],
  validate(text, _params) {
    const words = getWords(text);
    const seen = new Map(); // lowercase word -> first occurrence index
    const violations = [];

    for (const word of words) {
      const lower = word.word.toLowerCase();
      if (seen.has(lower)) {
        violations.push({
          start: word.start,
          end: word.end,
          message: `"${word.word}" was already used`
        });
      } else {
        seen.set(lower, word.start);
      }
    }

    return violations;
  }
};
