//src\routes\PrivateRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { routeMap } from "./routeMaps";
import { jwtDecode } from "jwt-decode";


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  const location = useLocation();
  // Decoding token to get user role
  const decoded = jwtDecode(token);
  const userRole = decoded.role;

  // To find current route in routeMaps
  const currentRoute = routeMap.find((route) => route.path === location.pathname);

  if (!currentRoute || !currentRoute.roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;

};



export default PrivateRoute;
