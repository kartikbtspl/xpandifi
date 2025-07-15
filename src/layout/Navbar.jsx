import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../redux/slices/userSlice";
import { jwtDecode } from "jwt-decode";
import Input from "../components/ui/input/Input";
import { SearchIcon } from "../icon";
import UserProfile from "../components/user/UserProfile";

const languages = [
  { label: "English", code: "en" },
  { label: "हिंदी", code: "hi" },
  { label: "ಕನ್ನಡ", code: "kn" },
];

const Navbar = ({ toggleSidebar }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const profileRef = useRef();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const { profile } = useSelector((state) => state.user);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        setName(decoded?.fullName);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    // You can also dispatch to Redux or store in localStorage
  };

  return (
    <div className="h-16 bg-white shadow-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button className="md:hidden text-xl" onClick={toggleSidebar}>
          ☰
        </button>
        <Input
          name="search"
          placeholder="Search..."
          inputProps={{ type: "search" }}
          icon={<SearchIcon />}
          iconPosition="left"
          className="mt-2"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* 🌐 Language Selector */}
        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>

        {/* 👤 User Profile */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setShowProfile((prev) => !prev)}
            className="cursor-pointer flex items-center gap-2"
          >
            <img
              src={profile?.avatar || "https://i.pravatar.cc/40"}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {name || "Loading..."}
            </span>
          </div>
          {showProfile && <UserProfile profile={profile} />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
