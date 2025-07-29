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
    <div className="auth-landing">
      <div className="auth-landing-header">
        <h1>PDF Knowledge Assistant</h1>
        <img
          src="/src/assets/doc-magnifying-glass-in.svg"
          alt="Document search"
        />
        <p className="tagline">
          <strong>Upload any PDF and ask questions from it!</strong>
        </p>
        <p className="description">
          Our AI-powered tool analyzes your documents instantly and provides accurate answers to your questions.
          Simply upload your PDF, ask away, and get the information you need in seconds.
        </p>
      </div>

      <div className="auth-form-container">
        <h2>{mode === "login" ? "Login" : "Register"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-form">
            {mode === "register" && (
              <div>
                <label htmlFor="auth-name" className="auth-form-field">Name</label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  disabled={loading}
                  className="auth-form-input"
                />
              </div>
            )}
            <div>
              <label htmlFor="auth-email" className="auth-form-field">Email</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
                className="auth-form-input"
              />
            </div>
            <div>
              <label htmlFor="auth-password" className="auth-form-field">Password</label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
                className="auth-form-input"
              />
            </div>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="auth-submit-button"
          >
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </button>
        </form>
        <div className="auth-toggle-container">
          {mode === "login" ? (
            <span>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                disabled={loading}
                className="auth-toggle-button"
              >
                Register
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                disabled={loading}
                className="auth-toggle-button"
              >
                Login
              </button>
            </span>
          )}
        </div>
      </div>
    </div>

  );
}
