import ReusableTable from "../../../../components/table/ReusableTable";
import Button from "../../../../components/ui/button/Button";
import { Switch } from "@mui/material";
import { IoIosArrowForward } from "react-icons/io";
import { FiUser, FiMoreVertical } from "react-icons/fi";
import { useState } from "react";
import { useCurrentUser } from "../../../../components/ui/user/CurrentUser";
import EditProfile from "./EditProfile";
import AddStore from "./AddStore";
import { Link, Outlet, useLocation } from "react-router-dom";

const Settings = () => {
  const user = useCurrentUser();
  const location = useLocation();
  
  console.log(user);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);

  const [isOn, setIsOn] = useState(true);

  const isViewNested = location.pathname !== "/settings";

  const userData = {
    avatar: user?.profilePic || "logo.svg",
    name: user?.fullName || user?.name || "N/A",
    phone: user?.phone || "N/A",
    email: user?.email || "N/A",
    alternatePhone: user?.alternatePhone || "N/A",
    address:
      `${user?.address || ""} ${user?.city || ""} ${user?.state || ""} ${
        user?.country || ""
      }`.trim() || "N/A",
  };

  const rows = [
    {
      store_name: "Reliance Fresh",
      contact_person: "Pramod Kumar",
      phone: "+91 7856453423",
      address: "400090 (Andheri West, Mumbai)",
      role: "Manager",
    },
    {
      store_name: "Reliance Digital",
      contact_person: "Rajesh Sharma",
      phone: "+91 8765432109",
      address: "400053 (Bandra West, Mumbai)",
      role: "Sales",
    },
    {
      store_name: "Reliance Trends",
      contact_person: "Priya Singh",
      phone: "+91 7654321098",
      address: "400001 (Fort, Mumbai)",
      role: "Analyst",
    },
    {
      store_name: "Reliance Smart",
      contact_person: "Amit Patel",
      phone: "+91 6543210987",
      address: "400014 (Marine Lines, Mumbai)",
      role: "Manager",
    },
    {
      store_name: "Reliance Footprint",
      contact_person: "Neha Gupta",
      phone: "+91 9876543210",
      address: "400062 (Juhu, Mumbai)",
      role: "Sales",
    },
    {
      store_name: "Reliance Jewels",
      contact_person: "Sanjay Mehta",
      phone: "+91 9123456780",
      address: "400020 (Colaba, Mumbai)",
      role: "Analyst",
    },
  ];
  const cols = [
    { id: "store_name", label: "Store Name" },
    { id: "contact_person", label: "Contact" },
    { id: "phone", label: "Phone Number" },
    { id: "address", label: "Address" },
    {
      id: "role",
      label: "Role",
      render: (row) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-black border border-blue-400">
          {row.role}
        </span>
      ),
    },
  ];

  const handleRowClick = (row) => {
    console.log("Row clicked:", row);
  };

  return (
    <>
      {isViewNested ? (
        <Outlet />
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Settings</h2>
          </div>
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl py-3">
              <div>
                <div className="flex items-center justify-between px-6 mb-2">
                  <div className="flex font-semibold items-center gap-2 text-lg">
                    Profile
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      label="Edit"
                      isIcon={false}
                      onClick={() => setIsEditOpen(true)}
                    />
                    <FiMoreVertical
                      className="text-gray-500 cursor-pointer"
                      onClick={() => alert("No actions available for now")}
                    />
                  </div>
                </div>
              </div>

              {/* User Avatar and Basic Info */}
              <div className="grid grid-cols-5 gap-6 mb-3">
                {/* Left Column - Avatar (1 part) */}
                <div className="col-span-1 flex flex-col items-center">
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="rounded-full object-cover h-20 w-20"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <FiUser className="bg-gray-300 h-10 w-10 rounded-full text-gray-900 hidden" />
                </div>

                {/* Right Column - User Information (4 parts) */}
                <div className="col-span-4">
                  {/* First Row - Divided into 2 columns */}
                  <div className="grid grid-cols-2 gap-6 pr-6">
                    <div className="space-y-4">
                      {/* Name Section */}
                      <div className="space-y-1 mt-4">
                        <h4 className="px-1 text-gray-900 text-sm font-medium">
                          Name
                        </h4>
                        <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                          <p className="text-gray-400">{userData.name}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column in First Row */}
                    <div className="space-y-4">
                      {/* Email Section */}
                      <div className="space-y-1 mt-4">
                        <h4 className="px-1 text-gray-900 text-sm font-medium">
                          Email Id.
                        </h4>
                        <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                          <p className="text-gray-400">{userData.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact and Business Info */}
              <div className="grid grid-cols-4 gap-6 px-6 py-2 mb-3">
                {/* Phone Section */}
                <div className="space-y-1">
                  <h4 className="px-1 text-gray-900 text-sm font-medium">
                    Phone Number
                  </h4>
                  <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                    <p className="text-gray-400">{userData.phone}</p>
                  </div>
                </div>

                {/* Alternate Number Section */}
                <div className="space-y-1">
                  <h4 className="px-1 text-gray-900 text-sm font-medium">
                    Alternate Number
                  </h4>
                  <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                    <p className="text-gray-400">{userData.alternatePhone}</p>
                  </div>
                </div>

                {/* Additional Field 1 */}
                <div className="space-y-1">
                  <h4 className="px-1 text-gray-900 text-sm font-medium">
                    Business Registration Number
                  </h4>
                  <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                    <p className="text-gray-400">
                      {userData.field1 || "#123456789"}
                    </p>
                  </div>
                </div>

                {/* Additional Field 2 */}
                <div className="space-y-1">
                  <h4 className="px-1 text-gray-900 text-sm font-medium">
                    GST Number
                  </h4>
                  <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                    <p className="text-gray-400">
                      {userData.field2 || "XXXXXXXX1234"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Residential Address (full width) */}
              <div className="space-y-1 px-6 mb-6">
                <h4 className="px-1 text-gray-900 text-sm font-medium">
                  Residential Address
                </h4>
                <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                  <p className="text-gray-400">{userData.address}</p>
                </div>
              </div>
            </div>
          </div>

          <EditProfile
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            userData={userData}
            onSave={(updatedData) => {
              console.log("Updated User:", updatedData);
            }}
          />

          {user?.role === "Retailer" && (
            <>
              <div className="flex items-center justify-between mt-5 mb-2">
                <div className="flex font-semibold items-center px-6 gap-2 text-lg">
                  Stores
                </div>

                <Button label="Add Store" onClick={() => setIsAddStoreOpen(true)} />

                <AddStore
                  isOpen={isAddStoreOpen}
                  onClose={() => setIsAddStoreOpen(false)}
                />
              </div>

              <ReusableTable
                columns={cols}
                rows={rows}
                loading={false}
                onRowClick={handleRowClick}
              />

              <Link to="users">
                <div className="flex justify-between bg-white p-4 w-full my-4 rounded-lg hover:bg-gray-50 cursor-pointer">
                  Users
                  <IoIosArrowForward className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
              
              <Link to="permissions">
                <div className="flex justify-between bg-white p-4 w-full my-4 rounded-lg hover:bg-gray-50 cursor-pointer">
                  Permissions
                  <IoIosArrowForward className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            </>
          )}

          <h1 className="flex font-semibold items-center gap-2 mt-4 pl-2 text-lg">
            Data Privacy
          </h1>
          <div className="flex justify-between bg-white p-4 w-full my-4 rounded-lg">
            <span className="text-md text-gray-700">Allow Data Sharing</span>
            <Switch
              checked={isOn}
              size="small"
              onChange={() => {
                console.log("Toggled is working"), setIsOn(!isOn);
              }}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#445E94",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#445E94",
                },
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;


