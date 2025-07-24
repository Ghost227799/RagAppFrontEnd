import "./App.css";
import UploadPdf from "./components/UploadPdf";
import RagSearch from "./components/RagSearch";
import AuthLanding from "./components/AuthLanding";
import { AuthProvider, useAuth } from "./context/AuthContext";

import { logout as logoutApi } from "./api/auth";

function AppContent() {
  const { token, setToken } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      // ignore error, just clear token
    }
    setToken(null);
  };

  if (!token) {
    return <AuthLanding onAuthSuccess={setToken} />;
  }

  return (
    <div>
      <div
        style={{
          width: "150%",
          display: "flex",
          flexDirection: "column",
          gap: "2.5rem"
        }}
      >
        <div className="section">
          <h2>📄 RAG PDF Upload</h2>
          <UploadPdf />
        </div>
        <div className="section">
          <h2>🔍 RAG Search</h2>
          <RagSearch />
        </div>
      </div>
      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
