import { useSelector } from "react-redux";
import RetailerDashboard from "./dashboard/RetailerDashboard";
import AdAgencyDashboard from "./dashboard/AdAgencyDashboard";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { profile, loading } = useSelector((state) => state.user);
  const [role, setRole] = useState(null);

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

  if (loading) {
    return (
      <div className="flex text-3xl justify-center items-center h-screen text-[#445E94]">
        Loading Dashboard...
      </div>
    );
  }

  if (role === "Retailer") {
    return <RetailerDashboard />;
  } else if (role === "Ad-Agency") {
    return <AdAgencyDashboard />;
  }
};

export default Dashboard;
