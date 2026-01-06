export const matchKeywords = (text = "", keywords = []) => {
  if (!text || !Array.isArray(keywords)) return [];

  const normalizedText = text
    .toLowerCase()
    .normalize("NFKC"); // IMPORTANT for Japanese / Unicode

  return keywords.filter((keyword) => {
    if (!keyword) return false;

    const cleanKeyword = keyword
      .toString()
      .trim()
      .toLowerCase()
      .normalize("NFKC");

    // Escape regex safely
    const escaped = cleanKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    try {
      return new RegExp(escaped, "i").test(normalizedText);
    } catch {
      return false;
    }
  });
};
