import { getSentences } from '../engine/analyzer.js';

export default {
  id: 'alphabetical',
  name: 'Alphabetical',
  description: 'Each sentence must start with the next letter of the alphabet',
  difficulty: 3,
  parameters: [],
  validate(text, _params) {
    const sentences = getSentences(text);
    const violations = [];

    sentences.forEach((sentence, i) => {
      const expectedChar = String.fromCharCode(65 + (i % 26)); // A-Z, wrapping
      const firstWord = sentence.words[0];
      if (!firstWord) return;

      const actual = firstWord.word[0].toUpperCase();
      if (actual !== expectedChar) {
        violations.push({
          start: firstWord.start,
          end: firstWord.start + 1,
          message: `Sentence ${i + 1} should start with "${expectedChar}" (got "${actual}")`
        });
      }
    });

    return violations;
  }
};
