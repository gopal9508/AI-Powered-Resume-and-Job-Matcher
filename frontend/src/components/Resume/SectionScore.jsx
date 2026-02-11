import ProgressBar from "../common/ProgressBar";

const labels = {
  skills: "Skills Match",
  experience: "Experience Match",
  education: "Education Match",
  keywords: "Keyword Coverage",
};

const SectionScore = ({ scores }) => {
  return (
    <div className="my-6">
      <h3 className="font-semibold mb-3">
        Section-wise Breakdown
      </h3>

      {Object.entries(scores).map(([key, value]) => (
        <div key={key} className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>{labels[key] || key}</span>
            <span>{value}%</span>
          </div>

          <ProgressBar value={value} />
        </div>
      ))}
    </div>
  );
};

export default SectionScore;

