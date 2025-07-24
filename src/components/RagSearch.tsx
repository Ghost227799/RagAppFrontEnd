import React, { useState } from "react";
import { searchRag } from "../api/rag";
import ReactMarkdown from "react-markdown";

const RagSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search query.");
      setResult(null);
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await searchRag(query);
      let resultText = "";
      if (response.ok) {
        try {
          const data = await response.json();
          resultText = typeof data === "string" ? data : JSON.stringify(data?.response, null, 2);
        } catch (e) {
          // Not JSON or empty body
          resultText = await response.text();
        }
        setResult(resultText || "No result returned.");
      } else {
        setError("Search failed. Status: " + response.status);
      }
      // For debugging
      // eslint-disable-next-line no-console
      console.log("Search response:", response.status, resultText);
    } catch (err) {
      setError("An error occurred during search.");
      // eslint-disable-next-line no-console
      console.error("Search error:", err);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
      <div style={{ display: "flex", flexDirection: "row", gap: "0.7rem" }}>
        <input
          type="text"
          value={query}
          placeholder="Enter search query"
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          style={{ width: "300px" }}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {result && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(44,54,80,0.95) 80%, rgba(186,255,57,0.10) 100%)",
            borderLeft: "5px solid #baff39",
            boxShadow: "0 4px 24px 0 rgba(186,255,57,0.10)",
            padding: "1.2rem 1.4rem",
            borderRadius: "1rem",
            maxWidth: "600px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            color: "#f3f4f6",
            fontSize: "1.08rem",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            marginTop: "0.5rem",
            overflowX: "auto",
          }}
        >
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => <p style={{ margin: "0 0 0.7em 0" }} {...props} />,
              code: ({ node, ...props }) => (
                <code
                  style={{
                    background: "#232946",
                    color: "#baff39",
                    padding: "0.15em 0.4em",
                    borderRadius: "0.4em",
                    fontSize: "0.98em",
                  }}
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => <ul style={{ margin: "0.5em 0 0.5em 1.2em" }} {...props} />,
              ol: ({ node, ...props }) => <ol style={{ margin: "0.5em 0 0.5em 1.2em" }} {...props} />,
              li: ({ node, ...props }) => <li style={{ marginBottom: "0.3em" }} {...props} />,
            }}
          >
            {result}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default RagSearch;
