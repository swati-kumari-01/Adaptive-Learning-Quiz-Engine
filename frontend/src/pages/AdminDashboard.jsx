import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { Modal, Button, Form } from "react-bootstrap";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [overview, setOverview] = useState({});
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectAnalytics, setSubjectAnalytics] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: "", description: "" });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = () => {
    if (activeTab === "overview") {
      api.get("/api/admin/analytics/system").then(res => setOverview(res.data)).catch(console.error);
      api.get("/api/admin/analytics/subject").then(res => setSubjectAnalytics(res.data)).catch(console.error);
    } else if (activeTab === "users") {
      api.get("/api/user/all").then(res => setUsers(res.data)).catch(console.error);
    } else if (activeTab === "subjects") {
      api.get("/api/subjects").then(res => setSubjects(res.data)).catch(console.error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This will delete all their quiz history.")) {
      await api.delete(`/api/user/${id}`);
      fetchData();
    }
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm("WARNING: Deleting a subject will PERMANENTLY DELETE all related questions and quiz attempts. Continue?")) {
      try {
        await api.delete(`/api/subjects/${id}`);
        fetchData();
      } catch (err) {
        alert("Failed to delete subject");
      }
    }
  };

  const handleAddSubject = async () => {
    try {
      await api.post("/api/subjects", newSubject);
      setShowModal(false);
      setNewSubject({ name: "", description: "" });
      fetchData();
    } catch (err) {
      alert("Failed to add subject");
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await api.get('/api/admin/analytics/export/users', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'user_report.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download report");
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Admin Dashboard</h2>
        <button className="btn btn-outline-danger" onClick={() => {
          sessionStorage.clear();
          localStorage.clear();
          window.location.href = "/admin/login";
        }}>
          Logout
        </button>
      </div>

      {/* TABS */}
      <ul className="nav nav-pills mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>Overview</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>Manage Users</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "subjects" ? "active" : ""}`} onClick={() => setActiveTab("subjects")}>Manage Subjects</button>
        </li>
      </ul>

      {/* OVERVIEW CONTENT */}
      {activeTab === "overview" && (
        <div className="glass-card p-4">
          <h4 className="mb-4">System Overview</h4>
          <div className="mb-4">
            <h5 className="text-secondary">Overall System Accuracy</h5>
            <h2 className="text-success">{overview ? (Number(overview).toFixed(2)) + "%" : "Loading..."}</h2>
          </div>

          <h5 className="text-secondary mb-3">Performance by Subject</h5>
          <div className="table-responsive">
            <table className="table table-dark table-hover">
              <thead><tr><th>Subject</th><th>Avg Accuracy</th><th>Total Attempts</th></tr></thead>
              <tbody>
                {subjectAnalytics.map((row, i) => (
                  <tr key={i}>
                    <td>{row[0].name.replace(/_/g, " ")}</td>
                    <td className={row[1] > 70 ? "text-success" : "text-warning"}>
                      {row[1] ? row[1].toFixed(1) + "%" : "N/A"}
                    </td>
                    <td>{row[2]}</td>
                  </tr>
                ))}
                {subjectAnalytics.length === 0 && <tr><td colSpan="3" className="text-center text-muted">No data available</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USERS CONTENT */}
      {activeTab === "users" && (
        <div className="glass-card p-4">
          <div className="d-flex justify-content-between mb-3">
            <h4>Users</h4>
            <button className="btn btn-outline-success" onClick={handleDownloadReport}>
              <i className="bi bi-download me-2"></i> Download Report
            </button>
          </div>
          <div className="table-responsive">
            <table className="table text-white">
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Avg Accuracy</th><th>Total Quizzes</th><th>Action</th></tr></thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i}>
                    <td>{u[0].id}</td>
                    <td>{u[0].name}</td>
                    <td>{u[0].email}</td>
                    <td>{u[0].role}</td>
                    <td>{u[1]?.toFixed(2)}%</td>
                    <td>{u[2]}</td>
                    <td>
                      {u[0].role !== "ADMIN" && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u[0].id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBJECTS CONTENT */}
      {activeTab === "subjects" && (
        <div className="glass-card p-4">
          <div className="d-flex justify-content-between mb-3">
            <h4>Subjects</h4>
            <button className="btn btn-success" onClick={() => setShowModal(true)}>Add Subject</button>
          </div>
          <ul className="list-group">
            {subjects.map(s => (
              <li key={s.id} className="list-group-item bg-transparent text-white border-secondary d-flex justify-content-between align-items-center">
                <span><strong>{s.name.replace(/_/g, " ")}</strong> - {s.description || "No description"}</span>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSubject(s.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ADD SUBJECT MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} contentClassName="bg-dark text-white">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Add New Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Subject Name (e.g., PYTHON)</Form.Label>
            <Form.Control
              type="text"
              value={newSubject.name}
              onChange={e => setNewSubject({ ...newSubject, name: e.target.value.toUpperCase() })}
              className="bg-secondary text-white border-0"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              value={newSubject.description}
              onChange={e => setNewSubject({ ...newSubject, description: e.target.value })}
              className="bg-secondary text-white border-0"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddSubject}>Add Subject</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
