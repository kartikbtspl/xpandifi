import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

import Loader from "../../components/loader/Loader";
import { Modal } from "../../components/ui/modal/Modal";
import Button from "../../components/ui/button/Button";
import { formatDate } from "../../util/helper/formatDate";

// Redux slices
import { fetchUser } from "../../redux/slices/user/userSlice";
import {
  fetchAdmin,
  updateUser,
} from "../../redux/slices/admin/userProfileSlice";

// APIs
import { resetUserPassword } from "../../api/user/user/user-api";
import { resetUserPassword as adminResetPassword } from "../../api/admin/user-api/user-api";

const UserDetails = () => {
  const dispatch = useDispatch();
  const [role, setRole] = useState(null);


  useEffect(()=>{
    dispatch(fetchAdmin())
    dispatch(fetchUser())
  })
  // ✅ Decode token only once
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded?.role || null);

        // if(['SUPERADMIN','ADMIN'].includes(decoded?.role)){
        //   dispatch(fetchAdmin())
        // }else{
        //   console.log("this sections called")
        //   dispatch(fetchUser())
        // }
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, [dispatch]);

  // ✅ Pick correct slice automatically
  // const { profile: user, loading } =
  //   role === "SUPERADMIN" || role === "ADMIN"
  //     ? useSelector((state) => state.adminProfile)
  //     : useSelector((state) => state.user);

const adminProfile = useSelector((state) => state.adminProfile);
const userProfile = useSelector((state) => state.user);

const user = role
  ? ['SUPERADMIN','ADMIN'].includes(role)
    ? adminProfile.profile
    : userProfile.profile
  : null;

const loading = user.loading


  console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
