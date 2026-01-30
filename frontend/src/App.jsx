import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SubjectSelect from "./pages/SubjectSelect";
import Quiz from "./pages/Quiz";
import Leaderboard from "./pages/Leaderboard";
import Result from "./pages/Result";
import Review from "./pages/Review";
import AdminDashboard from "./pages/AdminDashboard";
import AuthCallback from "./pages/AuthCallback";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import DemoQuiz from "./pages/DemoQuiz";





import { useEffect } from "react";
import Profile from "./pages/Profile";

function App() {
  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo-quiz" element={<DemoQuiz />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <SubjectSelect />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route path="/result" element={<Result />} />

        <Route path="/review" element={<Review />} />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />


      </Routes>

    </BrowserRouter>
  );
}

export default App;
