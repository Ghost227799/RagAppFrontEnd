import React, { useState } from "react";
import { uploadPdf } from "../api/rag";

const UploadPdf: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first.");
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const response = await uploadPdf(file);
      let message = "";
      try {
        const data = await response.json();
        message = data?.message || "";
      } catch (e) {
        // Not JSON or empty body
        message = "";
      }
      if (response.ok) {
        setStatus("File uploaded successfully!" + (message ? ` (${message})` : ""));
      } else {
        setStatus("Upload failed." + (message ? ` (${message})` : ""));
      }
      // For debugging
      // eslint-disable-next-line no-console
      console.log("Upload response:", response.status, message);
    } catch (error) {
      setStatus("An error occurred during upload.");
      // eslint-disable-next-line no-console
      console.error("Upload error:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        disabled={loading}
      />
      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Uploading..." : "Upload PDF"}
      </button>
      {status && <div>{status}</div>}
    </div>
  );
};

export default UploadPdf;
