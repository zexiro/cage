import { getWords } from './analyzer.js';

/**
 * Compute writing stats from text and violations.
 */
export function computeStats(text, violations) {
  const words = getWords(text);
  const wordCount = words.length;
  const charCount = text.length;
  const violationCount = violations.length;

  // Group violations by constraint
  const byConstraint = {};
  for (const v of violations) {
    if (!byConstraint[v.constraintId]) {
      byConstraint[v.constraintId] = { name: v.constraintName, count: 0 };
    }
    byConstraint[v.constraintId].count++;
  }

  return {
    wordCount,
    charCount,
    violationCount,
    byConstraint,
    isClean: violationCount === 0 && wordCount > 0
  };
}
