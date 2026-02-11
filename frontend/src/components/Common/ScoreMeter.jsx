import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function ScoreMeter({ score }) {
  return (
    <div style={{ width: 150 }}>
      <CircularProgressbar
        value={score}
        text={`${score}%`}
        styles={buildStyles({
          textColor: "#111",
          pathColor: score > 70 ? "#22c55e" : score > 40 ? "#f59e0b" : "#ef4444",
          trailColor: "#e5e7eb",
        })}
      />
      <p style={{ textAlign: "center", marginTop: 10 }}>Match Score</p>
    </div>
  );
}

export default ScoreMeter;
