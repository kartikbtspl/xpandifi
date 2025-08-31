import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";
// import Swal from "sweetalert2";

import Loader from "../../components/loader/Loader";
import { Modal } from "../../components/ui/modal/Modal";
import Button from "../../components/ui/button/Button";
import { formatDate } from "../../util/helper/formatDate";
import Toast from "../../components/ui/toast/Toast";
// Redux slices
import {
  fetchUserProfile,
  resetUserPassword,
} from "../../redux/slices/user/userSlice";
import {
  fetchAdminProfile,
  updateAdminProfile,
  resetAdminPassword,
} from "../../redux/slices/admin/adminSlice";
import { useCurrentUser } from "../../components/ui/user/CurrentUser";

const UserDetails = () => {
  const dispatch = useDispatch();
  const user = useCurrentUser();

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
  } = useForm();

  const isAdmin = ["SUPERADMIN", "ADMIN"].includes(user?.role);

  //  Reset form when user data changes
  useEffect(() => {
    if (user) {
      reset({
        fullName: user?.fullName || user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        city: user?.city || "",
        state: user?.state || "",
        country: user?.country || "",
      });
    }
  }, [user, reset]);

  // Profile picture preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfilePicFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setProfilePicPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleProfilePicSubmit = async () => {
    if (!profilePicFile) return;

    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("profilePic", profilePicFile);

      // Refresh profile
      if (!user?.role) return; // don't dispatch until role is known

      dispatch(isAdmin ? fetchAdminProfile() : fetchUserProfile());
    } finally {
      cancelEdit("profilePic");
      setUpdating(false);
    }
  };

  const handleProfileSubmit = async (data) => {
    if (!user.role) return;
    setUpdating(true);
    try {
      await dispatch(updateAdminProfile(data));
      await dispatch(fetchAdminProfile());
      cancelEdit("profile");
    } finally {
      setUpdating(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    const { currentPassword, newPassword } = data;
    setPasswordLoading(true);
    try {
      const thunk = isAdmin ? resetAdminPassword : resetUserPassword;

      //  Dispatch thunk and unwrap to get actual response or throw error
      const response = await dispatch(
        thunk({ currentPassword, newPassword })
      ).unwrap();

      cancelEdit("passwordModal");

      Toast.success(response?.message || "Password Updated!");
      reset();
    } catch (error) {
      Toast.error("Failed!", error || "Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  };

  const cancelEdit = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: false }));
    setProfilePicFile(null);
    setProfilePicPreview(null);
    reset();
  };

  return (
    <div className="relative w-full mx-auto p-6">
      {!user && (
        <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center gap-3">
          <Loader />
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#445E94] to-[#16122F] p-6 text-white">
          <h2 className="text-2xl font-bold">Profile</h2>
          <p className="text-blue-100">
            {user?.email || "Manage your profile"}
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img
                src={
                  profilePicPreview ||
                  user?.profilePic ||
                  "/images/profile.jpg"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
              />
              <button
                onClick={() =>
                  setEditMode((prev) => ({ ...prev, profilePic: true }))
                }
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
              >
                <i className="fas fa-camera" />
              </button>
            </div>
            <div className="mt-3 text-gray-700 text-md font-bold">
              {user?.businessName || user?.role || "User"}
            </div>

            {editMode.profilePic && (
              <div className="mt-6 w-full max-w-md bg-gray-50 p-5 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-3">Change Picture</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded mb-3"
                />
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => cancelEdit("profilePic")}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
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

          {/* Personal Info */}
          <div className="bg-gray-50 rounded-xl shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Personal Information
              </h3>
              {isAdmin && (
                <button
                  onClick={() =>
                    setEditMode((prev) => ({ ...prev, profile: true }))
                  }
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiEdit />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <Info label="Full Name" value={user?.fullName || user?.name} />
              <Info label="Mobile Number" value={user?.phone} />
              <Info label="City" value={user?.city} />
              <Info label="State" value={user?.state} />
              <Info label="Country" value={user?.country} />
              <Info label="Address" value={user?.address} />

              {!isAdmin && (
                <>
                  <Info label="Business Name" value={user?.businessName} />
                  <Info label="On Board" value={formatDate(user?.createdAt)} />
                </>
              )}
            </div>

            <div className="mt-6">
              <Button
                isIcon={false}
                onClick={() =>
                  setEditMode((prev) => ({ ...prev, passwordModal: true }))
                }
                label="Change Password"
              />
            </div>
          </div>

          {!isAdmin && (
            <div className="bg-gray-50 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Organization Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                <Info label="Business Name" value={user?.businessName} />
                <Info label="Business Type" value={user?.businessType} />
                <Info label="GST Number" value={user?.gstNumber} />
                <Info
                  label="Registered On"
                  value={formatDate(user?.createdAt)}
                />
                <Info
                  label="Organization Email"
                  value={user?.orgEmail || user?.email}
                />
                <Info
                  label="Organization Phone"
                  value={user?.orgPhone || user?.phone}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Admin Edit Modal */}
      {isAdmin && (
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
            <Input
              label="Full Name"
              {...register("fullName", { required: "Name is required" })}
              error={errors.fullName?.message}
            />
            <Input
              label="Email"
              {...register("email", { required: "Email is required" })}
              error={errors.email?.message}
            />
            <Input label="Phone" {...register("phone")} />
            <Input label="City" {...register("city")} />
            <Input label="State" {...register("state")} />
            <Input label="Country" {...register("country")} />
            <Input label="Address" {...register("address")} />

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => cancelEdit("profile")}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
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
      )}

      {/* Password Modal */}
      <Modal
        isOpen={editMode.passwordModal}
        onClose={() => cancelEdit("passwordModal")}
      >
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        <form
          onSubmit={handleSubmit(onPasswordSubmit)}
          className="flex flex-col gap-3"
        >
          <Input
            type="password"
            label="Old Password"
            {...register("currentPassword", {
              required: "Old password is required",
            })}
            error={errors.currentPassword?.message}
          />
          <Input
            type="password"
            label="New Password"
            {...register("newPassword", {
              required: "New password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            error={errors.newPassword?.message}
          />
          <Input
            type="password"
            label="Confirm Password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("newPassword") || "Passwords do not match",
            })}
            error={errors.confirmPassword?.message}
          />
          <div className="flex justify-end mt-4">
            <Button
              label="Update Password"
              type="submit"
              loading={passwordLoading}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

// Small helper components
const Info = ({ label, value }) => (
  <div className="flex w-full space-x-2">
    <span className="text-gray-500">{label}:</span>
    <div className="font-medium">{value || "N/A"}</div>
  </div>
);

const Input = React.forwardRef(({ label, error, ...props }, ref) => (
  <div>
    <input
      ref={ref}
      {...props}
      placeholder={label}
      className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
        error
          ? "border-red-400 focus:ring-red-400"
          : "border-gray-300 focus:ring-blue-400"
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
));

export default UserDetails;
