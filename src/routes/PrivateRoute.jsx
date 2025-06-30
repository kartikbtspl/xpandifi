import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // You can enhance with context later
  return token ? children : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
