import { Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import CreateCampaign from "../pages/campaign/CreateCampaign";
import ContactUsForm from "../pages/AuthPages/ContactUsForm";
import SignIn from "../pages/AuthPages/SignIn";
export const publicRoutes = [
  <Route key="signin" path="/signin" element={<SignIn />} />,
  <Route path="/contact-us" element={<ContactUsForm />} />,
]