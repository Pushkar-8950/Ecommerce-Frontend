import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to previous route if user was redirected to login, or home page
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      // Authenticate with backend API
      const authData = await login(email.trim(), password);
      const authenticatedUser = authData?.user;

      // Role-based redirection: artisans go to /artisan, buyers go to intended destination or /
      if (authenticatedUser?.role === "artisan") {
        navigate("/artisan", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Invalid email or password. Please verify your credentials.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-container">
        {/* Card */}
        <div className="login-card">
          <div className="login-heading">
            <h1>Sign In</h1>
          </div>

          {/* Backend Validation Error Banner */}
          {errorMessage && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                borderRadius: "6px",
                padding: "10px 14px",
                marginBottom: "16px",
                fontSize: "14px",
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="login-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-password-label">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              <div className="login-password-input">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? (
                <>
                  <Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="login-divider">
            <span>or</span>
          </div>

          {/* Guest */}
          <Link to="/explore" className="guest-login-btn">
            Continue as Guest
          </Link>

          {/* Register */}
          <div className="login-register">
            <span>New to CraftConnect?</span>
            <Link to="/register">Create an account</Link>
          </div>
        </div>

        {/* Footer text */}
        <p className="login-bottom-text">
          By continuing, you agree to our
          <Link to="/terms"> Terms </Link>
          and
          <Link to="/privacy"> Privacy Policy</Link>.
        </p>
      </section>
    </main>
  );
}

export default Login;