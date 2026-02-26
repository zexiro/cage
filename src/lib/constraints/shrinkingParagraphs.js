import { getParagraphs } from '../engine/analyzer.js';

export default {
  id: 'shrinkingParagraphs',
  name: 'Shrinking Paragraphs',
  description: 'Each paragraph must have fewer words than the previous one',
  difficulty: 2,
  parameters: [],
  validate(text, _params) {
    const paragraphs = getParagraphs(text);
    const violations = [];

    for (let i = 1; i < paragraphs.length; i++) {
      const prev = paragraphs[i - 1];
      const curr = paragraphs[i];

      if (curr.words.length >= prev.words.length) {
        // Highlight the entire paragraph
        violations.push({
          start: curr.start,
          end: curr.end,
          message: `Paragraph ${i + 1} has ${curr.words.length} words (must be fewer than ${prev.words.length})`
        });
      }
    }

    return violations;
  }
};
