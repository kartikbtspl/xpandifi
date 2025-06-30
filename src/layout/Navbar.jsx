import Input from "../components/ui/input/Input";
import { SearchIcon } from "../icon";

const Navbar = ({ toggleSidebar }) => {
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
        <span className="text-sm text-gray-500 hidden sm:block">English</span>
        <div className="text-2xl text-gray-600" />
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          John Smith
        </span>
      </div>
    </div>
  );
};

export default Navbar;
