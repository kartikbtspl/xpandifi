//src\pages\Dashboard.jsx
import { useSelector } from "react-redux";
import RetailerDashboard from "./dashboard/RetailerDashboard";
import AdAgencyDashboard from "./dashboard/AdAgencyDashboard";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import Shimmer from "../components/shimmer/Shimmer";
import { fetchCampaigns } from "../redux/slices/campaignSlice";
import { fetchUserProfile } from "../redux/slices/userSlice";
import PageTitle from "../components/ui/page-title/PageTitle";

const Dashboard = () => {
  const { profile, loading } = useSelector((state) => state.user);
  const { fetched } = useSelector((state) => state.campaign);
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
    if (!fetched && !loading) {
      dispatch(fetchCampaigns());
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
      : "Xpandifi";

  return (
    <>
      <PageTitle title={title} /> {/* ✅ dynamically set browser tab title */}
      {role === "Retailer" && <RetailerDashboard />}
      {role === "Ad-Agency" && <AdAgencyDashboard />}
    </>
  );
};

export default Dashboard;
