import React from "react";

const JobCard = ({ job }) => {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        background: "#ffffff",
      }}
    >
      <h3>{job.title}</h3>
      <p style={{ color: "#6b7280" }}>{job.company}</p>

      <p>
        <strong>Location:</strong> {job.location || "Remote"}
      </p>

      <p>
        <strong>Match:</strong>{" "}
        <span style={{ color: "#2563eb" }}>
          {job.matchScore || 0}%
        </span>
      </p>

      {job.applyLink && (
        <a
          href={job.applyLink}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#2563eb", fontWeight: 500 }}
        >
          Apply →
        </a>
      )}
    </div>
  );
};

export default JobCard;
