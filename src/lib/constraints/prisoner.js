export default {
  id: 'prisoner',
  name: "Prisoner's Constraint",
  description: 'Only letters with no ascenders or descenders (a c e i m n o r s u v w x z)',
  difficulty: 5,
  parameters: [],
  validate(text, _params) {
    const allowed = new Set('aceimnorsuvwxz'.split(''));
    const violations = [];

    for (let i = 0; i < text.length; i++) {
      const ch = text[i].toLowerCase();
      // Only check alphabetic characters
      if (/[a-z]/i.test(text[i]) && !allowed.has(ch)) {
        violations.push({
          start: i,
          end: i + 1,
          message: `Letter "${text[i]}" has ascenders or descenders`
        });
      }
    }

    return violations;
  }
};
