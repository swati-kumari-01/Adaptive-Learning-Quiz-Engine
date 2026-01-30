import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axiosConfig";

function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Simple JWT Decode Helper
    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("token", token);

            // 1. Decode Token to get Email
            const decoded = parseJwt(token);
            if (decoded && decoded.sub) {
                const email = decoded.sub;
                sessionStorage.setItem("email", email);

                // 2. Fetch Full Profile to get UserID & Role
                api.get(`/api/user/profile?email=${email}`)
                    .then(res => {
                        const user = res.data;
                        localStorage.setItem("userId", user.id);
                        localStorage.setItem("role", user.role);

                        // 3. Redirect
                        if (user.role === "ADMIN") {
                            navigate("/admin");
                        } else {
                            navigate("/dashboard");
                        }
                    })
                    .catch(err => {
                        console.error("Profile fetch failed", err);
                        navigate("/login");
                    });
            } else {
                console.error("Invalid Token Structure");
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [searchParams, navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-2">Authenticating...</span>
        </div>
    );
}

export default AuthCallback;
