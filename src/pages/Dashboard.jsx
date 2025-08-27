//src\pages\Dashboard.jsx
import { useSelector } from "react-redux";
import RetailerDashboard from "./user/dashboard/RetailerDashboard";
import AdAgencyDashboard from "./user/dashboard/AdAgencyDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { fetchCampaigns } from "../redux/slices/User/campaignSlice";
import { fetchUserProfile } from "../redux/slices/User/userSlice";
import PageTitle from "../components/ui/page-title/PageTitle";

const Dashboard = () => {
  const { profile } = useSelector((state) => state.user);
  const { fetched,loading } = useSelector((state) => state.campaign);
  const [role, setRole] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
  if (role ==='Ad-Agency' || role ==='Retailer'){
    if (!fetched && !loading) {
      dispatch(fetchCampaigns());
    }
  }
  }, [fetched, loading, dispatch]);
 


  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const title =
    role === "Ad-Agency"
      ? "Ad Agency"
      : role === "Retailer"
      ? "Retailer"
      :role === 'SUPERADMIN'
      ? "SuperAdmin"
      :role === 'ADMIN'
      ? 'Admin'
      : "Xpandifi";

  return (
    <>
      <PageTitle title={title} /> {/* ✅ dynamically set browser tab title */}
      {role === "Retailer" && <RetailerDashboard />}
      {role === "Ad-Agency" && <AdAgencyDashboard />}
      {role === "ADMIN" && <AdminDashboard />}
      {role === "SUPERADMIN" && <AdminDashboard />}

    </>
  );
};

export default Dashboard;
