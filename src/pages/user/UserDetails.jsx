import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  resetPassword,
  updateUser,
} from "../../redux/slices/userSlice";
import Loader from "../../components/loader/Loader";

const UserDetails = () => {
  const dispatch = useDispatch();
  const { profile: user, loading } = useSelector((state) => state.user);

  const [editMode, setEditMode] = useState({
    profile: false,
    email: false,
    password: false,
    profilePic: false,
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        address: user.address || "",
        phone: user.phone || "",
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (type) => {
    switch (type) {
      case "profile":
        await dispatch(
          updateUser({
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address, // ✅ Send full address
          })
        );
        break;
      case "email":
        await dispatch(updateUser({ email: formData.email }));
        break;
      case "password":
        await dispatch(
          resetPassword({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          })
        );
        break;
      case "profilePic":
        if (profilePicFile) {
          console.log("Upload profile picture to server:", profilePicFile);
        }
        break;
      default:
        break;
    }

    await dispatch(fetchUserProfile());
    setEditMode((prev) => ({ ...prev, [type]: false }));
    setProfilePicFile(null);
    setProfilePicPreview(null);
  };

  const cancelEdit = (type) => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        address: user.address || "",
        phone: user.phone || "",
        currentPassword: "",
        newPassword: "",
      });
    }
    setEditMode((prev) => ({ ...prev, [type]: false }));
    setProfilePicFile(null);
    setProfilePicPreview(null);
  };

  return (
    <div className="relative w-full mx-auto p-6">
      {loading && (
        <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center gap-3">
          <p className="text-[#445E94] text-lg font-semibold animate-pulse">
             user profile...
          </p>
          <Loader />
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#445E94] to-[#16122F] p-6 text-white">
          <h2 className="text-3xl font-bold">User Profile</h2>
          <p className="text-blue-100 mt-1">Manage your personal information</p>
        </div>

        <div className="p-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img
                src={
                  profilePicPreview ||
                  user?.profilePic ||
                  "https://i.pravatar.cc/150?u=user"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <button
                onClick={() =>
                  setEditMode((prev) => ({ ...prev, profilePic: true }))
                }
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
              >
                <i className="fas fa-camera" />
              </button>
            </div>

            {editMode.profilePic && (
              <div className="mt-4 w-full max-w-md bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-3">
                  Change Profile Picture
                </h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded mb-3"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => cancelEdit("profilePic")}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSubmit("profilePic")}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Personal Info & Security */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Personal Information
                </h3>
                <button
                  onClick={() =>
                    setEditMode((prev) => ({ ...prev, profile: true }))
                  }
                  className="text-blue-600 hover:text-blue-800"
                >
                  <i className="fas fa-edit mr-1" /> Edit
                </button>
              </div>

              {!editMode.profile ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-500 text-sm">Full Name</label>
                    <p className="font-medium">{user?.fullName || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm">
                      Mobile Number
                    </label>
                    <p className="font-medium">{user?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm">Address</label>
                    <p className="font-medium">{formData.address}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Full Name"
                  />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Mobile Number"
                  />
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Address"
                  />
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      onClick={() => cancelEdit("profile")}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSubmit("profile")}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Account Security */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Account Security
                </h3>
              </div>

              <div className="space-y-6">
                {/* Email */}
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-gray-500">Email Address</label>
                    <button
                      onClick={() =>
                        setEditMode((prev) => ({ ...prev, email: true }))
                      }
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <i className="fas fa-edit mr-1" /> Change
                    </button>
                  </div>

                  {!editMode.email ? (
                    <p className="font-medium">{user?.email || "N/A"}</p>
                  ) : (
                    <div>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded mb-3"
                        placeholder="Email Address"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => cancelEdit("email")}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSubmit("email")}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-gray-500">Password</label>
                    <button
                      onClick={() =>
                        setEditMode((prev) => ({ ...prev, password: true }))
                      }
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <i className="fas fa-edit mr-1" /> Change
                    </button>
                  </div>

                  {!editMode.password ? (
                    <p className="font-medium">••••••••</p>
                  ) : (
                    <div className="space-y-3">
                      <input
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Current Password"
                      />
                      <input
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="New Password"
                      />
                      <div className="flex gap-2 justify-end pt-2">
                        <button
                          onClick={() => cancelEdit("password")}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSubmit("password")}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Reset Password
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
