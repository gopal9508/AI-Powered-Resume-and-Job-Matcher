// src/services/advancedResumeAnalysis.js

const extractWords = (text = "") =>
  text
    .toLowerCase()
    .split(/\W+/)
    .filter(w => w.length > 3);

const unique = arr => [...new Set(arr)];

export const advancedAnalyzeResume = (resumeSections, jobDescription) => {
  const jdWords = unique(extractWords(jobDescription));

  const sectionScores = {
    skills: 0,
    experience: 0,
    education: 0,
    keywords: 0,
  };

  const missingKeywords = [];

  const resumeTextCombined = Object.values(resumeSections).join(" ");
  const resumeWords = new Set(extractWords(resumeTextCombined));

  let matched = 0;

  jdWords.forEach(word => {
    if (resumeWords.has(word)) {
      matched++;
    } else {
      missingKeywords.push(word);
    }
  });

  // Section-wise scoring
  if (resumeSections.skills) {
    sectionScores.skills =
      Math.min(100, (matched / jdWords.length) * 100);
  }

  if (resumeSections.experience) {
    sectionScores.experience =
      Math.min(100, (matched / jdWords.length) * 80);
  }

  if (resumeSections.education) {
    sectionScores.education =
      Math.min(100, (matched / jdWords.length) * 60);
  }

  sectionScores.keywords =
    Math.min(100, (matched / jdWords.length) * 100);

  // Weighted final score
let matchScore = Math.round(
  sectionScores.skills * 0.4 +
  sectionScores.experience * 0.3 +
  sectionScores.education * 0.1 +
  sectionScores.keywords * 0.2
);

// Normalize low scores (UX friendly)
if (matchScore < 30) {
  matchScore += 15;
}

matchScore = Math.min(matchScore, 100);


  const atsScore = Math.min(
    100,
    Math.round((matched / jdWords.length) * 100)
  );

  return {
    matchScore,
    atsScore,
    sectionScores,
    missingKeywords: missingKeywords.slice(0, 15),
    suggestions: [
      "Add missing keywords naturally in skills and experience",
      "Use measurable results in experience (numbers, impact)",
      "Optimize resume format for ATS (simple headings)",
    ],
  };
};
