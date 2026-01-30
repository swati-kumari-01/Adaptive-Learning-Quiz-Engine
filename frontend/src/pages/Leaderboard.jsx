import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLeaderboard } from "../api/leaderboardApi";

function Leaderboard() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const res = await getLeaderboard();
      setData(res);
    } catch {
      alert("Unable to load leaderboard");
    }
  };

  return (
    <div className="container py-5">

      <h3 className="heading-gradient text-center mb-4">
        Weekly Leaderboard 🏆
      </h3>

      <div className="glass-card">
        <table className="table table-dark table-hover mb-0">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student</th>
              <th>Skill Score</th>
              <th>Quizzes Taken</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No data available yet
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index}>
                  <td>#{row.rank}</td>
                  <td>{row.name}</td>
                  <td className="text-warning fw-bold">{row.skillScore}</td>
                  <td>{row.quizzesTaken}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
          <i className="bi bi-arrow-left me-2"></i> Back to Dashboard
        </button>
      </div>

    </div>
  );
}

export default Leaderboard;
