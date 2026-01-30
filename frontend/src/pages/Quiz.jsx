import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export default function Quiz() {
  const navigate = useNavigate();

  // Initialize state
  const [question, setQuestion] = useState(() => {
    const saved = localStorage.getItem("currentQuestion");
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Submitting...");
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

  // Track question status for side panel: 'pending', 'answered', 'skipped', 'current'
  const [questionHistory, setQuestionHistory] = useState(() => {
    const saved = localStorage.getItem("quizHistory");
    return saved ? JSON.parse(saved) : new Array(15).fill("pending");
  });

  // Calculate current question count based on history
  const [questionCount, setQuestionCount] = useState(() => {
    const saved = localStorage.getItem("quizHistory");
    if (saved) {
      const arr = JSON.parse(saved);
      // Find first pending index, that's current. If all done, it's 15.
      const idx = arr.findIndex(s => s === "pending");
      return idx === -1 ? 16 : idx + 1; // If done, return 16 to trigger redirect
    }
    return 1;
  });

  // Force redirect if > 15
  useEffect(() => {
    if (questionCount > 15) {
      navigate("/result");
    }
  }, [questionCount, navigate]);

  useEffect(() => {
    // Update history current pointer
    const idx = questionCount - 1;
    if (idx < 15 && questionHistory[idx] === 'pending') {
      const newHistory = [...questionHistory];
      newHistory[idx] = 'current';
      setQuestionHistory(newHistory);
      localStorage.setItem("quizHistory", JSON.stringify(newHistory));
    }
  }, [questionCount]);

  useEffect(() => {
    // Safety check
    const attemptId = localStorage.getItem("attemptId");
    if (!question || !attemptId) {
      navigate("/subjects");
    }

    // Restore question count from attempt checks if needed, 
    // but for now we'll just increment local counter or fetch from backend if we had that endpoint.
    // Simplified: Increment on successful submit.
  }, [question, navigate]);

  // Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleTimeout = async () => {
    alert("Time is up! Submitting quiz...");
    navigate("/result");
  };

  const handleSubmit = async (isSkip = false) => {
    if (!isSkip && !selectedOption) {
      alert("Please select an answer or click Skip");
      return;
    }

    try {
      setLoading(true);
      setLoadingText("Submitting Answer..."); // Immediate feedback step 1

      const attemptId = localStorage.getItem("attemptId");

      const payload = {
        attemptId: attemptId,
        questionText: question.question,
        selectedAnswer: isSkip ? "" : selectedOption, // Empty for skip
        correctAnswer: question.correctAnswer
      };

      // STEP 1: Submit Answer (Fast)
      const submitRes = await api.post("/api/quiz/submit", payload);

      // Update History immediately
      const idx = questionCount - 1;
      const newHistory = [...questionHistory];
      newHistory[idx] = isSkip ? 'skipped' : 'answered';
      setQuestionHistory(newHistory);
      localStorage.setItem("quizHistory", JSON.stringify(newHistory));

      if (submitRes.data.complete) {
        localStorage.removeItem("currentQuestion");
        localStorage.removeItem("quizHistory");
        navigate("/result");
        return;
      }

      // STEP 2: Generate Next Question (AI/Slow)
      setLoadingText("Generating Next Question..."); // Feedback step 2

      const nextRes = await api.get(`/api/quiz/next-question/${attemptId}`);

      if (nextRes.status === 204 || !nextRes.data) {
        // Should have been caught by 'complete' flag, but just in case
        navigate("/result");
        return;
      }

      setQuestion(nextRes.data);
      localStorage.setItem("currentQuestion", JSON.stringify(nextRes.data));
      setSelectedOption("");
      setQuestionCount(c => c + 1);

      // Mark next as current
      if (idx + 1 < 15) {
        newHistory[idx + 1] = 'current';
        setQuestionHistory(newHistory);
        localStorage.setItem("quizHistory", JSON.stringify(newHistory));
      }

    } catch (error) {
      console.error("Error in quiz flow:", error);
      if (error.code === 'ECONNABORTED') {
        alert("The AI is taking a bit long. Click 'Next Question' again to retry generation (Answer was saved).");
        // Since answer is saved, user can technically just retry generation... 
        // But simplistic handling for now: just alert. 
        setLoading(false);
      } else {
        alert(`Something went wrong: ${error.message}. Please try again.`);
        setLoading(false);
      }
    } finally {
      // Only stop loading if we successfully got next question or errored out
      // In success case, we keep loading true until state updates trigger re-render? 
      // Actually state updates happen before finally.
      setLoading(false);
    }
  };

  if (!question) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center">

        {/* SIDE PANEL */}
        <div className="col-md-3 d-none d-md-block">
          <div className="card shadow-sm sticky-top" style={{ top: "20px" }}>
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">Progress</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
                {questionHistory.map((status, i) => {
                  let bgClass = "bg-light"; // pending
                  if (status === 'answered') bgClass = "bg-success text-white";
                  if (status === 'skipped') bgClass = "bg-warning text-dark";
                  if (status === 'current') bgClass = "bg-primary text-white";

                  return (
                    <div key={i} className={`d-flex align-items-center justify-content-center rounded border ${bgClass}`}
                      style={{ width: "100%", aspectRatio: "1/1", fontWeight: "bold", fontSize: "0.9rem" }}>
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN QUIZ AREA */}
        <div className="col-12 col-md-8 col-lg-6">
          <div className="d-flex justify-content-between mb-3 px-3">
            <h4>Question {questionCount} / 15</h4>
            <h4 className={timeLeft < 60 ? "text-danger" : "text-dark"}>
              Time Left: {formatTime(timeLeft)}
            </h4>
          </div>

          <div className="card shadow-sm mx-auto">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Quiz in Progress</h4>
                <span className="badge bg-light text-dark">
                  {question.difficulty}
                </span>
              </div>
            </div>

            <div className="card-body">
              <h5 className="card-title mb-4" style={{ lineHeight: "1.6" }}>{question.question}</h5>

              <div className="list-group mb-4">
                {question.options.map((opt, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`list-group-item list-group-item-action ${selectedOption === opt ? "active" : ""
                      }`}
                    onClick={() => setSelectedOption(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                >
                  {loading ? "..." : "Skip Question"}
                </button>

                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                >
                  {loading ? loadingText : "Submit & Next"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
