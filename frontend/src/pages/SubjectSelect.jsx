import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

export default function SubjectSelect() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/api/subjects");
        setSubjects(res.data);
      } catch (err) {
        console.error("Failed to fetch subjects", err);
      }
    };
    fetchSubjects();
  }, []);

  const startQuiz = async (subjectName) => {
    const userId = localStorage.getItem("userId");

    // Check for null, empty string, OR the literal string "undefined"
    if (!userId || userId === "undefined" || userId === "null") {
      alert("Session incomplete. Please LOGOUT and LOGIN again to refresh your data.");
      // Optional: Auto redirect to login
      // navigate("/login");
      return;
    }

    try {
      const res = await api.post(
        `/api/quiz/start?userId=${userId}&subject=${subjectName}`
      );

      if (!res.data.question) {
        alert("Question generation failed. Please try again.");
        return;
      }

      localStorage.setItem("attemptId", res.data.attemptId);
      localStorage.setItem(
        "currentQuestion",
        JSON.stringify(res.data.question)
      );
      // CLEAR OLD HISTORY so counter resets to 1
      localStorage.removeItem("quizHistory");

      navigate("/quiz");
    } catch (err) {
      console.error("Start Quiz Failed", err);
      alert("Failed to start quiz. Please try again.");
    }
  };


  return (
    <div className="container py-5">
      <h3 className="text-center mb-4">Select Subject</h3>

      <div className="row g-4">
        {subjects.map(s => (
          <div key={s.id} className="col-md-6 col-lg-4">
            <div className="glass-card p-4 text-center h-100 d-flex flex-column justify-content-between">
              <h5 className="text-info mb-3">
                {s.name === "CSHARP_ASPNET" ? "C# & ASP.NET" : s.name.replaceAll("_", " ")}
              </h5>
              <button
                className="btn btn-primary w-100 mt-2"
                onClick={() => startQuiz(s.name)}
              >
                Start Quiz
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
          <i className="bi bi-arrow-left me-2"></i> Back to Dashboard
        </button>
      </div>
    </div >
  );
}
