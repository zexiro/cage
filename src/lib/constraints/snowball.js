import { getSentences } from '../engine/analyzer.js';

export default {
  id: 'snowball',
  name: 'Snowball',
  description: 'Each word must be one letter longer than the last (resets each sentence)',
  difficulty: 4,
  parameters: [],
  validate(text, _params) {
    const sentences = getSentences(text);
    const violations = [];

    for (const sentence of sentences) {
      for (let i = 0; i < sentence.words.length; i++) {
        const word = sentence.words[i];
        const expectedLength = i + 1;
        const actualLength = word.word.replace(/[''\\-]/g, '').length;

        if (actualLength !== expectedLength) {
          violations.push({
            start: word.start,
            end: word.end,
            message: `Word ${i + 1} should be ${expectedLength} letter${expectedLength > 1 ? 's' : ''} (got ${actualLength})`
          });
        }
      }
    }

    return violations;
  }
};
