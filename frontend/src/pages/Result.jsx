import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

function Result() {
  const [result, setResult] = useState(null);
  const attemptId = localStorage.getItem("attemptId");

  useEffect(() => {
    if (!attemptId) return;

    api.get(`/api/quiz/result/${attemptId}`)
      .then(res => setResult(res.data))
      .catch(() => alert("Failed to load result"));
  }, [attemptId]);

  if (!result) {
    return (
      <div className="container py-5 text-center">
        <h4>Loading Result...</h4>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h3 className="heading-gradient text-center mb-4">
        Quiz Result
      </h3>

      <div className="card p-4 text-center">
        <h5 className="mb-3">Subject: {result.subject?.name?.replace(/_/g, " ") || "Unknown"}</h5>

        <p>Total Questions: <b>{result.totalQuestions}</b></p>
        <p>Correct Answers: <b>{result.correctAnswers}</b></p>
        <p>Wrong Answers: <b>{result.wrongAnswers}</b></p>
        <p>Skipped Answers: <b>{result.skippedAnswers}</b></p>

        <h4 className="mt-3">
          Accuracy: <span className="text-success">
            {result.accuracy.toFixed(2)}%
          </span>
        </h4>

        <div className="mt-4">
          <button
            className="btn btn-primary me-2"
            onClick={() => window.location.href = "/review"}
          >
            Review Answers
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => {
              localStorage.removeItem("attemptId");
              localStorage.removeItem("currentQuestion");
              window.location.href = "/dashboard";
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;
