import { Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AppLayout from "../layout/AppLayout";


export const dashboardRoutes = [
  <Route
    key="layout"
    element={
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    }
  >
    {/* <Route index path="/" element={<Home />} /> */}
  </Route>,
];
