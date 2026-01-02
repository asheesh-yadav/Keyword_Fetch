export const matchKeywords = (text, keywords = []) => {
  const lowerText = text.toLowerCase();

  return keywords.filter((keyword) =>
    lowerText.includes(keyword.toLowerCase())
  );
};
