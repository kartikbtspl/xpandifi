import { useSelector } from "react-redux";
import RetailerDashboard from "./dashboard/RetailerDashboard";
import AdAgencyDashboard from "./dashboard/AdAgencyDashboard";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Shimmer from "../components/shimmer/Shimmer";
import { useDispatch } from "react-redux";
import { fetchCampaigns } from "../redux/slices/campaignSlice";
import { fetchUserProfile } from "../redux/slices/userSlice";

const Dashboard = () => {
  const { profile, loading } = useSelector((state) => state.user);
  const [role, setRole] = useState(null);
  const dispatch =useDispatch()

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
    dispatch(fetchCampaigns());
    dispatch(fetchUserProfile())
  }, [dispatch]);

  if (loading) {
    return (
      <Shimmer />
    );
  }

  if (role === "Retailer") {
    return <RetailerDashboard />;
  } else if (role === "Ad-Agency") {
    return <AdAgencyDashboard />;
  }
};

export default Dashboard;
