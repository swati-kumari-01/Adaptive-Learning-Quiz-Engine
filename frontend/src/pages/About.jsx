import React from "react";
import Navbar from "../components/Navbar";

const About = () => {
    return (
        <div className="about-page" style={{ minHeight: "100vh", background: "var(--bg-body)" }}>
            <Navbar />

            <div className="container py-5 mt-5">
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold heading-gradient">About AdaptiveQuiz</h1>
                    <p className="lead text-white-50 max-w-2xl mx-auto">
                        Revolutionizing the way you learn with AI-driven adaptive assessments.
                    </p>
                </div>

                <div className="row g-5 align-items-center mb-5">
                    <div className="col-lg-6">
                        <div className="glass-card p-4">
                            <h2 className="text-info mb-3">Our Mission</h2>
                            <p className="text-light">
                                Our mission is to provide a personalized learning experience for every student.
                                Traditional quizzes are static, but AdaptiveQuiz evolves with you.
                                By analyzing your performance in real-time, we adjust the difficulty of questions
                                to ensure you are always challenged but never overwhelmed.
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="glass-card p-4">
                            <h2 className="text-info mb-3">How It Works</h2>
                            <ul className="list-unstyled text-light">
                                <li className="mb-2">✅ <strong className="text-white">Start a Quiz:</strong> Choose a subject (Java, Python, C++, etc.).</li>
                                <li className="mb-2">✅ <strong className="text-white">Adaptive Engine:</strong> Answer correctly, and questions get harder. Answer incorrectly, and they get easier.</li>
                                <li className="mb-2">✅ <strong className="text-white">Real-time Feedback:</strong> Get instant results and detailed explanations.</li>
                                <li className="mb-2">✅ <strong className="text-white">Track Progress:</strong> View your performance analytics and leaderboard ranking.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="row g-4 text-center">
                    <div className="col-md-4">
                        <div className="p-4 border border-secondary rounded-4 bg-glass">
                            <h3 className="h1 text-primary mb-3">10k+</h3>
                            <p className="text-white-50">Questions</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-4 border border-secondary rounded-4 bg-glass">
                            <h3 className="h1 text-primary mb-3">7+</h3>
                            <p className="text-white-50">Programming Subjects</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-4 border border-secondary rounded-4 bg-glass">
                            <h3 className="h1 text-primary mb-3">24/7</h3>
                            <p className="text-white-50">Learning Availability</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
