import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export default function Profile() {
    const navigate = useNavigate();
    const email = sessionStorage.getItem("email");

    const [activeTab, setActiveTab] = useState("details"); // details, password, theme
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        bio: "",
        address: "",
        profileCompletionPercentage: 0
    });

    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [passwordStrength, setPasswordStrength] = useState("");
    const [passwordFeedback, setPasswordFeedback] = useState("");

    // Password Validation Regex
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const checkPasswordStrength = (pass) => {
        if (!pass) {
            setPasswordStrength("");
            setPasswordFeedback("");
            return;
        }
        const missing = [];
        if (pass.length < 8) missing.push("8+ chars");
        if (!/[A-Z]/.test(pass)) missing.push("1 Upper");
        if (!/\d/.test(pass)) missing.push("1 Digit");
        if (!/[@$!%*?&]/.test(pass)) missing.push("1 Symbol");

        if (missing.length === 0) {
            setPasswordStrength("Strong");
            setPasswordFeedback("Strong Password ✅");
        } else {
            setPasswordStrength("Weak");
            setPasswordFeedback(`Weak (Missing: ${missing.join(", ")})`);
        }
    };

    // Load Profile
    useEffect(() => {
        if (!email) return;
        api.get(`/api/user/profile?email=${email}`)
            .then(res => {
                setProfile(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to load profile");
                setLoading(false);
            });
    }, [email]);

    // Handle Profile Update
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        try {
            await api.put(`/api/user/profile?email=${email}`, profile);
            setMessage("Profile updated successfully!");
            // Refresh to update completion %
            const res = await api.get(`/api/user/profile?email=${email}`);
            setProfile(res.data);
        } catch (err) {
            setError("Failed to update profile");
        }
    };

    // Handle Password Change
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (!passwordRegex.test(passwords.newPassword)) {
            setError("Weak Password: Must contain 8+ chars, 1 Uppercase, 1 Digit, 1 Symbol");
            return;
        }

        try {
            await api.post(`/api/user/change-password?email=${email}`, {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });

            // Success Popup and Redirect
            window.alert("Password updated successfully! Redirecting to dashboard...");
            navigate("/dashboard");

            setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            setError(err.response?.data || "Failed to change password");
        }
    };

    // Handle Theme Change
    const changeTheme = (theme) => {
        if (theme === "default") {
            document.documentElement.removeAttribute("data-theme");
            localStorage.removeItem("theme");
        } else {
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);
        }
    };

    if (loading) return <div className="text-center mt-5 text-white">Loading...</div>;

    return (
        <div className="container py-5">
            <button className="btn btn-outline-light mb-3" onClick={() => navigate("/dashboard")}>
                <i className="bi bi-arrow-left me-2"></i> Back to Dashboard
            </button>

            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="glass-card p-0 overflow-hidden">
                        <div className="row g-0">

                            {/* SIDEBAR */}
                            <div className="col-md-3 border-end border-secondary p-4 bg-opacity-10 bg-black">
                                <div className="text-center mb-4">
                                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "80px", height: "80px", fontSize: "2rem" }}>
                                        {profile.name.charAt(0).toUpperCase()}
                                    </div>
                                    <h6 className="mb-1 text-white">{profile.name}</h6>
                                    <small className="text-secondary">{profile.email}</small>
                                </div>

                                <div className="list-group list-group-flush rounded-3">
                                    <button
                                        className={`list-group-item list-group-item-action ${activeTab === "details" ? "active" : ""}`}
                                        onClick={() => setActiveTab("details")}
                                    >
                                        <i className="bi bi-person me-2"></i> Personal Details
                                    </button>
                                    <button
                                        className={`list-group-item list-group-item-action ${activeTab === "password" ? "active" : ""}`}
                                        onClick={() => setActiveTab("password")}
                                    >
                                        <i className="bi bi-shield-lock me-2"></i> Security
                                    </button>
                                    <button
                                        className={`list-group-item list-group-item-action ${activeTab === "theme" ? "active" : ""}`}
                                        onClick={() => setActiveTab("theme")}
                                    >
                                        <i className="bi bi-palette me-2"></i> Appearance
                                    </button>
                                </div>

                                <button className="btn btn-outline-danger w-100 mt-5" onClick={() => navigate("/dashboard")}>
                                    Back to Dashboard
                                </button>
                            </div>

                            {/* CONTENT AREA */}
                            <div className="col-md-9 p-5">
                                {message && <div className="alert alert-success">{message}</div>}
                                {error && <div className="alert alert-danger">{error}</div>}

                                {/* DETAILS TAB */}
                                {activeTab === "details" && (
                                    <form onSubmit={handleUpdateProfile}>
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <h4 className="heading-gradient">Edit Profile</h4>
                                            <div className="text-end">
                                                <small className="text-secondary d-block mb-1">Profile Completion</small>
                                                <div className="progress" style={{ width: "150px", height: "8px" }}>
                                                    <div
                                                        className="progress-bar bg-success"
                                                        role="progressbar"
                                                        style={{ width: `${profile.profileCompletionPercentage}%` }}
                                                    ></div>
                                                </div>
                                                <small className="text-success">{profile.profileCompletionPercentage}%</small>
                                            </div>
                                        </div>

                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-secondary">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={profile.name}
                                                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-secondary">Email</label>
                                                <input type="email" className="form-control" value={profile.email} disabled />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-secondary">Phone</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="+1 234 567 890"
                                                    value={profile.phone || ""}
                                                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <label className="form-label text-secondary">Address</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="123 Main St, City"
                                                    value={profile.address || ""}
                                                    onChange={e => setProfile({ ...profile, address: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <label className="form-label text-secondary">Bio</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    placeholder="Tell us about yourself..."
                                                    value={profile.bio || ""}
                                                    onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                                ></textarea>
                                            </div>
                                        </div>

                                        <button type="submit" className="btn btn-primary mt-4 px-4">
                                            Save Changes
                                        </button>
                                    </form>
                                )}

                                {/* PASSWORD TAB */}
                                {activeTab === "password" && (
                                    <form onSubmit={handleChangePassword}>
                                        <h4 className="heading-gradient mb-4">Change Password</h4>
                                        <div className="mb-3">
                                            <label className="form-label text-secondary">Current Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                required
                                                value={passwords.oldPassword}
                                                onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-secondary">New Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                required
                                                value={passwords.newPassword}
                                                onChange={e => {
                                                    setPasswords({ ...passwords, newPassword: e.target.value });
                                                    checkPasswordStrength(e.target.value);
                                                }}
                                            />
                                            {passwordStrength && (
                                                <small className={passwordStrength === "Strong" ? "text-success" : "text-danger"}>
                                                    {passwordFeedback}
                                                </small>
                                            )}
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-secondary">Confirm New Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                required
                                                value={passwords.confirmPassword}
                                                onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                            />
                                            {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                                                <small className="text-danger">
                                                    Passwords do not match
                                                </small>
                                            )}
                                        </div>
                                        <button type="submit" className="btn btn-danger mt-3">
                                            Update Password
                                        </button>
                                    </form>
                                )}

                                {/* THEME TAB */}
                                {activeTab === "theme" && (
                                    <div>
                                        <h4 className="heading-gradient mb-4">Appearance</h4>
                                        <p className="text-secondary mb-4">Detailed customization for your visual experience.</p>

                                        <div className="row g-3">
                                            {/* MIDNIGHT */}
                                            <div className="col-md-4">
                                                <div
                                                    className="card p-3 text-center border-primary cursor-pointer h-100"
                                                    style={{ cursor: "pointer", background: "linear-gradient(to bottom, #0f172a, #020617)" }}
                                                    onClick={() => changeTheme("default")}
                                                >
                                                    <div className="py-4">🌌</div>
                                                    <h6 className="text-info">Midnight Indigo</h6>
                                                    <small className="text-secondary">Deep blue & tech vibes</small>
                                                </div>
                                            </div>

                                            {/* WINE */}
                                            <div className="col-md-4">
                                                <div
                                                    className="card p-3 text-center cursor-pointer h-100"
                                                    style={{ cursor: "pointer", background: "linear-gradient(to bottom, #58081a, #0f0204)", borderColor: "#e11d48" }}
                                                    onClick={() => changeTheme("wine")}
                                                >
                                                    <div className="py-4">🍷</div>
                                                    <h6 className="text-danger">Dark Wine</h6>
                                                    <small className="text-secondary">Premium burgundy & pink</small>
                                                </div>
                                            </div>

                                            {/* LIGHT */}
                                            <div className="col-md-4">
                                                <div
                                                    className="card p-3 text-center cursor-pointer h-100"
                                                    style={{ cursor: "pointer", background: "#f8fafc", borderColor: "#cbd5e1" }}
                                                    onClick={() => changeTheme("light")}
                                                >
                                                    <div className="py-4">☀️</div>
                                                    <h6 className="text-dark">Clean Light</h6>
                                                    <small className="text-muted">Bright professional look</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
