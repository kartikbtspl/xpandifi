import { Link, useNavigate } from "react-router-dom";

const UserProfile = ({ profile }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove auth token
    navigate("/signin"); // Redirect to signin
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-40">
      <div className="px-4 py-3 border-b">
        <p className="text-sm font-semibold text-gray-800">
          {profile?.fullName || "John Smith"}
        </p>
        <p className="text-xs text-gray-500">{profile?.email || "john@example.com"}</p>
      </div>
      <ul className="py-1 text-sm text-gray-700">
        <Link to="/profile">
          <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer">Profile</li>
        </Link>
        <li
          onClick={handleLogout}
          className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
        >
          Logout
        </li>
      </ul>
    </div>
  );
};

export default UserProfile;
