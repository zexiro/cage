/**
 * Text analysis utilities — splits raw text into structured units
 * for constraint validation.
 */

/**
 * Split text into word tokens with position info.
 * Returns array of { word, start, end, index }
 */
export function getWords(text) {
  const words = [];
  const regex = /[a-zA-Z\u00C0-\u024F''\-]+/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    words.push({
      word: match[0],
      start: match.index,
      end: match.index + match[0].length,
      index: words.length
    });
  }
  return words;
}

/**
 * Split text into sentences with position info.
 * A sentence ends at . ! ? or newline followed by uppercase/start.
 * Returns array of { text, start, end, index, words }
 */
export function getSentences(text) {
  if (!text.trim()) return [];

  const sentences = [];
  const regex = /[^.!?\n]+(?:[.!?]+|$|\n)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const raw = match[0];
    if (!raw.trim()) continue;
    const start = match.index;
    const end = start + raw.length;
    const words = getWords(raw).map(w => ({
      ...w,
      start: w.start + start,
      end: w.end + start
    }));
    if (words.length > 0) {
      sentences.push({
        text: raw,
        start,
        end,
        index: sentences.length,
        words
      });
    }
  }

  // If no sentence-ending punctuation found, treat the whole text as one sentence
  if (sentences.length === 0 && text.trim()) {
    const words = getWords(text);
    if (words.length > 0) {
      sentences.push({
        text,
        start: 0,
        end: text.length,
        index: 0,
        words
      });
    }
  }

  return sentences;
}

/**
 * Split text into paragraphs (separated by blank lines).
 * Returns array of { text, start, end, index, words }
 */
export function getParagraphs(text) {
  const paragraphs = [];
  const regex = /[^\n]+((\n(?!\n))[^\n]+)*/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const raw = match[0];
    if (!raw.trim()) continue;
    const start = match.index;
    const end = start + raw.length;
    const words = getWords(raw).map(w => ({
      ...w,
      start: w.start + start,
      end: w.end + start
    }));
    if (words.length > 0) {
      paragraphs.push({
        text: raw,
        start,
        end,
        index: paragraphs.length,
        words
      });
    }
  }

  return paragraphs;
}
