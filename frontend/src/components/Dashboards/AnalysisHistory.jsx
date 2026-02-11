import { useState } from "react";
import { analyzeResume } from "../services/resumeService";
import ScoreMeter from "../components/Common/ScoreMeter";
import KeywordsDisplay from "../components/Resume/KeywordsDisplay";
import Stats from "../components/Dashboard/Stats";

function Analyze() {
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    const res = await analyzeResume(jd);
    setResult(res.data);
  };

  return (
    <div>
      <h1>Resume Analysis</h1>

      <textarea
        placeholder="Paste job description"
        rows={6}
        onChange={(e) => setJd(e.target.value)}
      />

      <button onClick={handleAnalyze}>Analyze</button>

      {result && (
        <>
          <ScoreMeter score={result.matchScore} />
          <KeywordsDisplay
            present={result.keywords.present}
            missing={result.keywords.missing}
          />
          <Stats
            strengths={result.strengths}
            weaknesses={result.weaknesses}
          />
        </>
      )}
    </div>
  );
}

export default Analyze;
