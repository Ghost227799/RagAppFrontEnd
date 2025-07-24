import React, { useState } from "react";
import { login, register } from "../api/auth";

type AuthMode = "login" | "register";

export default function AuthLanding({ onAuthSuccess }: { onAuthSuccess: (token: string) => void }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await login(email, password);
        if (res && res.token) {
          onAuthSuccess(res.token);
        } else {
          throw new Error("No token received from server");
        }
      } else {
        // Register then login to get token
        await register(name, email, password);
        const res = await login(email, password);
        if (res && res.token) {
          onAuthSuccess(res.token);
        } else {
          throw new Error("No token received from server after registration");
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-landing" style={{ maxWidth: 400, margin: "60px auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>{mode === "login" ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {mode === "register" && (
            <div>
              <label htmlFor="auth-name" style={{ display: "block", marginBottom: 4 }}>Name</label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}
          <div>
            <label htmlFor="auth-email" style={{ display: "block", marginBottom: 4 }}>Email</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="auth-password" style={{ display: "block", marginBottom: 4 }}>Password</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>
        {error && <div style={{ color: "red", margin: "8px 0" }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ width: "100%", margin: "8px 0" }}>
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>
      </form>
      <div style={{ textAlign: "center" }}>
        {mode === "login" ? (
          <span>
            Don't have an account?{" "}
            <button type="button" onClick={() => setMode("register")} disabled={loading} style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}>
              Register
            </button>
          </span>
        ) : (
          <span>
            Already have an account?{" "}
            <button type="button" onClick={() => setMode("login")} disabled={loading} style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}>
              Login
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
