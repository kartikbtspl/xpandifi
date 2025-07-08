import { menuItems } from "../util/appsidebar-menu/menuItems";
import { retailerMenuItems } from "../util/appsidebar-menu/menuItems";
import SidebarItem from "./SidebarItem";

import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const AppSidebar = ({ isOpen, toggleSidebar }) => {
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

  const isRetailer = role === "Retailer";

  const sidebarItems = isRetailer ? retailerMenuItems : menuItems;

  return (
    <div
      className={`fixed md:static top-0 left-0 h-full z-40 bg-[#16122F] text-white w-64 flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="flex justify-center items-center p-6 mb-7 bg-gradient-to-r from-[#16122F] to-[#445E94]">
        <img src="/images/Logo.svg" alt="xpandifi-logo" />
        <button className="md:hidden" onClick={toggleSidebar}>
          ❌
        </button>
      </div>

      <nav className="flex flex-col gap-4">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.path}
            label={item.name}
            icon={item.icon}
            path={item.path}
            toggleSidebar={toggleSidebar}
          />
        ))}
      </nav>
    </div>
  );
};

export default AppSidebar;
