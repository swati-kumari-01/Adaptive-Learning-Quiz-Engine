import { useState } from "react";
import { registerUser } from "../api/registerApi";
import logo from "../assets/logo.png";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState("");

  // Password Regex: Min 8, 1 Upper, 1 Digit, 1 Symbol
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const checkPasswordStrength = (pass) => {
    if (!pass) {
      setPasswordStrength("");
      setPasswordFeedback("");
      return;
    }

    const missing = [];
    if (pass.length < 8) missing.push("8+ chars");
    if (!/[A-Z]/.test(pass)) missing.push("1 Uppercase");
    if (!/\d/.test(pass)) missing.push("1 Digit");
    if (!/[@$!%*?&]/.test(pass)) missing.push("1 Symbol (@$!%*?&)");

    if (missing.length === 0) {
      setPasswordStrength("Strong");
      setPasswordFeedback("Strong Password ✅");
    } else {
      setPasswordStrength("Weak");
      setPasswordFeedback(`Weak (Missing: ${missing.join(", ")})`);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
      checkPasswordStrength(e.target.value);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");


    // Email Validation Regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email id");
      return;
    }


    if (!passwordRegex.test(form.password)) {
      setError("Weak Password: Must contain 8+ chars, 1 Uppercase, 1 Digit, 1 Symbol");
      return;
    }

    try {
      await registerUser(form);
      setMessage("Registration successful! Please check your email to verify your account.");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed";

      setError(message);

    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="glass-card p-4 mx-3" style={{ maxWidth: "420px", width: "100%" }}>

        <div className="text-center mb-3">
          <img src={logo} alt="Quiz Logo" style={{ width: "80px" }} />
        </div>

        <div className="position-absolute top-0 start-0 m-3">
          <a href="/" className="text-secondary text-decoration-none">
            <i className="bi bi-arrow-left me-1"></i> Back
          </a>
        </div>

        <h3 className="heading-gradient text-center mb-4 pt-3">
          Student Registration
        </h3>

        {message && (
          <div className="alert alert-success py-2">{message}</div>
        )}

        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              name="name"
              className="form-control"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            {passwordStrength && (
              <small className={passwordStrength === "Strong" ? "text-success" : "text-danger"}>
                {passwordFeedback}
              </small>
            )}

          </div>

          <div className="mb-3">
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <small className="text-danger">Passwords do not match</small>
            )}
          </div>

          <button className="btn btn-primary w-100">
            Register
          </button>
        </form>

        <p className="text-center mt-3 text-secondary">
          Already registered? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
