import React, { useEffect, useState } from "react";
import { getAnalysisHistory } from "../services/resumeService";
import Stats from "../components/Dashboards/Stats";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalysisHistory()
      .then((res) => {
        const list = res?.data || res || [];
        setHistory(Array.isArray(list) ? list : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Analysis History</h2>

      {history.length === 0 && <p>No analysis history found.</p>}

      {history.length > 0 && (
        <>
          <Stats history={history} />

          {history.map((h) => (
            <div key={h._id} style={{ marginTop: 10 }}>
              <strong>{h.matchScore}%</strong> —{" "}
              {new Date(h.createdAt).toLocaleDateString()}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default History;

