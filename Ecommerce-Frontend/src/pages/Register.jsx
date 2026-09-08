import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("buyer"); // 'buyer' or 'artisan'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      // Call register through AuthContext
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      // Redirect user upon successful registration
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Registration failed. Please check your information and try again.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-container">
        {/* Card */}
        <div className="register-card">
          <div className="register-heading">
            <h1>Create Account</h1>
          </div>

          {/* Backend / Validation Error Banner */}
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
          <form className="register-form" onSubmit={handleSubmit}>
            {/* Account Type Selector */}
            <div className="register-field">
              <label>I want to join as a:</label>
              <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                <label
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "8px 12px",
                    border: `1px solid ${role === "buyer" ? "#d97706" : "#e5e7eb"}`,
                    backgroundColor: role === "buyer" ? "#fffbeb" : "#ffffff",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="buyer"
                    checked={role === "buyer"}
                    onChange={() => setRole("buyer")}
                    style={{ margin: 0 }}
                  />
                  <span>Craft Lover (Buyer)</span>
                </label>

                <label
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "8px 12px",
                    border: `1px solid ${role === "artisan" ? "#d97706" : "#e5e7eb"}`,
                    backgroundColor: role === "artisan" ? "#fffbeb" : "#ffffff",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="artisan"
                    checked={role === "artisan"}
                    onChange={() => setRole("artisan")}
                    style={{ margin: 0 }}
                  />
                  <span>Maker (Artisan)</span>
                </label>
              </div>
            </div>

            {/* Name */}
            <div className="register-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="register-field">
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
            <div className="register-field">
              <label htmlFor="password">Password</label>
              <div className="register-password-input">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password (min. 6 characters)"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="register-field">
              <label htmlFor="confirm-password">Confirm Password</label>
              <div className="register-password-input">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="register-submit-btn"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? (
                <>
                  <Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="register-divider">
            <span>or</span>
          </div>

          {/* Login */}
          <div className="register-login">
            <span>Already have an account?</span>
            <Link to="/login">Sign In</Link>
          </div>
        </div>

        {/* Footer text */}
        <p className="register-bottom-text">
          By continuing, you agree to our
          <Link to="/terms"> Terms </Link>
          and
          <Link to="/privacy"> Privacy Policy</Link>.
        </p>
      </section>
    </main>
  );
}

export default Register;