console.log(user)
console.log(adminProfile)
console.log(userProfile)
console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
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

  // ✅ Fetch correct profile
  useEffect(() => {
    if (!role) return;
    if (role === "SUPERADMIN" || role === "ADMIN") {
      dispatch(fetchAdmin());
    } else {
      dispatch(fetchUser());
    }
  }, [dispatch, role]);

  // ✅ Reset form with user data
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

  // ✅ File Upload Preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicSubmit = async () => {
    setUpdating(true);
    try {
      if (profilePicFile) {
        const formData = new FormData();
        formData.append("profilePic", profilePicFile);

        // TODO: Dispatch uploadProfilePic(formData) API here
      }
      // Refresh profile
      if (role === "SUPERADMIN" || role === "ADMIN") {
        await dispatch(fetchAdmin());
      } else {
        await dispatch(fetchUser());
      }
    } finally {
      cancelEdit("profilePic");
      setUpdating(false);
    }
  };

  // ✅ Profile update (admin only)
  const handleProfileSubmit = async (data) => {
    if (!(role === "SUPERADMIN" || role === "ADMIN")) return;
    setUpdating(true);
    try {
      await dispatch(updateUser(data));
      await dispatch(fetchAdmin());
      cancelEdit("profile");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Password Reset
  const onPasswordSubmit = async (data) => {
    const { currentPassword, newPassword } = data;
    setPasswordLoading(true);
    try {
      const apiFn =
        role === "SUPERADMIN" || role === "ADMIN"
          ? adminResetPassword
          : resetUserPassword;

      const response = await apiFn({ currentPassword, newPassword });
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
      Swal.fire({
        title: "Failed!",
        text: error?.response?.data?.message || "Something went wrong",
        icon: "error",
      });
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
      {loading  && (
        <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center gap-3">
          <Loader />
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#445E94] to-[#16122F] p-6 text-white">
          <h2 className="text-2xl font-bold">Profile</h2>
          <p className="text-blue-100">{user?.email || "Manage your profile"}</p>
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
                  "/images/profile.jpeg"
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
              {(role === "SUPERADMIN" || role === "ADMIN") && (
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

              {/* Extra info only for users */}
              {!(role === "SUPERADMIN" || role === "ADMIN") && (
                <>
                  <Info label="Business Name" value={user?.businessName} />
                  <Info label="On Board" value={formatDate(user?.createdAt)} />
                </>
              )}
            </div>

            {/* Change Password */}
            <div className="mt-6">
              <Button
                onClick={() =>
                  setEditMode((prev) => ({ ...prev, passwordModal: true }))
                }
                label="Change Password"
              />
            </div>
          </div>

          {/* Organization Section (users only) */}
          {!(role === "SUPERADMIN" || role === "ADMIN") && (
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
      {(role === "SUPERADMIN" || role === "ADMIN") && (
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


// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useForm } from "react-hook-form";
// import { FiEdit } from "react-icons/fi";
// import Swal from "sweetalert2";

// import Loader from "../../components/loader/Loader";
// import { Modal } from "../../components/ui/modal/Modal";
// import Button from "../../components/ui/button/Button";
// import { formatDate } from "../../util/helper/formatDate";

// // Redux slices
// import { fetchUser } from "../../redux/slices/user/userProfileSlice"; // for user
// import {
//   fetchAdmin,
//   updateUser,
// } from "../../redux/slices/admin/userProfileSlice"; // for admin

// // API
// import { resetUserPassword } from "../../api/user/user/user-api"; // user API
// import { resetUserPassword as adminResetPassword } from "../../api/admin/user-api/user-api"; // admin API

// const UserDetails = () => {
//   const dispatch = useDispatch();

//   const { profile: user, loading } = useSelector((state) =>
//     mode === "admin" ? state.user : state.adminProfile
//   );

//   console.log(user);
//   const [editMode, setEditMode] = useState({
//     profile: false,
//     profilePic: false,
//     passwordModal: false,
//   });
//   const [profilePicFile, setProfilePicFile] = useState(null);
//   const [profilePicPreview, setProfilePicPreview] = useState(null);
//   const [updating, setUpdating] = useState(false);
//   const [passwordLoading, setPasswordLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting, isDirty },
//     watch,
//   } = useForm();

//   // ✅ Fetch data
//   useEffect(() => {
//     if (mode === "admin") {
//       dispatch(fetchAdmin());
//     } else {
//       dispatch(fetchUser());
//     }
//   }, [dispatch, mode]);

//   // ✅ Reset form
//   useEffect(() => {
//     if (user) {
//       reset({
//         fullName: user?.fullName || user?.name || "",
//         email: user?.email || "",
//         phone: user?.phone || "",
//         address: user?.address || "",
//         city: user?.city || "",
//         state: user?.state || "",
//         country: user?.country || "",
//       });
//     }
//   }, [user, reset]);

//   // ✅ File Upload
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfilePicFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setProfilePicPreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleProfilePicSubmit = async () => {
//     setUpdating(true);
//     try {
//       if (profilePicFile) {
//         const formData = new FormData();
//         formData.append("profilePic", profilePicFile);
//         // dispatch API here
//       }
//       mode === "admin"
//         ? await dispatch(fetchAdmin())
//         : await dispatch(fetchUser());
//     } finally {
//       cancelEdit("profilePic");
//       setUpdating(false);
//     }
//   };

//   // ✅ Profile update
//   const handleProfileSubmit = async (data) => {
//     if (mode !== "admin") return;
//     setUpdating(true);
//     try {
//       await dispatch(updateUser(data));
//       await dispatch(fetchUser());
//       setEditMode((prev) => ({ ...prev, profile: false }));
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const cancelEdit = (field) => {
//     setEditMode((prev) => ({ ...prev, [field]: false }));
//     setProfilePicFile(null);
//     setProfilePicPreview(null);
//     reset();
//   };

//   // ✅ Password Reset
//   const onPasswordSubmit = async (data) => {
//     const { currentPassword, newPassword } = data;
//     setPasswordLoading(true);
//     try {
//       const apiFn = mode === "admin" ? adminResetPassword : resetUserPassword;
//       const response = await apiFn({ currentPassword, newPassword });

//       cancelEdit("passwordModal");

//       if (response?.success || response?.status === 200) {
//         Swal.fire({
//           title: "Password Updated!",
//           icon: "success",
//           timer: 2000,
//         });
//         reset();
//       }
//     } catch (error) {
//       Swal.fire({
//         title: "Failed!",
//         text: error?.response?.data?.message || "Something went wrong",
//         icon: "error",
//       });
//     } finally {
//       setPasswordLoading(false);
//     }
//   };

//   return (
//     <div className="relative w-full mx-auto p-6">
//       {(loading || updating) && (
//         <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center gap-3">
//           <Loader />
//           <p className="text-[#445E94] text-lg font-semibold animate-pulse">
//             {updating ? "Updating profile..." : "Loading profile..."}
//           </p>
//         </div>
//       )}

//       {/* Profile Card */}
//       <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-[#445E94] to-[#16122F] p-6 text-white">
//           <h2 className="text-2xl font-bold">Profile</h2>
//           <p className="text-blue-100">
//             {user?.email || "Manage your profile"}
//           </p>
//         </div>

//         {/* Body */}
//         <div className="p-6">
//           {/* Profile Picture */}
//           <div className="flex flex-col items-center mb-8">
//             <div className="relative">
//               <img
//                 src={
//                   profilePicPreview ||
//                   user?.profilePic ||
//                   "/images/profile.jpeg"
//                 }
//                 alt="Profile"
//                 className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
//               />
//               <button
//                 onClick={() =>
//                   setEditMode((prev) => ({ ...prev, profilePic: true }))
//                 }
//                 className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
//               >
//                 <i className="fas fa-camera" />
//               </button>
//             </div>
//             <div className="mt-3 text-gray-700 text-md font-bold">
//               {user?.businessName || user?.role || "User"}
//             </div>

//             {editMode.profilePic && (
//               <div className="mt-6 w-full max-w-md bg-gray-50 p-5 rounded-lg shadow-lg">
//                 <h3 className="text-lg font-semibold mb-3">Change Picture</h3>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="w-full p-2 border rounded mb-3"
//                 />
//                 <div className="flex gap-3 justify-end">
//                   <button
//                     onClick={() => cancelEdit("profilePic")}
//                     className="px-4 py-2 text-gray-600 hover:text-gray-900"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleProfilePicSubmit}
//                     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Personal Info */}
//           <div className="bg-gray-50 rounded-xl shadow p-6 mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Personal Information
//               </h3>
//               {mode === "admin" && (
//                 <button
//                   onClick={() =>
//                     setEditMode((prev) => ({ ...prev, profile: true }))
//                   }
//                   className="text-blue-600 hover:text-blue-800"
//                 >
//                   <FiEdit />
//                 </button>
//               )}
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
//               <Info label="Full Name" value={user?.fullName || user?.name} />
//               <Info label="Mobile Number" value={user?.phone} />
//               <Info label="City" value={user?.city} />
//               <Info label="State" value={user?.state} />
//               <Info label="Country" value={user?.country} />
//               <Info label="Address" value={user?.address} />

//               {mode === "user" && (
//                 <>
//                   <Info label="Business Name" value={user?.businessName} />
//                   <Info label="On Board" value={formatDate(user?.createdAt)} />
//                 </>
//               )}
//             </div>

//             {/* Change Password */}
//             <div className="mt-6">
//               <Button
//                 onClick={() =>
//                   setEditMode((prev) => ({ ...prev, passwordModal: true }))
//                 }
//                 label="Change Password"
//               />
//             </div>
//           </div>

//           {user?.role !== "SUPERADMIN" && user?.role !== "ADMIN" && (
//             <div className="bg-gray-50 rounded-xl shadow p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 Organization Details
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
//                 <Info label="Business Name" value={user?.businessName} />
//                 <Info label="Business Type" value={user?.businessType} />
//                 <Info label="GST Number" value={user?.gstNumber} />
//                 <Info
//                   label="Registered On"
//                   value={formatDate(user?.createdAt)}
//                 />
//                 <Info
//                   label="Organization Email"
//                   value={user?.orgEmail || user?.email}
//                 />
//                 <Info
//                   label="Organization Phone"
//                   value={user?.orgPhone || user?.phone}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Admin Edit Modal */}
//       {mode === "admin" && (
//         <Modal
//           isOpen={editMode.profile}
//           onClose={() => cancelEdit("profile")}
//           size="md"
//         >
//           <h2 className="text-center text-gray-800 font-bold mb-4">
//             Edit Profile
//           </h2>
//           <form
//             onSubmit={handleSubmit(handleProfileSubmit)}
//             className="space-y-4"
//           >
//             <Input
//               label="Full Name"
//               {...register("fullName", { required: "Name is required" })}
//               error={errors.fullName?.message}
//             />
//             <Input
//               label="Email"
//               {...register("email", { required: "Email is required" })}
//               error={errors.email?.message}
//             />
//             <Input label="Phone" {...register("phone")} />
//             <Input label="City" {...register("city")} />
//             <Input label="State" {...register("state")} />
//             <Input label="Country" {...register("country")} />
//             <Input label="Address" {...register("address")} />

//             <div className="flex gap-2 justify-end pt-2">
//               <button
//                 type="button"
//                 onClick={() => cancelEdit("profile")}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-900"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting || !isDirty}
//                 className={`px-4 py-2 rounded text-white ${
//                   isDirty
//                     ? "bg-blue-600 hover:bg-blue-700"
//                     : "bg-gray-400 cursor-not-allowed"
//                 }`}
//               >
//                 {isSubmitting ? "Saving..." : "Save Changes"}
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}

//       {/* Password Modal */}
//       <Modal
//         isOpen={editMode.passwordModal}
//         onClose={() => cancelEdit("passwordModal")}
//       >
//         <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
//         <form
//           onSubmit={handleSubmit(onPasswordSubmit)}
//           className="flex flex-col gap-3"
//         >
//           <Input
//             type="password"
//             label="Old Password"
//             {...register("currentPassword", {
//               required: "Old password is required",
//             })}
//             error={errors.currentPassword?.message}
//           />
//           <Input
//             type="password"
//             label="New Password"
//             {...register("newPassword", {
//               required: "New password is required",
//               minLength: { value: 6, message: "Minimum 6 characters" },
//             })}
//             error={errors.newPassword?.message}
//           />
//           <Input
//             type="password"
//             label="Confirm Password"
//             {...register("confirmPassword", {
//               required: "Please confirm your password",
//               validate: (value) =>
//                 value === watch("newPassword") || "Passwords do not match",
//             })}
//             error={errors.confirmPassword?.message}
//           />
//           <div className="flex justify-end mt-4">
//             <Button
//               label="Update Password"
//               type="submit"
//               loading={passwordLoading}
//             />
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// // Small helper components for cleaner code
// const Info = ({ label, value }) => (
//   <div className="flex w-full space-x-2">
//     <span className="text-gray-500">{label}:</span>
//     <div className="font-medium">{value || "N/A"}</div>
//   </div>
// );

// const Input = React.forwardRef(({ label, error, ...props }, ref) => (
//   <div>
//     <input
//       ref={ref}
//       {...props}
//       placeholder={label}
//       className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
//         error
//           ? "border-red-400 focus:ring-red-400"
//           : "border-gray-300 focus:ring-blue-400"
//       }`}
//     />
//     {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//   </div>
// ));

// export default UserDetails;
