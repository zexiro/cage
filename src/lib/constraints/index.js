import lipogram from './lipogram.js';
import univocalic from './univocalic.js';
import alphabetical from './alphabetical.js';
import snowball from './snowball.js';
import prisoner from './prisoner.js';
import noRepeats from './noRepeats.js';
import wordLength from './wordLength.js';
import reverseLipogram from './reverseLipogram.js';
import shrinkingParagraphs from './shrinkingParagraphs.js';
import pilish from './pilish.js';

export const constraints = [
  lipogram,
  univocalic,
  alphabetical,
  snowball,
  prisoner,
  noRepeats,
  wordLength,
  reverseLipogram,
  shrinkingParagraphs,
  pilish
];

export const constraintMap = Object.fromEntries(
  constraints.map(c => [c.id, c])
);

/**
 * Get default parameters for a constraint.
 */
export function getDefaultParams(constraintId) {
  const constraint = constraintMap[constraintId];
  if (!constraint) return {};
  const params = {};
  for (const p of constraint.parameters) {
    params[p.id] = p.default;
  }
  return params;
}

/**
 * Calculate combined difficulty of active constraints.
 * Returns { level: number, label: string }
 */
export function getDifficulty(activeConstraints) {
  if (activeConstraints.length === 0) return { level: 0, label: 'Free' };

  let total = 0;
  for (const ac of activeConstraints) {
    const constraint = constraintMap[ac.id];
    if (constraint) total += constraint.difficulty;
  }

  // Stacking bonus: each additional constraint adds 1
  total += Math.max(0, activeConstraints.length - 1);

  if (total <= 2) return { level: 1, label: 'Easy' };
  if (total <= 4) return { level: 2, label: 'Medium' };
  if (total <= 7) return { level: 3, label: 'Hard' };
  return { level: 4, label: 'Absurd' };
}

/**
 * Run all active constraints against text.
 * Returns sorted, deduplicated violations.
 */
export function validate(text, activeConstraints) {
  if (!text || activeConstraints.length === 0) return [];

  const allViolations = [];
  for (const ac of activeConstraints) {
    const constraint = constraintMap[ac.id];
    if (!constraint) continue;
    const violations = constraint.validate(text, ac.params || {});
    for (const v of violations) {
      allViolations.push({
        ...v,
        constraintId: ac.id,
        constraintName: constraint.name
      });
    }
  }

  // Sort by start position
  allViolations.sort((a, b) => a.start - b.start || a.end - b.end);
  return allViolations;
}
