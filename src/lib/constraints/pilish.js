import { getWords } from '../engine/analyzer.js';

// First 50 digits of pi (after the 3.)
const PI_DIGITS = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9, 5, 0, 2, 8, 8, 4, 1, 9, 7, 1, 6, 9, 3, 9, 9, 3, 7, 5, 1];

export default {
  id: 'pilish',
  name: 'Pilish',
  description: 'Word lengths must follow the digits of pi (3, 1, 4, 1, 5, 9, 2, 6...)',
  difficulty: 5,
  parameters: [],
  validate(text, _params) {
    const words = getWords(text);
    const violations = [];

    for (let i = 0; i < words.length; i++) {
      const digit = PI_DIGITS[i % PI_DIGITS.length];
      // 0 in pi means a 10-letter word
      const expected = digit === 0 ? 10 : digit;
      const actual = words[i].word.length;

      if (actual !== expected) {
        violations.push({
          start: words[i].start,
          end: words[i].end,
          message: `Word ${i + 1} should be ${expected} letters (pi digit: ${digit}), got ${actual}`
        });
      }
    }

    return violations;
  }
};
