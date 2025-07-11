import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../redux/slices/userSlice";
import { jwtDecode } from "jwt-decode";
import Input from "../components/ui/input/Input";
import { SearchIcon } from "../icon";
import UserProfile from "../components/user/UserProfile";
import Modal from "../components/modal/Modal";
import { Navigate } from "react-router-dom";
import { routeMap } from "../routes/routeMaps";
import { Link } from "react-router-dom";

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

  // const [query, setQuery] = useState();
  const [result, setResult] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  
 const handleSearch = (value) => {
  if (!value) {
    setResult([]);
    return;
  }


  const searchResult = routeMap
    .filter((route) => route.name) // Ensure the route has a name
    .filter((route) => route.path) // Ensure the route has a path
    .filter((route) => route.name.toLowerCase().includes(value.toLowerCase()))

  setResult(searchResult);
  console.log("Search Result:", searchResult);
  console.log("Search Value:", value);
};



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
        {/* <Input
          name="search"
          placeholder="Search..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          
          autoComplete="off"
          inputProps={{ type: "search" }}
          icon={<SearchIcon />}
          iconPosition="left"
          className="mt-2"
        /> */}
        <div
        onClick={() => setIsOpen(true)}
         className="border border-gray-300 rounded-lg flex items-center px-3 py-1 w-full space-x-3 justify-between">
          <SearchIcon className="text-gray-500" />
          <p>Search..</p>
        </div>
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




      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Search Tabs">

        <div >
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="mt-4">
          <ul className="border-none space-y-2">
            {result.length > 0 ? (
            result.map((item, index) => (
              <li className="shadow rounded  hover:bg-gray-200">
                <Link
                key={index}
                to={item.path}
                onClick={() => {
                  setIsOpen(false), 
                  setResult([])
                }}
                className="block p-2 hover:bg-gray-100 cursor-pointer text-black"
              >
                {item.name}
              </Link>
              </li>
            ))
          ) : (
            <div className="p-2 text-gray-500">No results found</div>
          )}
          </ul>

          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Navbar;
