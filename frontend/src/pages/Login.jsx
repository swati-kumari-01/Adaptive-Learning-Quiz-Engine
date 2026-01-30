import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import logo from "../assets/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      // ==============================
      // SAVE LOGIN DATA (VERY IMPORTANT)
      // ==============================
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);

      // 🔥 THIS LINE WAS MISSING
      sessionStorage.setItem("email", email);

      // ==============================
      // ROLE BASED REDIRECT
      // ==============================
      if (data.role === "ADMIN") {
        // BLOCK ADMIN FROM USER LOGIN
        localStorage.clear();
        sessionStorage.clear();
        setError("Access Denied: Admins must use the Admin Login page.");
        setLoading(false);
        return;
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (typeof err.response?.data === "string" ? err.response?.data : "Invalid email or password");
      setError(errorMessage);
    } finally {
      setLoading(false);
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
          Login
        </h3>

        {error && (
          <div className="alert alert-danger py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>


        <div className="text-center my-3">
          <span className="text-muted">OR</span>
        </div>

        <a
          href="http://192.168.56.1.nip.io:8081/oauth2/authorization/google"
          className="btn btn-outline-danger w-100 mb-3"
        >
          <i className="bi bi-google me-2"></i> Login with Google
        </a>

        <p className="text-center mt-3 text-secondary">
          New user? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
