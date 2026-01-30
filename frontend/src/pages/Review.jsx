import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";

const Review = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const attemptId = localStorage.getItem("attemptId");

  useEffect(() => {
    axios
      .get(`/api/quiz/review/${attemptId}`)
      .then(res => {
        // Filter duplicates based on questionText
        const uniqueQuestions = res.data.filter((q, index, self) =>
          index === self.findIndex((t) => (
            t.questionText === q.questionText
          ))
        );
        setQuestions(uniqueQuestions);
      })
      .catch(err => console.error(err));
  }, [attemptId]);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="heading-gradient">Quiz Review</h2>
        <button className="btn btn-outline-primary" onClick={() => navigate("/result")}>
          <i className="bi bi-arrow-left me-2"></i> Back to Result
        </button>
      </div>

      <div className="row">
        {questions.map((q, index) => (
          <div key={index} className="col-12 mb-3">
            <div className={`card shadow-sm border-start border-5 ${q.correct ? "border-success" : "border-danger"}`}>
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title">Question {index + 1}</h5>
                  <span className={`badge ${q.selectedAnswer === "SKIPPED"
                      ? "bg-warning text-dark"
                      : q.correct ? "bg-success" : "bg-danger"
                    }`}>
                    {q.selectedAnswer === "SKIPPED" ? "Skipped" : (q.correct ? "Correct" : "Wrong")}
                  </span>
                </div>

                <p className="card-text mt-2" style={{ fontSize: "1.1rem" }}>{q.questionText}</p>

                <hr className="my-2" />

                <div className="row mt-3">
                  <div className="col-md-6">
                    <small className="text-muted d-block">Your Answer:</small>
                    <span className={q.correct ? "text-success fw-bold" : "text-danger fw-bold"}>
                      {q.selectedAnswer}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted d-block">Correct Answer:</small>
                    <span className="text-success fw-bold">
                      {q.correctAnswer}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-end">
                  <span className="badge bg-secondary">{q.difficulty}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center text-muted">No questions found for this attempt.</div>
      )}
    </div>
  );
};

export default Review;
