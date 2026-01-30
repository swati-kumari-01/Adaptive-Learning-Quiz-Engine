import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // If not logged in, redirect to Admin Login
    if (!token) {
        return <Navigate to="/admin" replace />;
    }

    // If logged in but not ADMIN, redirect to User Dashboard
    if (role !== "ADMIN") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default AdminRoute;
