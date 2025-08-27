import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import RetailerDashboard from "./user/dashboard/RetailerDashboard";
import AdAgencyDashboard from "./user/dashboard/AdAgencyDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import { fetchCampaigns } from "../redux/slices/user/campaignSlice";
import { fetchUser } from "../redux/slices/user/userProfileSlice";
import { fetchUserProfile } from "../redux/slices/admin/userProfileSlice";
import PageTitle from "../components/ui/page-title/PageTitle";


const Dashboard = () => {
  const { fetched,loading } = useSelector((state) => state.campaign);
  const [role, setRole] = useState(null);
  const dispatch = useDispatch();

  // Decode token once on mount
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

  // Fetch campaigns only for Retailer / Ad-Agency
  useEffect(() => {
    if (!role) return;
    if ((role === "Ad-Agency" || role === "Retailer") && !fetched && !loading) {
      dispatch(fetchCampaigns());
    }
  }, [fetched, loading, dispatch, role]);

  // Fetch profile based on role
  useEffect(() => {
    if (!role) return;
    if (role === "SUPERADMIN" || role === "ADMIN") {
      dispatch(fetchUserProfile());
    } else {
      dispatch(fetchUser());
    }
  }, [dispatch, role]);

  const title =
    role === "Ad-Agency"
      ? "Ad Agency"
      : role === "Retailer"
      ? "Retailer"
      : role === "SUPERADMIN"
      ? "SuperAdmin"
      : role === "ADMIN"
      ? "Admin"
      : "Xpandifi";

  return (
    <>
      <PageTitle title={title} />
      {role === "Retailer" && <RetailerDashboard />}
      {role === "Ad-Agency" && <AdAgencyDashboard />}
      {(role === "ADMIN" || role === "SUPERADMIN") && <AdminDashboard />}
    </>
  );
};

export default Dashboard;