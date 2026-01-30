import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [message, setMessage] = useState("Verifying your email...");
    const [status, setStatus] = useState("loading"); // loading, success, error

    useEffect(() => {
        if (!email || !token) {
            setStatus("error");
            setMessage("Invalid verification link.");
            return;
        }

        const verify = async () => {
            try {
                await api.get(`/api/auth/verify?email=${email}&token=${token}`);
                setStatus("success");
                setMessage("Email verified successfully! Redirecting to login...");
                setTimeout(() => navigate("/login"), 3000);
            } catch (err) {
                setStatus("error");
                const errorMessage = err.response?.data?.message || err.response?.data?.error || "Verification failed. Please try again.";
                setMessage(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            }
        };

        verify();
    }, [email, token, navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="glass-card text-center" style={{ width: "400px" }}>
                <h3 className="heading-gradient mb-4">Email Verification</h3>

                {status === "loading" && <div className="spinner-border text-primary" role="status"></div>}

                <p className={`mt-3 ${status === "error" ? "text-danger" : "text-success"}`}>
                    {message}
                </p>

                {status === "error" && (
                    <button className="btn btn-primary mt-3" onClick={() => navigate("/login")}>
                        Go to Login
                    </button>
                )}
            </div>
        </div>
    );
}

export default VerifyEmail;
