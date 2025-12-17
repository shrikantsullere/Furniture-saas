import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";
import { HiMenu } from "react-icons/hi";
import { MdKeyboardArrowDown, MdSettings, MdSearch, MdClose } from "react-icons/md";

const Navbar = ({ onToggleSidebar, sidebarOpen, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { globalSearchQuery, setSearchQuery } = useSearch();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState(globalSearchQuery || '');

  // Sync local search with global search
  useEffect(() => {
    setLocalSearchValue(globalSearchQuery || '');
  }, [globalSearchQuery]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchValue(value);
    setSearchQuery(value);
    
    // Navigate to orders page if not already there
    if (value && !location.pathname.startsWith('/orders')) {
      navigate('/orders');
    }
  };

  const handleSearchClear = () => {
    setLocalSearchValue('');
    setSearchQuery('');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-primary border-b border-primary-dark z-30 flex items-center px-4 sm:px-6">
      <div className="flex items-center justify-between w-full">
        {/* Left Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:text-white/80 hover:bg-primary-dark rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <HiMenu className="w-6 h-6" />
          </button>

          {/* Project Name */}
          <h1 className="text-base sm:text-xl font-semibold text-white truncate">
            Bed & Mattress Orders
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
          {/* Global Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="h-5 w-5 text-white/80" />
              </div>
              <input
                type="text"
                value={localSearchValue}
                onChange={handleSearchChange}
                placeholder="Search orders..."
                className="block w-full pl-10 pr-10 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
              />
              {localSearchValue && (
                <button
                  type="button"
                  onClick={handleSearchClear}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/80 hover:text-white min-w-[44px] min-h-[44px]"
                  aria-label="Clear search"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search Icon */}
          <button
            onClick={() => navigate('/orders')}
            className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:text-white/80 hover:bg-primary-dark rounded-lg transition-colors"
            aria-label="Search orders"
            title="Search orders"
          >
            <MdSearch className="w-5 h-5" />
          </button>

          {/* User Info */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2 sm:px-3 py-2 min-h-[44px] text-white hover:bg-primary-dark rounded-lg transition-colors"
              >
                <div className="text-right hidden md:block">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-white/80">{user.role}</div>
                </div>
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <MdKeyboardArrowDown className="w-4 h-4 hidden sm:block" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="p-3 border-b border-gray-200">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                      <div className="text-xs text-primary mt-1">{user.role}</div>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => {
                          navigate("/settings");
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                      >
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Settings Button (fallback if no user) */}
          {!user && (
            <button
              onClick={() => navigate("/settings")}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:text-white/80 hover:bg-primary-dark rounded-lg transition-colors"
              title="Settings"
            >
              <MdSettings className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
