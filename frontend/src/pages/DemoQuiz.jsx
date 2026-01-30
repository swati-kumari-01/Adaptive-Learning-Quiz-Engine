import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function DemoQuiz() {
    const navigate = useNavigate();

    // Static Questions for Demo
    const demoQuestions = [
        {
            id: 1,
            question: "Which data structure follows the LIFO (Last In First Out) principle?",
            options: ["Queue", "Stack", "LinkedList", "Tree"],
            correctAnswer: "Stack",
            difficulty: "EASY"
        },
        {
            id: 2,
            question: "What is the time complexity of binary search on a sorted array?",
            options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
            correctAnswer: "O(log n)",
            difficulty: "MEDIUM"
        },
        {
            id: 3,
            question: "In Java, which keyword is used to prevent method overriding?",
            options: ["static", "final", "abstract", "const"],
            correctAnswer: "final",
            difficulty: "HARD"
        },
        {
            id: 4,
            question: "Which of the following is NOT a relational database?",
            options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
            correctAnswer: "MongoDB",
            difficulty: "MEDIUM"
        },
        {
            id: 5,
            question: "What does CSS stand for?",
            options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
            correctAnswer: "Cascading Style Sheets",
            difficulty: "EASY"
        }
    ];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState("");
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    // Progress tracking
    const [history, setHistory] = useState(new Array(5).fill("pending"));

    const currentQuestion = demoQuestions[currentQuestionIndex];

    useEffect(() => {
        // Update current question marker
        if (!showResult && history[currentQuestionIndex] === 'pending') {
            const newHistory = [...history];
            newHistory[currentQuestionIndex] = 'current';
            setHistory(newHistory);
        }
    }, [currentQuestionIndex, showResult]);


    const handleSubmit = (isSkip = false) => {
        if (!isSkip && !selectedOption) {
            alert("Please select an option.");
            return;
        }

        let newHistory = [...history];

        if (isSkip) {
            newHistory[currentQuestionIndex] = 'skipped';
        } else {
            newHistory[currentQuestionIndex] = selectedOption === currentQuestion.correctAnswer ? 'correct' : 'wrong';
            if (selectedOption === currentQuestion.correctAnswer) {
                setScore(s => s + 1);
            }
        }
        setHistory(newHistory);

        if (currentQuestionIndex < demoQuestions.length - 1) {
            // Next Question
            setSelectedOption("");
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Finish
            setShowResult(true);
        }
    };

    if (showResult) {
        return (
            <div className="min-vh-100 bg-dark text-white d-flex flex-column">
                <Navbar />
                <div className="container d-flex flex-grow-1 align-items-center justify-content-center">
                    <div className="glass-card p-5 text-center" style={{ maxWidth: "600px" }}>
                        <h2 className="heading-gradient display-4 mb-4">Demo Completed!</h2>
                        <p className="lead mb-4">
                            You scored <span className="fw-bold text-info">{score}</span> out of {demoQuestions.length}.
                        </p>

                        <div className="mb-5">
                            {score === demoQuestions.length ? (
                                <p>🌟 Perfect Score! You're ready for the real challenge.</p>
                            ) : score > 2 ? (
                                <p>👍 Good job! Sign up to track your progress and compete.</p>
                            ) : (
                                <p>📚 Keep learning! Our adaptive engine can help you master these concepts.</p>
                            )}
                        </div>

                        <div className="d-grid gap-3">
                            <button onClick={() => navigate("/register")} className="btn btn-primary btn-lg rounded-pill">
                                Register Now (It's Free)
                            </button>
                            <button onClick={() => navigate("/")} className="btn btn-outline-light btn-lg rounded-pill">
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-dark text-white d-flex flex-column">
            <Navbar />

            <div className="container py-5 flex-grow-1">
                <div className="row justify-content-center h-100">

                    {/* Simple Sidebar for Demo */}
                    <div className="col-md-3 d-none d-md-block">
                        <div className="glass-card mb-3 p-3">
                            <h5 className="text-info mb-3">Demo Progress</h5>
                            <div className="d-grid gap-2" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
                                {history.map((status, i) => {
                                    let bg = "bg-secondary";
                                    if (status === 'current') bg = "bg-primary";
                                    if (status === 'correct') bg = "bg-success";
                                    if (status === 'wrong') bg = "bg-danger";
                                    if (status === 'skipped') bg = "bg-warning";

                                    return (
                                        <div key={i} className={`rounded-circle ${bg} d-flex align-items-center justify-content-center text-white`}
                                            style={{ width: "30px", height: "30px", fontSize: "12px", opacity: status === 'pending' ? 0.3 : 1 }}>
                                            {i + 1}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-8">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="mb-0">Question {currentQuestionIndex + 1} <span className="text-muted fs-5">/ {demoQuestions.length}</span></h3>
                            <span className={`badge ${currentQuestion.difficulty === 'EASY' ? 'bg-success' : currentQuestion.difficulty === 'MEDIUM' ? 'bg-warning' : 'bg-danger'}`}>
                                {currentQuestion.difficulty}
                            </span>
                        </div>

                        <div className="glass-card p-4 p-md-5">
                            <h4 className="mb-4" style={{ lineHeight: "1.5" }}>{currentQuestion.question}</h4>

                            <div className="d-grid gap-3 mb-5">
                                {currentQuestion.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        className={`btn text-start py-3 px-4 ${selectedOption === option ? 'btn-primary' : 'btn-outline-light'}`}
                                        onClick={() => setSelectedOption(option)}
                                        style={{ borderRadius: "12px", transition: "all 0.2s" }}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            <div className="d-flex justify-content-between">
                                <button className="btn btn-link text-white-50 text-decoration-none" onClick={() => handleSubmit(true)}>
                                    Skip Question
                                </button>
                                <button className="btn btn-success px-5 rounded-pill fw-bold" onClick={() => handleSubmit(false)}>
                                    Next <i className="bi bi-arrow-right ms-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
