import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

interface AuthPageProps {
  mode: "login" | "signup";
}

export function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        signup({ name, email, password });
      } else {
        login({ email, password });
      }

      navigate("/app", { replace: true });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong.");
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-visual">
        <div className="auth-mark">P</div>
        <p className="eyebrow">Pulse social</p>
        <h1>{mode === "login" ? "Welcome back to the feed" : "Create your Pulse account"}</h1>
        <p>
          A calmer social workspace for posting, following, and collaborating without the clutter.
        </p>

        <div className="auth-glow-card">
          <strong>{mode === "login" ? "Fast access" : "Built for creators"}</strong>
          <span>{mode === "login" ? "Pick up where you left off." : "Start with a clean, focused feed."}</span>
        </div>
      </section>

      <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-card-header">
          <p className="eyebrow">{mode === "login" ? "Sign in" : "Sign up"}</p>
          <h2 id="auth-title">{mode === "login" ? "Login to Pulse" : "Join Pulse"}</h2>
          <p>
            {mode === "login"
              ? "Use any email and password to enter the demo workspace."
              : "Create a profile to unlock the protected dashboard."}
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          {mode === "signup" ? (
            <label>
              <span>Name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ayushi Jain" />
            </label>
          ) : null}

          <label>
            <span>Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              type="email"
            />
          </label>

          <label>
            <span>Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              type="password"
            />
          </label>

          {mode === "signup" ? (
            <label>
              <span>Confirm password</span>
              <input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                type="password"
              />
            </label>
          ) : null}

          {error ? <p className="auth-error">{error}</p> : null}

          <button className="primary-button auth-submit" type="button" onClick={handleSubmit}>
            {mode === "login" ? "Login" : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
          <Link to={mode === "login" ? "/signup" : "/login"}>
            {mode === "login" ? "Sign up" : "Log in"}
          </Link>
        </p>
      </section>
    </main>
  );
}
