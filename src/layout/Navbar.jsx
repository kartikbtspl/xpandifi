import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../redux/slices/userSlice";
import { jwtDecode } from "jwt-decode";
import Input from "../components/ui/input/Input";
import { SearchIcon } from "../icon";
import UserProfile from "../components/user/UserProfile";
import { Link } from "react-router-dom";
import { routeMap } from "../routes/routeMaps";

const languages = [
  { label: "English", code: "en" },
  { label: "हिंदी", code: "hi" },
  { label: "ಕನ್ನಡ", code: "kn" },
];

const Navbar = ({ toggleSidebar }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const profileRef = useRef();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);

  // Decode token to get name
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setName(decoded?.fullName || "");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Fetch profile on mount
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Hide profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle language change
  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    // You can dispatch to redux or save to localStorage here
  };

  // Search filter logic
  const handleSearch = (value) => {
    setQuery(value);

    if (!value.trim()) {
      setResult([]);
      return;
    }

    const filtered = routeMap
      .filter((route) => route.name && route.path)
      .filter((route) =>
        route.name.toLowerCase().includes(value.toLowerCase())
      );

    setResult(filtered);
  };

  return (
    <div className="h-16 bg-white shadow-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* Left section: Sidebar toggle and Search */}
      <div className="flex items-center gap-3 w-full max-w-lg">
        <button className="md:hidden text-xl" onClick={toggleSidebar}>
          ☰
        </button>

        {/* Search Box */}
        <div className="relative">
          <Input
            name="search"
            placeholder="Search..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            autoComplete="off"
            inputProps={{ type: "search" }}
            icon={<SearchIcon />}
            iconPosition="left"
            className="w-full"
          />

          {/* Search Dropdown */}
          {query && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50">
              {result.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto">
                  {result.map((item, index) => (
                    <li
                      key={index}
                      className="hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <Link
                        to={item.path}
                        onClick={() => {
                          setQuery("");
                          setResult([]);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right section: Language & Profile */}
      <div className="flex items-center gap-4">
        {/* Language Selector */}
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

        {/* User Profile */}
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

          {/* Dropdown Profile */}
          {showProfile && <UserProfile profile={profile} />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

