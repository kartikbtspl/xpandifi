// src/routes/AppRoutes.jsx
import { Routes } from "react-router-dom";
import { dashboardRoutes } from "./DashboardRoutes";
import { publicRoutes } from "./PublicRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {[...dashboardRoutes, ...publicRoutes]}
    </Routes>
  );
};

export default AppRoutes;
