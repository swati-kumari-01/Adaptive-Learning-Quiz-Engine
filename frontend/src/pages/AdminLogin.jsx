import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import Navbar from "../components/Navbar";

export default function AdminLogin() {
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

            if (data.role !== "ADMIN") {
                setError("Access Denied: You do not have admin privileges.");
                setLoading(false);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("userId", data.userId);
            sessionStorage.setItem("email", email);

            navigate("/admin/dashboard");

        } catch (err) {
            setError("Invalid admin credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-dark">
            <Navbar /> {/* Optional: Include navbar if we want navigation back to home easily */}

            <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                <div className="glass-card p-5 mx-3" style={{ maxWidth: "450px", width: "100%", border: "1px solid rgba(220, 38, 38, 0.3)" }}>
                    <h2 className="text-center mb-4 text-danger fw-bold">Admin Portal</h2>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="text-white-50 mb-1">Admin Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-white-50 mb-1">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button className="btn btn-danger w-100 py-2 fw-bold" disabled={loading}>
                            {loading ? "Authenticating..." : "Access Dashboard"}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <a href="/" className="text-secondary text-decoration-none small">Return to Home</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
