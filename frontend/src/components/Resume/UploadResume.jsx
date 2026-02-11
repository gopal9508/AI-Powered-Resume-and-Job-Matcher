import { useState } from "react";
import { uploadResume } from "../../services/resumeService";

const ResumeUpload = ({ onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume file");
      return;
    }

    setLoading(true);
    try {
      await uploadResume(file);
      alert("Resume uploaded successfully");
      onSuccess?.();
    } catch (err) {
      alert("Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-dashed p-6 rounded text-center">
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Uploading..." : "Upload Resume"}
      </button>
    </div>
  );
};

export default ResumeUpload;
