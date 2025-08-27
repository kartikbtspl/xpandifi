import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  updateUser,
  // updateUserProfilePic, // <-- You need to implement this in Redux or API
} from "../../../redux/slices/User/userProfileSlice";
import Loader from "../../../components/loader/Loader";
import { Modal } from "../../../components/ui/modal/Modal";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";
import { resetUserPassword } from "../../../api/Admin_API/user-api/user-api";
import Swal from "sweetalert2";
import Button from "../../../components/ui/button/Button";

const AdminUserDetails = () => {
  const dispatch = useDispatch();
  const { profile: user, loading } = useSelector((state) => state.user);

  const [editMode, setEditMode] = useState({
    profile: false,
    profilePic: false,
    passwordModal: false,
  });

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
    },
  });

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
      });
    }
  }, [user, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (data) => {
    setUpdating(true);
    await dispatch(updateUser(data));
    await dispatch(fetchUser());
    setUpdating(false);
    setEditMode((prev) => ({ ...prev, profile: false }));
  };

  const handleProfilePicSubmit = async () => {
    if (profilePicFile) {
      const formData = new FormData();
      formData.append("profilePic", profilePicFile);
      // await dispatch(updateUserProfilePic(formData)); // <-- Implement in Redux/API
      await dispatch(fetchUser());
    }
    setEditMode((prev) => ({ ...prev, profilePic: false }));
    setProfilePicFile(null);
    setProfilePicPreview(null);
  };

  const cancelEdit = (type) => {
    if (type === "profile") {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
      });
    }
    setEditMode((prev) => ({ ...prev, [type]: false }));
    setProfilePicFile(null);
    setProfilePicPreview(null);
  };

  const onPasswordSubmit = async (data) => {
    const { currentPassword, newPassword } = data;
    setPasswordLoading(true);
    try {
      const response = await resetUserPassword({ currentPassword, newPassword });
      cancelEdit("passwordModal");

      if (response?.success || response?.status === 200) {
        Swal.fire({
          title: "Password Updated!",
          icon: "success",
          timer: 2000,
        });
        reset();
      }
    } catch (error) {
      cancelEdit("passwordModal");
      reset();
      Swal.fire({
        title: "Failed!",
        text: error?.response?.data?.message || "Something went wrong",
        icon: "error",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="relative w-full mx-auto p-6">
      {(loading || updating) && (
        <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center gap-3">
          <p className="text-[#445E94] text-lg font-semibold animate-pulse">
            {updating ? "Updating user profile..." : "Loading profile..."}
          </p>
          <Loader />
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#445E94] to-[#16122F] p-6 text-white text-center">
          <h2 className="text-3xl font-bold">Profile</h2>
          <p className="text-blue-100 text-sm mt-1">Manage your personal information</p>
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
            <div className="mt-2 text-gray-600">{user?.role || "User"}</div>

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
                    onClick={handleProfilePicSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="w-full">
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
                  <FiEdit />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex w-full space-x-2">
                  <span className="text-gray-500">Full Name:</span>
                  <div className="font-medium">{user?.name || "N/A"}</div>
                </div>
                <div className="flex w-full space-x-2">
                  <span className="text-gray-500">Mobile Number:</span>
                  <div className="font-medium">{user?.phone || "N/A"}</div>
                </div>
                <div className="flex w-full space-x-2">
                  <span className="text-gray-500">City:</span>
                  <div className="font-medium">{user?.city || "N/A"}</div>
                </div>
                <div className="flex w-full space-x-2">
                  <span className="text-gray-500">State:</span>
                  <div className="font-medium">{user?.state || "N/A"}</div>
                </div>
                <div className="flex w-full space-x-2">
                  <span className="text-gray-500">Country:</span>
                  <div className="font-medium">{user?.country || "N/A"}</div>
                </div>
                <div className="flex w-full space-x-2">
                  <span className="text-gray-500">Address:</span>
                  <div className="font-medium">{user?.address || "N/A"}</div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={() =>
                    setEditMode((prev) => ({ ...prev, passwordModal: true }))
                  }
                  isIcon={false}
                  type="button"
                  label="Change Password"
                />
              </div>

              {/* Edit Modal */}
              <Modal
                isOpen={editMode.profile}
                onClose={() => cancelEdit("profile")}
                size="md"
              >
                <h2 className="text-center text-gray-800 font-bold mb-4">
                  Edit Profile
                </h2>
                <form
                  onSubmit={handleSubmit(handleProfileSubmit)}
                  className="space-y-4"
                >
                  <input
                    {...register("name", { required: "Name is required" })}
                    className="w-full p-2 border rounded"
                    placeholder="Full Name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}

                  <input
                    {...register("email", {
                      required: "Email is required",
                    })}
                    className="w-full p-2 border rounded"
                    placeholder="Email Address"
                  />
                  <input
                    {...register("phone")}
                    className="w-full p-2 border rounded"
                    placeholder="Mobile Number"
                  />
                  <input
                    {...register("city")}
                    className="w-full p-2 border rounded"
                    placeholder="City"
                  />
                  <input
                    {...register("state")}
                    className="w-full p-2 border rounded"
                    placeholder="State"
                  />
                  <input
                    {...register("country")}
                    className="w-full p-2 border rounded"
                    placeholder="Country"
                  />
                  <input
                    {...register("address")}
                    className="w-full p-2 border rounded"
                    placeholder="Address"
                  />

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => cancelEdit("profile")}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !isDirty}
                      className={`px-4 py-2 rounded text-white ${
                        isDirty
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </Modal>
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      <Modal
        isOpen={editMode.passwordModal}
        onClose={() =>
          setEditMode((prev) => ({ ...prev, passwordModal: false }))
        }
      >
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        <form
          onSubmit={handleSubmit(onPasswordSubmit)}
          className="flex flex-col gap-3"
        >
          <div>
            <input
              type="password"
              placeholder="Old Password"
              {...register("currentPassword", {
                required: "Old password is required",
              })}
              className="border p-2 rounded w-full"
            />
            {errors.currentPassword && (
              <p className="text-sm text-red-600">
                {errors.currentPassword.message}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="New Password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              className="border p-2 rounded w-full"
            />
            {errors.newPassword && (
              <p className="text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              })}
              className="border p-2 rounded w-full"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              isIcon={false}
              type="submit"
              label="Update Password"
              loading={passwordLoading}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUserDetails;