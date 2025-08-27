import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { fetchUserProfile } from "../../redux/slices/User/userSlice";
import Loader from "../../components/loader/Loader";
import { formatDate } from "../../util/helper/formatDate";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal/Modal";
import { resetUserPassword } from "../../api/User_API/user/user-api";
import Swal from "sweetalert2";

const UserDetails = () => {
  const dispatch = useDispatch();
  const { profile: user, loading } = useSelector((state) => state.user);

  const [editMode, setEditMode] = useState({
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
    watch,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const cancelEdit = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: false }));
    if (field === "profilePic") {
      setProfilePicFile(null);
      setProfilePicPreview(null);
    } else if (field === "passwordModal") {
      reset();
    }
  };

  const handleProfilePicSubmit = async () => {
    setUpdating(true);
    try {
      if (profilePicFile) {
        const formData = new FormData();
        formData.append("profilePic", profilePicFile);
        // await dispatch(uploadProfilePicture(formData));
      }
      await dispatch(fetchUserProfile());
    } catch (error) {
      console.error("Profile picture update failed:", error);
    } finally {
      cancelEdit("profilePic");
      setUpdating(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    const { currentPassword, newPassword } = data;
    setPasswordLoading(true);
    try {
      const response = await resetUserPassword({ currentPassword, newPassword });
      cancelEdit("passwordModal");
      if (response) {
        Swal.fire({
          title: "Password Updated!",
          icon: "success",
          timer: 2000,
        });
        reset();
      }
    } catch (error) {
      cancelEdit("passwordModal")
      reset();

      console.error("Password update failed", error);
      Swal.fire({
        title: "Failed!",
        text: error?.response?.data?.message || "Something went wrong",
        icon: "error",
      });
    } finally {
      reset()
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
        <div className="bg-gradient-to-r from-[#445E94] to-[#16122F] p-6 text-white">
          <h2 className="text-3xl font-bold">Profile</h2>
          <p className="text-blue-100 mt-1">
            {user?.email || "Manage your personal information"}
          </p>
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
            <div className="mt-2 text-gray-600">
              {user?.businessName || "User"}
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
                  Personal Information:
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                <div className="flex w-full space-x-2">
                  <span className="text-gray-500">Full Name:</span>
                  <div className="font-medium">{user?.fullName || "N/A"}</div>
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

              <div className="flex justify-between items-center mb-4 border-t pt-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Organization Details:
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex w-full space-x-2">
                  <span className="text-gray-500">Business Name:</span>
                  <div className="font-medium">
                    {user?.businessName || "N/A"}
                  </div>
                </div>
                <div className="flex w-full space-x-2">
                  <span className="text-gray-500">Role:</span>
                  <div className="font-medium">{user?.role || "N/A"}</div>
                </div>
                <div className="flex w-full space-x-2">
                  <span className="text-gray-500">On Board:</span>
                  <div className="font-medium">
                    {formatDate(user?.createdAt) || "N/A"}
                  </div>
                </div>
                <div className="flex w-full space-x-2">
                  <span className="text-gray-500">Activated On:</span>
                  <div className="font-medium">
                    {formatDate(user?.activatedAt) || "N/A"}
                  </div>
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
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={editMode.passwordModal}
        onClose={() =>
          setEditMode((prev) => ({ ...prev, passwordModal: false }))
        }
      >
        <div className="bg-white rounded-xl shadow-lg w-full p-6 relative">
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
        </div>
      </Modal>
    </div>
  );
};

export default UserDetails;