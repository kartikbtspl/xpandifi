import ReusableTable from "../../../../components/table/ReusableTable";
import Button from "../../../../components/ui/button/Button";
import { Switch } from "@mui/material";
import { IoIosArrowForward } from "react-icons/io";
import { FiUser, FiMoreVertical } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useCurrentUser } from "../../../../components/ui/user/CurrentUser";
import EditProfile from "./EditProfile";
import AddStore from "./AddStore";
import { Link, Outlet, useLocation } from "react-router-dom";
import Toast from "../../../../components/ui/toast/Toast";

const Settings = () => {
  const user = useCurrentUser();
  const location = useLocation();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [isOn, setIsOn] = useState(true);

  const [profileData, setProfileData] = useState({
    avatar: "logo.svg",
    name: "N/A",
    phone: "N/A",
    email: "N/A",
    alternatePhone: "",
    address: "N/A",
    field1: "#123456789",
    field2: "XXXXXXXX1234",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        avatar: user.profilePic || "logo.svg",
        name: user.fullName || "N/A",
        phone: user.phone || "N/A",
        email: user.email || "N/A",
        alternatePhone: user.alternatePhone || "N/A",
        address:
          `${user.address || ""}, ${user.city || ""}, ${user.state || ""}, ${
            user.country || ""
          }`
            .replace(/^,|,$/g, "")
            .trim() || "N/A",
        field1: user.businessName || "#123456789",
        field2: user.gstNumber || "XXXXXXXX1234",
      });
    }
  }, [user]);

  const [stores, setStores] = useState([
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
  ]);

  const isViewNested = location.pathname !== "/settings";

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

  const handleProfileSave = (updatedData) => {
    setProfileData(updatedData);
    Toast.success(
      "Profile Updated!",
      "Your profile information has been updated successfully."
    );
  };

  const handleAddStore = (newStore) => {
    setStores((prev) => [
      ...prev,
      {
        store_name: newStore.storeName,
        contact_person: newStore.contactRole,
        phone: newStore.phone,
        address: newStore.storeAddress,
        role: newStore.contactRole,
      },
    ]);

    Toast.success("Store Added!", "The new store has been added successfully.");
  };

  const handleToggle = () => {
    const newState = !isOn; // compute the new state
    setIsOn(newState);

    if (newState) {
      Toast.success("Data sharing turned ON");
    } else {
      Toast.success("Data sharing turned OFF");
    }
  };

  return (
    <>
      {isViewNested ? (
        <Outlet />
      ) : (
        <div>
          {/* Profile Section */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Settings</h2>
          </div>

          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl py-3">
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
                    onClick={() => Toast.info("NO actions Available")}
                  />
                </div>
              </div>

              {/* Avatar & Info */}
              <div className="grid grid-cols-5 gap-6 mb-3 px-6">
                <div className="col-span-1 flex flex-col items-center">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt={profileData.name}
                      className="rounded-full object-cover h-20 w-20"
                    />
                  ) : (
                    <FiUser className="bg-gray-300 h-10 w-10 rounded-full text-gray-900" />
                  )}
                </div>

                <div className="col-span-4 grid grid-cols-2 gap-6">
                  <div className="space-y-4 mt-4">
                    <h4 className="px-1 text-gray-900 text-sm font-medium">
                      Name
                    </h4>
                    <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                      <p className="text-gray-400">{profileData.name}</p>
                    </div>
                  </div>
                  <div className="space-y-4 mt-4">
                    <h4 className="px-1 text-gray-900 text-sm font-medium">
                      Email Id.
                    </h4>
                    <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                      <p className="text-gray-400">{profileData.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone & Business Info */}
              <div className="grid grid-cols-4 gap-6 px-6 py-2 mb-3">
                <div className="space-y-1">
                  <h4 className="px-1 text-gray-900 text-sm font-medium">
                    Phone Number
                  </h4>
                  <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                    <p className="text-gray-400">{profileData.phone}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="px-1 text-gray-900 text-sm font-medium">
                    Alternate Number
                  </h4>
                  <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                    <p className="text-gray-400">
                      {profileData.alternatePhone}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="px-1 text-gray-900 text-sm font-medium">
                    Business Registration Number
                  </h4>
                  <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                    <p className="text-gray-400">{profileData.field1}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="px-1 text-gray-900 text-sm font-medium">
                    GST Number
                  </h4>
                  <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                    <p className="text-gray-400">{profileData.field2}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1 px-6 mb-6">
                <h4 className="px-1 text-gray-900 text-sm font-medium">
                  Residential Address
                </h4>
                <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                  <p className="text-gray-400">{profileData.address}</p>
                </div>
              </div>
            </div>
          </div>

          <EditProfile
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            userData={profileData}
            onSave={handleProfileSave}
          />

          {user?.role === "Retailer" && (
            <>
              <div className="flex items-center justify-between mt-5 mb-2 px-6">
                <div className="flex font-semibold items-center gap-2 text-lg">
                  Stores
                </div>
                <Button
                  label="Add Store"
                  onClick={() => setIsAddStoreOpen(true)}
                />
                <AddStore
                  isOpen={isAddStoreOpen}
                  onClose={() => setIsAddStoreOpen(false)}
                  onAdd={handleAddStore}
                />
              </div>

              <ReusableTable
                columns={cols}
                rows={stores}
                loading={false}
                onRowClick={handleRowClick}
              />

              <Link to="users">
                <div className="flex justify-between bg-white p-4 w-full my-4 rounded-lg hover:bg-gray-50 cursor-pointer px-6">
                  Users
                  <IoIosArrowForward className="h-5 w-5 text-gray-400" />
                </div>
              </Link>

              <Link to="permissions">
                <div className="flex justify-between bg-white p-4 w-full my-4 rounded-lg hover:bg-gray-50 cursor-pointer px-6">
                  Permissions
                  <IoIosArrowForward className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            </>
          )}

          <h1 className="flex font-semibold items-center gap-2 mt-4 pl-2 text-lg">
            Data Privacy
          </h1>
          <div className="flex justify-between bg-white p-4 w-full my-4 rounded-lg px-6">
            <span className="text-md text-gray-700">Allow Data Sharing</span>
            <Switch
              checked={isOn}
              size="small"
              onChange={handleToggle}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#445E94" },
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
