import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You must login first to access this page");
    return <Navigate to="/login" replace />;
  }

  return children;
}