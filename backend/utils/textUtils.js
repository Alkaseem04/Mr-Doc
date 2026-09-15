// Levenshtein Distance Algorithm
const levenshteinDistance = (str1 = '', str2 = '') => {
  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null)
  );

  // Fill first row with column indices
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }

  // Fill first column with row indices
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }

  // Fill the rest of the matrix
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator, // substitution
      );
    }
  }

  return track[str2.length][str1.length];
};

// Normalize text for comparison
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/gi, '') // Remove punctuation
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
};

// Find best match from array of options
const findBestMatch = (input, options) => {
  let bestMatch = null;
  let bestSimilarity = 0;

  for (const option of options) {
    const distance = levenshteinDistance(input.toLowerCase(), option.toLowerCase());
    const similarity = 1 - (distance / Math.max(input.length, option.length));
    
    if (similarity > bestSimilarity) {
      bestSimilarity = similarity;
      bestMatch = {
        option,
        similarity,
        distance
      };
    }
  }

  return bestMatch;
};

// Generate spelling suggestions
const generateSuggestions = (input, dictionary, maxSuggestions = 5) => {
  const suggestions = [];

  for (const word of dictionary) {
    const distance = levenshteinDistance(input.toLowerCase(), word.toLowerCase());
    const similarity = 1 - (distance / Math.max(input.length, word.length));
    
    // Only include suggestions with >50% similarity
    if (similarity > 0.5) {
      suggestions.push({
        word,
        similarity,
        distance
      });
    }
  }

  // Sort by similarity and return top suggestions
  return suggestions
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxSuggestions);
};

module.exports = {
  levenshteinDistance,
  normalizeText,
  findBestMatch,
  generateSuggestions
};