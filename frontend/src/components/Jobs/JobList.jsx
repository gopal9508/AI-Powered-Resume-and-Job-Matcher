import React from "react";
import JobCard from "./JobCard";

const JobList = ({ jobs }) => {
  return (
    <div style={listStyle}>
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
};

const listStyle = {
  display: "grid",
  gap: 16,
  marginTop: 20,
};

export default JobList;
