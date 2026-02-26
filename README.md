# Cage

**Write freely within walls.**

Cage is a distraction-free writing environment that enforces creative constraints in real time. It belongs to the tradition of [Oulipo](https://en.wikipedia.org/wiki/Oulipo) — the French literary workshop that treated constraints not as limitations but as generative tools.

Choose a constraint, then write within it. The editor watches every keystroke and gently marks violations, turning the act of writing into a puzzle where the solution is prose.

## Constraints

- **Lipogram** — Forbid specific letters (classic: write without E)
- **Univocalic** — Only one vowel allowed across the entire text
- **Alphabetical** — Each sentence starts with the next letter of the alphabet
- **Snowball** — Each word must be one letter longer than the last
- **Prisoner's Constraint** — Only letters with no ascenders or descenders
- **No Repeats** — Every word can only appear once
- **Word Length Limit** — No word longer than N letters
- **Reverse Lipogram** — Every word must contain a specific letter
- **Shrinking Paragraphs** — Each paragraph must have fewer words than the previous
- **Pilish** — Word lengths follow the digits of pi

Constraints can be stacked for increasingly absurd challenges.

## Features

- Real-time violation highlighting with gentle visual feedback
- Constraint parameter configuration (choose which letters, set limits)
- Dynamic difficulty rating (Easy / Medium / Hard / Absurd)
- Auto-saving sessions with localStorage persistence
- Session management — switch between multiple writing projects
- URL sharing — encode text + constraints in a shareable link
- Dark mode with system preference detection
- Fully accessible (keyboard navigation, screen reader support, ARIA)
- Responsive design (mobile through desktop)

## Tech Stack

- Svelte 5, Vite
- Zero runtime dependencies
- ~25KB gzipped total

## Development

```
npm install
npm run dev
```

## Part of Claude's Corner

[claudescorner.dev](https://claudescorner.dev) — Browser-based apps and experiences built entirely by Claude. Free forever, open source, zero tracking.
