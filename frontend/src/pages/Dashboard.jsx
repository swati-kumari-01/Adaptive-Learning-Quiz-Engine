import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import logo from "../assets/logo.png";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalQuizzes: 0,
    accuracy: 0,
    skillScore: 0,
    userName: "Student",
    subjectStats: []
  });

  const [selectedSubject, setSelectedSubject] = useState("");

  const email = sessionStorage.getItem("email");

  // ==============================
  // FETCH DASHBOARD DATA
  // ==============================
  useEffect(() => {
    if (!email) return;

    axios
      .get(`/api/dashboard?email=${email}`)
      .then(res => {
        setDashboard({
          totalQuizzes: res.data.totalQuizzes || 0,
          accuracy: res.data.accuracy || 0,
          skillScore: res.data.skillScore || 50,
          userName: res.data.userName || "Student",
          subjectStats: res.data.subjectStats || []
        });
      })
      .catch(err => {
        console.error("Dashboard fetch error", err);
      });
  }, [email]);

  // ==============================
  // LOGOUT
  // ==============================
  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container py-5">

      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <img src={logo} alt="Logo" style={{ width: "50px" }} />
          <div>
            <h6 className="text-secondary mb-0 text-uppercase" style={{ letterSpacing: "1px" }}>
              {dashboard.userName}
            </h6>
            <h3 className="heading-gradient mb-0">
              DASHBOARD
            </h3>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigate("/profile")}
          >
            <i className="bi bi-person-circle"></i> Profile
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="glass-card text-center">
            <h6>Total Quizzes</h6>
            <h3 className="text-info">
              {dashboard.totalQuizzes}
            </h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card text-center">
            <h6>Average Accuracy</h6>
            <h3 className="text-success">
              {dashboard.accuracy.toFixed(2)}%
            </h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card text-center">
            <h6>Skill Score</h6>
            <h3 className="text-warning">
              {dashboard.skillScore}
            </h3>
          </div>
        </div>
      </div>

      {/* ================= SUBJECT ANALYTICS ================= */}
      {/* ================= SUBJECT ANALYTICS ================= */}
      <div className="mt-5">
        <h5 className="heading-gradient mb-3">Performance by Subject</h5>

        {/* Subject Dropdown */}
        <div className="mb-4" style={{ maxWidth: "400px" }}>
          <select
            className="form-select bg-dark text-white border-secondary"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">-- Select a Subject to View Stats --</option>
            {dashboard.subjectStats.map((sub, idx) => (
              <option key={idx} value={sub.subject.name}>
                {(sub.subject.name || "Unknown").replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Subject Stats Card */}
        {selectedSubject && (
          <div className="glass-card p-4" style={{ maxWidth: "500px" }}>
            {dashboard.subjectStats
              .filter(sub => sub.subject.name === selectedSubject)
              .map((sub, idx) => (
                <div key={idx}>
                  <h4 className="text-info mb-4 border-bottom border-secondary pb-2">
                    {(sub.subject.name === "CSHARP_ASPNET" ? "C# & ASP.NET" : (sub.subject.name || "Unknown").replace(/_/g, " "))}
                  </h4>

                  <div className="row text-center">
                    <div className="col-4">
                      <small className="text-secondary d-block">Attempts</small>
                      <h4 className="mt-1">{sub.totalAttempts}</h4>
                    </div>
                    <div className="col-4">
                      <small className="text-secondary d-block">Accuracy</small>
                      <h4 className={`mt-1 ${sub.averageAccuracy > 70 ? "text-success" : "text-warning"}`}>
                        {sub.averageAccuracy.toFixed(1)}%
                      </h4>
                    </div>
                    <div className="col-4">
                      <small className="text-secondary d-block">Skill Score</small>
                      <h4 className="text-primary mt-1">{sub.skillScore.toFixed(0)}</h4>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="row g-4 mt-4">

        {/* START QUIZ */}
        <div className="col-md-6">
          <div className="glass-card text-center">
            <h5>Start New Quiz</h5>
            <p className="text-secondary">
              Choose subject & begin adaptive quiz
            </p>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/subjects")}
            >
              Select Subject for Quiz
            </button>
          </div>
        </div>

        {/* LEADERBOARD */}
        <div className="col-md-6">
          <div className="glass-card text-center">
            <h5>Leaderboard</h5>
            <p className="text-secondary">
              View weekly rankings
            </p>

            <button
              className="btn btn-outline-info"
              onClick={() => navigate("/leaderboard")}
            >
              View Leaderboard
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
