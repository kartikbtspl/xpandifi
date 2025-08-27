import { jwtDecode } from "jwt-decode";
import UserDetails from "../../pages/shared/UserDetails";

const Profile = () => {
  let role = null;

  // Decode role from token
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded?.role;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const mode = ["SUPERADMIN", "ADMIN"].includes(role) ? "admin" : "user";

  return <UserDetails mode={mode} />;
};

export default Profile;


// import { useSelector } from "react-redux";
// import UserDetails from "../../pages/shared/UserDetails";

// const Profile = () => {
//   const user = useSelector((state) => state.auth.user);
//   const mode = ["SUPERADMIN", "ADMIN"].includes(user?.role) ? "admin" : "user";

//   return <UserDetails mode={mode} />;
// };


// export default Profile;