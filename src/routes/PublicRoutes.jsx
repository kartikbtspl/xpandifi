// src/routes/PublicRoutes.jsx
import { Route, Navigate, useLocation } from "react-router-dom";
import ContactUsForm from "../pages/User_Pages/AuthPages/ContactUsForm";
import SignIn from "../pages/User_Pages/AuthPages/SignIn";
import { jwtDecode } from "jwt-decode";

const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    // Optional: check expiry if present (exp is in seconds)
    if (decoded.exp && typeof decoded.exp === "number") {
      const nowSec = Date.now() / 1000;
      if (decoded.exp < nowSec) {
        return false; // token expired
      }
    }
    return decoded; // return decoded token instead of true
  } catch (err) {
    console.warn("Invalid token in isLoggedIn check:", err);
    return false;
  }
};

const PublicRoute = ({ children }) => {
  const location = useLocation();
  const decoded = isLoggedIn();

  if (decoded) {
    const role = decoded.role?.toLowerCase();
    if (role === "SUPERADMIN") {
      return <Navigate to="/admin" state={{ from: location }} replace />;
    }
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export const publicRoutes = [
  <Route
    key="signin"
    path="/signin"
    element={
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    }
  />,
  <Route
    key="contact-us"
    path="/contact-us"
    element={
      <PublicRoute>
        <ContactUsForm />
      </PublicRoute>
    }
  />,
];
