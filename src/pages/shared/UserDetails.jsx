import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { FiEdit, FiCamera } from "react-icons/fi";
import Loader from "../../components/loader/Loader";
import { Modal } from "../../components/ui/modal/Modal";
import Button from "../../components/ui/button/Button";
import { formatDate } from "../../util/helper/formatDate";
import Toast from "../../components/ui/toast/Toast";
import Input from "../../components/ui/input/Input";
// Redux slices
import {
  fetchUserProfile,
  updateUserProfile,
  resetUserPassword,
} from "../../redux/slices/user/userSlice";
import {
  fetchAdminProfile,
  updateAdminProfile,
  resetAdminPassword,
} from "../../redux/slices/admin/adminSlice";

import { useCurrentUser } from "../../components/ui/user/CurrentUser";
import LocationFields from "../../components/LocationsDropdown/LocationFields";

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

  // ✅ Separate useForm for profile edit
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmitForm,
    reset: resetProfile,
    control,
    setValue,
    watch,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm();

  // ✅ Separate useForm for password reset
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmitForm,
    reset: resetPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm();

  const isAdminOrSuperAdmin = ["SUPERADMIN", "ADMIN"].includes(user?.role);
  const isAdmin = user?.role ==='ADMIN';


  // Reset profile form when user data changes
  useEffect(() => {
    if (user) {
      const baseFields = {
        fullName: user?.fullName || user?.name || "",
        phone: user?.phone || "",
        country: user?.country || "",
        state: user?.state || "",
        city: user?.city || "",
        address: user?.address || "",
      };

      // Only include user-specific fields for non-admin users
      if (!["SUPERADMIN", "ADMIN"].includes(user?.role)) {
        baseFields.alternateNumber = user?.alternateNumber || "";
        baseFields.businessRegistrationNumber = user?.businessRegistrationNumber || "";
        baseFields.gstNumber = user?.gstNumber || "";
      }

      resetProfile(baseFields);
    }
  }, [user, resetProfile]);

  // ✅ Profile form submit
  const handleProfileSubmit = async (data) => {
    console.log("Profile Data Submitted:", data);

    setUpdating(true);
    try {
      if (isAdminOrSuperAdmin) {
        // Admin flow - FormData for file upload support
        // Admin API uses 'name' instead of 'fullName' and 'profile_url' instead of 'profileUrl'
        const formData = new FormData();
        
        // Append all editable fields with correct field names for admin API
        if (data.fullName) formData.append('name', data.fullName);
        if (data.phone) formData.append('phone', data.phone);
        if (data.country) formData.append('country', data.country);
        if (data.state) formData.append('state', data.state);
        if (data.city) formData.append('city', data.city);
        if (data.address) formData.append('address', data.address);

        // Append profile image if selected (admin uses 'profile_url')
        if (profilePicFile) {
          formData.append('profile_url', profilePicFile);
        }

        // Check if there are any changes
        const hasChanges = 
          data.fullName !== (user?.fullName || user?.name) ||
          data.phone !== user?.phone ||
          data.country !== user?.country ||
          data.state !== user?.state ||
          data.city !== user?.city ||
          data.address !== user?.address ||
          profilePicFile;
        
        if (!hasChanges) {
          Toast.info("No changes to update");
          cancelEdit("profile");
          setUpdating(false);
          return;
        }

        await dispatch(updateAdminProfile(formData)).unwrap();
        await dispatch(fetchAdminProfile()).unwrap();
        Toast.success("Profile updated successfully!");
      } else {
        // User flow (Ad-Agency/Retailer) - FormData for file upload
        const formData = new FormData();
        
        // Append all editable fields
        if (data.fullName) formData.append('fullName', data.fullName);
        if (data.phone) formData.append('phone', data.phone);
        if (data.alternateNumber) formData.append('alternateNumber', data.alternateNumber);
        if (data.businessRegistrationNumber) formData.append('businessRegistrationNumber', data.businessRegistrationNumber);
        if (data.gstNumber) formData.append('gstNumber', data.gstNumber);
        if (data.address) formData.append('address', data.address);

        // Append profile image if selected
        if (profilePicFile) {
          formData.append('profileUrl', profilePicFile);
        }

        console.log("Sending FormData to API...");
        const result = await dispatch(updateUserProfile(formData)).unwrap();
        console.log("API Result:", result);
        
        // Refresh profile after update
        await dispatch(fetchUserProfile()).unwrap();
        Toast.success(result?.message || "Profile updated successfully!");
      }

      cancelEdit("profile");
    } catch (err) {
      Toast.error(err?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };


  // ✅ Password form submit
  const handlePasswordSubmit = async (data) => {
    const { currentPassword, newPassword } = data;
    setPasswordLoading(true);
    try {
      const thunk = isAdminOrSuperAdmin ? resetAdminPassword : resetUserPassword;
      const response = await dispatch(
        thunk({ currentPassword, newPassword })
      ).unwrap();

      cancelEdit("passwordModal");
      Toast.success(response?.message || "Password Updated!");
      resetPassword();
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
    resetProfile();
    resetPassword();
  };

  return (
    <div className="relative w-full mx-auto">
      {!user && (
        <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center gap-3">
          <Loader />
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Gradient Header with Profile Info */}
        <div className="relative bg-gradient-to-r from-[#445E94] to-[#16122F] px-6 py-8">
          {/* Edit Button */}
          <button
            onClick={() => setEditMode((prev) => ({ ...prev, profile: true }))}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
          >
            <FiEdit size={18} />
          </button>

          {/* Profile Picture and Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5">
            <div className="relative">
              <img
                src={profilePicPreview || user?.profileUrl || user?.profile_url || "/logo.svg"}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white/30 shadow-lg object-cover bg-white"
                onError={(e) => { e.target.src = "/logo.svg"; }}
              />
              <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">
                {user?.fullName || user?.name || "User"}
              </h2>
              <p className="text-sm text-blue-100 mt-1">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                {user?.role || "User"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-6 py-4">

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">{user?.phone || "N/A"}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wide">City</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">{user?.city || "N/A"}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wide">State</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">{user?.state || "N/A"}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Country</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">{user?.country || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Personal Information Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#445E94] rounded-full"></span>
              Personal Information
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <InfoCard label="Full Name" value={user?.fullName || user?.name} />
            <InfoCard label="Email Address" value={user?.email} />
            <InfoCard label="Mobile Number" value={user?.phone} />
            {!isAdminOrSuperAdmin && (
              <InfoCard label="Alternate Number" value={user?.alternateNumber} />
            )}
            <InfoCard label="Address" value={user?.address} />
            {!isAdminOrSuperAdmin && (
              <InfoCard label="Member Since" value={formatDate(user?.createdAt)} />
            )}
          </div>
        </div>

        {/* Security & Actions Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#445E94] rounded-full"></span>
              {isAdminOrSuperAdmin ? "Security" : "Organization Details"}
            </h3>
          </div>
          <div className="p-6">
            {!isAdminOrSuperAdmin ? (
              <div className="space-y-4">
                <InfoCard label="Business Name" value={user?.businessName} />
                <InfoCard label="Business Type" value={user?.businessType} />
                <InfoCard label="Registration Number" value={user?.businessRegistrationNumber} />
                <InfoCard label="GST Number" value={user?.gstNumber} />
              </div>
            ) : (
              <div className="space-y-4">
                <InfoCard label="Role" value={user?.role} />
                <InfoCard label="Account Status" value="Active" />
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <Button
                isIcon={false}
                onClick={() => setEditMode((prev) => ({ ...prev, passwordModal: true }))}
                label="Change Password"
                className="w-full justify-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Admin Edit Modal */}
      {isAdminOrSuperAdmin && (
        <Modal
          isOpen={editMode.profile}
          onClose={() => cancelEdit("profile")}
          size="md"
        >
          <h2 className="text-center text-gray-800 font-bold mb-4">
            Edit Profile
          </h2>
          <form
            onSubmit={handleProfileSubmitForm(handleProfileSubmit)}
            className="space-y-4"
            autoComplete="off"
          >
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <img
                  src={profilePicPreview || user?.profileUrl || user?.profile_url || "/logo.svg"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-gray-200 shadow-md object-cover"
                  onError={(e) => { e.target.src = "/logo.svg"; }}
                />
                <label
                  htmlFor="adminProfilePicInput"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
                >
                  <FiCamera size={16} />
                </label>
                <input
                  id="adminProfilePicInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfilePicFile(file);
                      setProfilePicPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Click camera to change photo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm mb-1">
                  Full Name<span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  {...registerProfile("fullName", {
                    required: "Full Name is required",
                  })}
                  disabled={isAdmin}
                />
                {profileErrors.fullName && (
                  <p className="text-sm text-red-500">{profileErrors.fullName.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm mb-1">
                  Phone<span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  placeholder="9876543210"
                  {...registerProfile("phone", {
                    required: "Phone is required",
                  })}
                />
                {profileErrors.phone && (
                  <p className="text-sm text-red-500">{profileErrors.phone.message}</p>
                )}
              </div>

              {/* Location fields */}
              <LocationFields
                control={control}
                setValue={setValue}
                watch={watch}
                errors={profileErrors}
                isPincode={false}
                isRequired={true}
              />

              {/* Address */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm mb-1">Address<span className="text-red-500">*</span></label>
                <Input
                  as="textarea"
                  rows={3}
                  placeholder="Enter full address"
                  {...registerProfile("address", {
                    required: "Address is required",
                  })}
                />
                {profileErrors.address && (
                  <p className="text-sm text-red-500">{profileErrors.address.message}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                isIcon={false}
                label="Cancel"
                onClick={() => cancelEdit("profile")}
                className="bg-gray-300 text-gray-700 hover:bg-gray-400"
              />
              <Button
                type="submit"
                isIcon={false}
                label={isProfileSubmitting || updating ? "Updating..." : "Update"}
                loading={isProfileSubmitting || updating}
              />
            </div>
          </form>
        </Modal>
      )}

      {/* User Edit Modal (Ad-Agency/Retailer) */}
      {!isAdminOrSuperAdmin && (
        <Modal
          isOpen={editMode.profile}
          onClose={() => cancelEdit("profile")}
          size="md"
        >
          <h2 className="text-center text-gray-800 font-bold mb-4">
            Edit Profile
          </h2>
          <form
            onSubmit={handleProfileSubmitForm(handleProfileSubmit)}
            className="space-y-4"
            autoComplete="off"
          >
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <img
                  src={profilePicPreview || user?.profileUrl || "/logo.svg"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-gray-200 shadow-md object-cover"
                  onError={(e) => { e.target.src = "/logo.svg"; }}
                />
                <label
                  htmlFor="profilePicInput"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
                >
                  <FiCamera size={16} />
                </label>
                <input
                  id="profilePicInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfilePicFile(file);
                      setProfilePicPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Click camera to change photo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm mb-1">
                  Full Name<span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  {...registerProfile("fullName", {
                    required: "Full Name is required",
                  })}
                />
                {profileErrors.fullName && (
                  <p className="text-sm text-red-500">{profileErrors.fullName.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm mb-1">
                  Phone<span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  placeholder="9876543210"
                  {...registerProfile("phone", {
                    required: "Phone is required",
                  })}
                />
                {profileErrors.phone && (
                  <p className="text-sm text-red-500">{profileErrors.phone.message}</p>
                )}
              </div>

              {/* Alternate Number */}
              <div>
                <label className="block text-sm mb-1">Alternate Number</label>
                <Input
                  type="tel"
                  placeholder="9876543210"
                  {...registerProfile("alternateNumber")}
                />
              </div>

              {/* Business Registration Number */}
              <div>
                <label className="block text-sm mb-1">Business Registration Number</label>
                <Input
                  type="text"
                  placeholder="G4224HRDT"
                  {...registerProfile("businessRegistrationNumber")}
                />
              </div>

              {/* GST Number */}
              <div>
                <label className="block text-sm mb-1">GST Number</label>
                <Input
                  type="text"
                  placeholder="GT7437473647"
                  {...registerProfile("gstNumber")}
                />
              </div>

              {/* Address */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm mb-1">Address</label>
                <Input
                  as="textarea"
                  rows={3}
                  placeholder="Enter full address"
                  {...registerProfile("address")}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                isIcon={false}
                label="Cancel"
                onClick={() => cancelEdit("profile")}
                className="bg-gray-300 text-gray-700 hover:bg-gray-400"
              />
              <Button
                type="submit"
                isIcon={false}
                label={isProfileSubmitting || updating ? "Updating..." : "Update"}
                loading={isProfileSubmitting || updating}
              />
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
          onSubmit={handlePasswordSubmitForm(handlePasswordSubmit)}
          className="flex flex-col gap-3"
        >
          <Input
            type="password"
            label="Old Password"
            {...registerPassword("currentPassword", {
              required: "Old password is required",
            })}
            error={passwordErrors.currentPassword?.message}
          />
          <Input
            type="password"
            label="New Password"
            {...registerPassword("newPassword", {
              required: "New password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            error={passwordErrors.newPassword?.message}
          />
          <Input
            type="password"
            label="Confirm Password"
            {...registerPassword("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watchPassword("newPassword") ||
                "Passwords do not match",
            })}
            error={passwordErrors.confirmPassword?.message}
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

// Beautiful Info Card component
const InfoCard = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
    <span className="text-sm text-gray-500 font-medium">{label}</span>
    <span className="text-sm font-semibold text-gray-800 mt-1 sm:mt-0">{value || "N/A"}</span>
  </div>
);

export default UserDetails;

