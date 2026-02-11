const getStatus = (score) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Average";
  return "Needs Improvement";
};

const ScoreCard = ({ matchScore, atsScore }) => {
  return (
    <div className="grid grid-cols-2 gap-4 my-6">
      <div className="bg-green-50 border p-4 rounded">
        <p className="text-sm text-gray-500">Resume Match</p>
        <p className="text-3xl font-bold">{matchScore}%</p>
        <p className="text-sm mt-1">
          {getStatus(matchScore)}
        </p>
      </div>

      <div className="bg-purple-50 border p-4 rounded">
        <p className="text-sm text-gray-500">ATS Score</p>
        <p className="text-3xl font-bold">{atsScore}/100</p>
        <p className="text-sm mt-1">
          {getStatus(atsScore)}
        </p>
      </div>
    </div>
  );
};

export default ScoreCard;
