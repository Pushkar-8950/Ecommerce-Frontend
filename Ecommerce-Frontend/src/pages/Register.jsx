import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Registration will be connected later.
    console.log("Register submitted", {
      name,
      email,
      password,
      confirmPassword,
    });
  };

  return (
    <main className="register-page">

      <section className="register-container">

        {/* Card */}

        <div className="register-card">

          <div className="register-heading">
            <h1>Create Account</h1>
          </div>


          {/* Form */}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {/* Name */}

            <div className="register-field">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />

            </div>


            {/* Email */}

            <div className="register-field">

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

            <div className="register-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="register-password-input">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
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


            {/* Confirm Password */}

            <div className="register-field">

              <label htmlFor="confirm-password">
                Confirm Password
              </label>

              <div className="register-password-input">

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
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
              className="register-submit-btn"
            >
              Create Account
              <ArrowRight size={17} />
            </button>

          </form>


          {/* Divider */}

          <div className="register-divider">
            <span>or</span>
          </div>


          {/* Login */}

          <div className="register-login">

            <span>Already have an account?</span>

            <Link to="/login">
              Sign In
            </Link>

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