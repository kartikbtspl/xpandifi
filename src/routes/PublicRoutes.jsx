// src/routes/PublicRoutes.jsx
import { Route } from "react-router-dom";
import SignIn from "@/pages/AuthPages/SignIn";
import ContactForm from "@/pages/Forms/contact-us/ContactForm";
import NotFound from "@/pages/OtherPage/NotFound";
import Login from "@/components/form/Login";

import CampaignFormWrapper from "../components/ui/formBuilder/CampaignFormWrapper";

export const publicRoutes = [
  <Route key="signin" path="/signin" element={<SignIn />} />,
  <Route key="contact" path="/contact-us" element={<ContactForm />} />,
  <Route key="log" path="/log" element={<Login />} />,
  <Route key="notfound" path="*" element={<NotFound />} />,
  <Route key="dummy" path="/dummyForm" element = {<CampaignFormWrapper />} />
];
