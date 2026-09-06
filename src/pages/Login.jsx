import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Authentication will be connected later.
    console.log("Login submitted", {
      email,
      password,
    });
  };

  return (
    <main className="login-page">

      <section className="login-container">

        {/* Card */}

        <div className="login-card">

          <div className="login-heading">
            <h1>Sign In</h1>
          </div>


          {/* Form */}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* Email */}

            <div className="login-field">

              <label htmlFor="email">
                Email or Phone
              </label>

              <input
                id="email"
                type="text"
                placeholder="Enter your email or phone"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />

            </div>


            {/* Password */}

            <div className="login-field">

              <div className="login-password-label">

                <label htmlFor="password">
                  Password
                </label>

                <Link to="/forgot-password">
                  Forgot Password?
                </Link>

              </div>


              <div className="login-password-input">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* Submit */}

            <button
              type="submit"
              className="login-submit-btn"
            >
              Sign In
              <ArrowRight size={17} />
            </button>

          </form>


          {/* Divider */}

          <div className="login-divider">
            <span>or</span>
          </div>


          {/* Guest */}

          <Link
            to="/explore"
            className="guest-login-btn"
          >
            Continue as Guest
          </Link>


          {/* Register */}

          <div className="login-register">

            <span>New to CraftConnect?</span>

            <Link to="/register">
              Create an account
            </Link>

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