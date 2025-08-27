import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "../../redux/slices/user/authSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchUser } from "../../redux/slices/user/userSlice";
import { fetchCampaigns } from "../../redux/slices/user/campaignSlice";
import ForgotPass from "./ForgotPass";
import Button from "../../components/ui/button/Button";

const Spinner = ({ size = "sm", className = "" }) => (
  <svg
    className={`animate-spin ${
      size === "sm" ? "w-4 h-4" : "w-6 h-6"
    } text-white ${className}`}
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

const SignIn = () => {
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [loading, setLoading] = useState({ login: false, forgot: false });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm();

  const { reset: resetForgotForm } = useForm();

  const onSubmit = async (data) => {
    setLoading((prev) => ({ ...prev, login: true }));
    try {
      const response = await dispatch(loginUser(data));
      if (response.type === "auth/loginUser/fulfilled") {
        const token = response?.payload?.token;
        if (token) {
          localStorage.setItem("token", token);
          dispatch(fetchCampaigns());
          dispatch(fetchUser());
          navigate("/");
        }
      } else {
        console.error("Login failed:", response?.payload);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, login: false }));
    }
  };

  return (
    <>
      {/* Main Page Layout */}
      <div className="min-h-screen flex flex-col lg:flex-row">
        <div className="w-full p-2 lg:w-1/2 bg-[url('/images/auth/login-img.png')] bg-cover bg-center h-60 sm:h-72 md:h-96 lg:h-auto" />
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-16 lg:p-20 xl:p-24 bg-white">
          <Link to="/adminLogin" className="absolute right-2 top-2">
            <Button
              isIcon={false}
              label="Admin Login"
              type="button"
              className="hover:scale-x-90 hover:underline"
            />
          </Link>

          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src="/images/logo/xpandifi-logo.svg"
                alt="Xpandifi Logo"
                className="h-10"
              />
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-2">
              Welcome
            </h2>
            <p className="text-sm text-center text-[#697586] mb-6">
              Your ads have been waiting for you
            </p>

            {/* Login Form */}
            <form
              onSubmit={handleLoginSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  {...loginRegister("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                />
                {loginErrors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {loginErrors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  {...loginRegister("password", {
                    required: "Password is required",
                    minLength: {
                      value: 3,
                      message: "Password must be at least 3 characters",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                />
                {loginErrors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {loginErrors.password.message}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoginSubmitting || loading.login}
                className={`w-full py-2 flex justify-center items-center gap-2 text-white rounded-full transition ${
                  isLoginSubmitting || loading.login
                    ? "bg-[#5F7C95] cursor-not-allowed"
                    : "bg-[#5F7C95] hover:bg-[#445E94]"
                }`}
              >
                {isLoginSubmitting || loading.login ? <Spinner /> : null}
                {isLoginSubmitting || loading.login ? "Logging in..." : "Login"}
              </button>

              {/* Forgot Password */}
              <div className="text-right">
                <span
                  className="text-sm text-blue-600 hover:underline cursor-pointer"
                  onClick={() => setIsForgotOpen(true)}
                >
                  Forgot password?
                </span>
              </div>
            </form>

            {/* Footer */}
            <p className="text-sm text-gray-500 mt-8">
              Don't have an Ads monetization account?{" "}
              <Link to="/contact-us" className="text-blue-600 hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ForgotPass
        isForgotOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
    </>
  );
};

export default SignIn;

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

// // User
// // import { loginUser as loginUserAction } from "../../../redux/slices/User/authSlice";
// // import { fetchUserProfile } from "../../redux/slices/User/userSlice";
// // import { fetchCampaigns as fetchUserCampaigns } from "../../redux/slices/User/campaignSlice";

// // Admin
// // import { fetchUserProfile as fetchAdminProfile } from "../../redux/slices/Admin/userProfileSlice";
// // import { fetchCampaigns as fetchAdminCampaigns } from "../../redux/slices/Admin/campaignSlice";
// import { loginUser } from "../../redux/slices/Admin/authSlice";

// import ForgotPass from "./ForgotPass";

// const Spinner = ({ size = "sm", className = "" }) => (
//   <svg
//     className={`animate-spin ${
//       size === "sm" ? "w-4 h-4" : "w-6 h-6"
//     } text-white ${className}`}
//     fill="none"
//     viewBox="0 0 24 24"
//   >
//     <circle
//       className="opacity-25"
//       cx="12"
//       cy="12"
//       r="10"
//       stroke="currentColor"
//       strokeWidth="4"
//     />
//     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//   </svg>
// );

// const SignIn = () => {
//   const [isForgotOpen, setIsForgotOpen] = useState(false);
//   const [loading, setLoading] = useState({ login: false });

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const {
//     register: loginRegister,
//     handleSubmit: handleLoginSubmit,
//     formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
//   } = useForm();

//   const onSubmit = async (data) => {
//     setLoading((prev) => ({ ...prev, login: true }));
//     try {
//       // const isAdmin = data.email.includes("orgadmin@example.com");
//       // const loginAction = isAdmin ? loginAdminAction : loginUserAction;
//       const response = await dispatch(loginUser(data));

//       if (response.type.endsWith("/fulfilled")) {
//         const token = response?.payload?.token;
//         if (token) {
//           localStorage.setItem("token", token);

//           // if (isAdmin) {
//           //   dispatch(fetchAdminProfile());
//           //   dispatch(fetchAdminCampaigns());
//           //   navigate("/admin");
//           // } else {
//             // dispatch(fetchUserProfile());
//             // dispatch(fetchUserCampaigns());
//             navigate("/");
//           // }

//           Swal.fire({
//             icon: "success",
//             title: "Login Successful",
//             position: "top-end",
//             toast: true,
//             timer: 3000,
//             showConfirmButton: false,
//             background: "#445E94",
//             color: "#fff",
//             iconColor: "#fff",
//           });
//         }
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Login Failed",
//           text: response?.payload?.message || "Invalid credentials",
//           position: "top-end",
//           toast: true,
//           timer: 3000,
//           showConfirmButton: false,
//           background: "#CA3E3E",
//           color: "#fff",
//           iconColor: "#fff",
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error?.message || "Something went wrong",
//         position: "top-end",
//         toast: true,
//         timer: 3000,
//         showConfirmButton: false,
//         background: "#CA3E3E",
//         color: "#fff",
//         iconColor: "#fff",
//       });
//     } finally {
//       setLoading((prev) => ({ ...prev, login: false }));
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen flex">
//         {/* Left Section */}
//         <div className="w-1/2 hidden lg:flex flex-col justify-center items-center bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-10">
//           <img
//             src="/images/Logo.svg"
//             alt="Xpandifi Logo"
//             className="h-10 mb-4"
//           />
//           <h1 className="text-2xl font-bold mb-2 text-center">
//             One Platform to Streamline <br /> All Product Analytics
//           </h1>
//           <p className="text-sm text-center opacity-75">
//             Your Revenue are set to grow by 20% next month.
//             <br />
//             Your Revenue is increased by next month.
//           </p>
//         </div>

//         {/* Right Section */}
//         <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6">
//           <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 relative">
//             {/* Mascot Image */}
//             <img
//               src="/images/auth/head.svg"
//               alt="Mascot"
//               className="absolute -top-28 left-1/2 transform -translate-x-1/2 w-50 h-35 object-contain"
//             />

//             <h2 className="text-2xl font-semibold text-center mt-12">
//               Welcome
//             </h2>
//             <p className="text-sm text-center text-gray-600 mb-6">
//               Let’s manage together
//             </p>

//             {/* Login Form */}
//             <form
//               onSubmit={handleLoginSubmit(onSubmit)}
//               className="space-y-4"
//               noValidate
//             >
//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   placeholder="Enter your email address"
//                   {...loginRegister("email", {
//                     required: "Email is required",
//                     pattern: {
//                       value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                       message: "Enter a valid email",
//                     },
//                   })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 {loginErrors.email && (
//                   <p className="text-sm text-red-500 mt-1">
//                     {loginErrors.email.message}
//                   </p>
//                 )}
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   placeholder="Enter Password"
//                   {...loginRegister("password", {
//                     required: "Password is required",
//                     minLength: {
//                       value: 3,
//                       message: "Password must be at least 3 characters",
//                     },
//                   })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 {loginErrors.password && (
//                   <p className="text-sm text-red-500 mt-1">
//                     {loginErrors.password.message}
//                   </p>
//                 )}
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isLoginSubmitting || loading.login}
//                 className={`w-full py-2 flex justify-center items-center gap-2 text-white rounded-full transition ${
//                   isLoginSubmitting || loading.login
//                     ? "bg-[#5F7C95] cursor-not-allowed"
//                     : "bg-[#5F7C95] hover:bg-[#445E94]"
//                 }`}
//               >
//                 {(isLoginSubmitting || loading.login) && <Spinner />}
//                 <span>
//                   {isLoginSubmitting || loading.login ? "Signing in..." : "Login"}
//                 </span>
//               </button>

//               {/* Forgot Password */}
//               <div className="text-right mt-2">
//                 <span
//                   className="text-sm text-blue-600 hover:underline cursor-pointer"
//                   onClick={() => setIsForgotOpen(true)}
//                 >
//                   Forgot password?
//                 </span>
//               </div>
//             </form>

//             {/* Tail Image */}
//             <img
//               src="/images/auth/tail.svg"
//               alt="Mascot"
//               className="absolute top-100 left-1/2 transform -translate-x-1/2 w-24 h-24 object-contain"
//             />
//           </div>
//         </div>
//       </div>

//       <ForgotPass
//         isForgotOpen={isForgotOpen}
//         onClose={() => setIsForgotOpen(false)}
//       />
//     </>
//   );
// };

// export default SignIn;
