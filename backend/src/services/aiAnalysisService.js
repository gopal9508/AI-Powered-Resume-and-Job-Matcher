export const analyzeWithAI = (resumeText, jobDescription) => {

  const resumeWords = new Set(
    resumeText.toLowerCase().split(/\W+/)
  );

  const jobWords = new Set(
    jobDescription.toLowerCase().split(/\W+/)
  );

  let matched = 0;
  let missingKeywords = [];

  jobWords.forEach(word => {
    if (resumeWords.has(word)) {
      matched++;
    } else if (word.length > 3) {
      missingKeywords.push(word);
    }
  });

  const matchPercentage = Math.round(
    (matched / jobWords.size) * 100
  );

  return {
    matchPercentage,
    matchedKeywordsCount: matched,
    missingKeywords: missingKeywords.slice(0, 10),
    suggestions: [
      "Add missing keywords naturally",
      "Use numbers in experience",
      "Optimize resume for ATS"
    ]
  };
};
