import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="home-page">
            <Navbar />

            {/* Hero Section */}
            <div className="hero-wrapper position-relative" style={{ minHeight: "100vh", overflow: "hidden" }}>
                <div className="hero-bg position-absolute w-100 h-100" style={{
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                    zIndex: -1
                }}>
                    {/* Decorative Circles */}
                    <div className="position-absolute rounded-circle bg-primary opacity-25" style={{ width: "400px", height: "400px", top: "-100px", left: "-100px", filter: "blur(80px)" }}></div>
                    <div className="position-absolute rounded-circle bg-secondary opacity-25" style={{ width: "300px", height: "300px", bottom: "10%", right: "-50px", filter: "blur(60px)" }}></div>
                </div>

                <header className="hero-content d-flex align-items-center text-white position-relative" style={{ minHeight: "100vh", zIndex: 1 }}>

                    <div className="container position-relative z-2">
                        <div className="row align-items-center">
                            <div className="col-lg-6 mb-5 mb-lg-0">
                                <h1 className="display-3 fw-bold mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    Master Your Knowledge with <span style={{ color: "#6C63FF" }}>Adaptive Learning</span>
                                </h1>
                                <p className="lead mb-5 text-light opacity-75">
                                    Experience a quiz engine that adapts to your skill level.
                                    Challenge yourself, track your progress, and climb the leaderboard.
                                </p>
                                <div className="d-flex gap-3 flex-wrap">
                                    <Link to="/register" className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg" style={{ backgroundColor: "#6C63FF", borderColor: "#6C63FF" }}>
                                        Get Started
                                    </Link>
                                    <Link to="/demo-quiz" className="btn btn-outline-light btn-lg rounded-pill px-5 py-3 fw-bold">
                                        Try Demo Quiz
                                    </Link>
                                </div>
                            </div>
                            <div className="col-lg-6 text-center">
                                {/* Illustration - Using a generated-like placeholder or a nice CSS shape */}
                                <div className="quiz-illustration position-relative">
                                    <div className="card border-0 shadow-lg p-4 bg-glass text-start" style={{
                                        background: "rgba(255, 255, 255, 0.05)",
                                        backdropFilter: "blur(10px)",
                                        borderRadius: "20px",
                                        border: "1px solid rgba(255,255,255,0.1)"
                                    }}>
                                        <div className="d-flex justify-content-between mb-4">
                                            <span className="badge bg-success rounded-pill px-3 py-2">Question 1/10</span>
                                            <span className="text-white-50">Time: 14s</span>
                                        </div>
                                        <h5 className="text-white mb-4">What is the capital of France?</h5>
                                        <div className="d-grid gap-3">
                                            <button className="btn btn-outline-light text-start py-3 rounded-3">A. London</button>
                                            <button className="btn btn-primary text-start py-3 rounded-3" style={{ backgroundColor: "#6C63FF", borderColor: "#6C63FF" }}>B. Paris</button>
                                            <button className="btn btn-outline-light text-start py-3 rounded-3">C. Berlin</button>
                                            <button className="btn btn-outline-light text-start py-3 rounded-3">D. Madrid</button>
                                        </div>
                                    </div>

                                    {/* Floating Elements */}
                                    <div className="position-absolute bg-white p-3 rounded-4 shadow-lg text-black fw-bold d-flex align-items-center gap-2 animate-float" style={{ top: "-15px", right: "20px", zIndex: 10 }}>
                                        <span>🏆</span> Leaderboard #1
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </div>

            {/* About Section */}
            <section className="py-5 bg-dark text-white" id="about">
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold display-5">Why Choose Us?</h2>
                        <p className="text-white-50">Advanced features to enhance your learning journey</p>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 h-100 feature-card">
                                <div className="display-4 mb-3">🎯</div>
                                <h3>Adaptive Difficulty</h3>
                                <p className="text-white-50">Questions get harder as you improved, ensuring you're always challenged at the right level.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 h-100 feature-card">
                                <div className="display-4 mb-3">📊</div>
                                <h3>Detailed Analytics</h3>
                                <p className="text-white-50">Track your performance with detailed insights and performance graphs.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 h-100 feature-card">
                                <div className="display-4 mb-3">🏆</div>
                                <h3>Global Leaderboard</h3>
                                <p className="text-white-50">Compete with students worldwide and showcase your expertise.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-4 text-center text-white-50" style={{ background: "#0f172a" }}>
                <p className="mb-0">&copy; 2026 AdaptiveQuiz. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;
