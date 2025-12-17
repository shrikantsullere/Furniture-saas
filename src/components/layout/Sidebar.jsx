import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdInventory,
  MdDescription,
  MdLocalShipping,
  MdExtension,
  MdSettings,
  MdShoppingCart,
  MdStore,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { useState, useEffect } from "react";

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    orders: false,
    integrations: false,
  });

  const isActive = (path) => location.pathname === path;

  // Auto-expand menus when on their sub-routes
  useEffect(() => {
    if (location.pathname.startsWith('/orders')) {
      setExpandedMenus((prev) => ({ ...prev, orders: true }));
    }
    if (location.pathname.startsWith('/integrations')) {
      setExpandedMenus((prev) => ({ ...prev, integrations: true }));
    }
  }, [location.pathname]);

  const toggleMenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const menuItems = [
    { path: "/", label: "Dashboard", icon: MdDashboard },
    {
      label: "Orders",
      icon: MdInventory,
      submenu: [
        { path: "/orders", label: "All Orders" },
        { path: "/orders/pending", label: "Pending Sheets" },
      ],
    },
    { path: "/production", label: "Delivery Note", icon: MdDescription },
    { path: "/labels", label: "Label Generator", icon: MdLocalShipping },
    {
      label: "Integrations",
      icon: MdExtension,
      submenu: [
        { path: "/integrations/amazon", label: "Amazon" },
        { path: "/integrations/ebay", label: "eBay" },
        { path: "/integrations/shopify", label: "Shopify" },
      ],
    },
    { path: "/settings", label: "Settings", icon: MdSettings },
  ];

  const renderMenuItem = (item, index, level = 0) => {
    const IconComponent = item.icon;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const menuKey = item.label.toLowerCase().replace(/\s+/g, '');

    if (hasSubmenu) {
      const isExpanded = expandedMenus[menuKey];
      return (
        <li key={index}>
          <button
            onClick={() => toggleMenu(menuKey)}
            className={`w-full flex items-center justify-between px-4 py-3 min-h-[44px] rounded-lg transition-all duration-200 ${
              item.submenu.some((sub) => isActive(sub.path))
                ? "bg-primary/10 text-primary font-medium"
                : "text-gray-700 hover:bg-gray-50"
            } ${!isOpen && !isMobile ? "justify-center px-2" : ""}`}
            title={!isOpen && !isMobile ? item.label : ""}
          >
            <div className={`flex items-center ${isOpen || isMobile ? "gap-3" : ""}`}>
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              {(isOpen || isMobile) && <span>{item.label}</span>}
            </div>
            {(isOpen || isMobile) && (
              <MdKeyboardArrowDown
                className={`w-4 h-4 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            )}
          </button>
          {(isOpen || isMobile) && isExpanded && (
            <ul className="mt-1 space-y-1">
              {item.submenu.map((subItem, subIndex) => (
                <li key={subIndex}>
                  <Link
                    to={subItem.path}
                    onClick={isMobile ? onClose : undefined}
                    className={`block px-4 py-2 min-h-[44px] flex items-center rounded-lg transition-colors ${
                      isActive(subItem.path)
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    } ${!isOpen && !isMobile ? "pl-2" : ""}`}
                  >
                    {subItem.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={index}>
        <Link
          to={item.path}
          onClick={isMobile ? onClose : undefined}
          className={`flex items-center rounded-lg transition-all duration-200 min-h-[44px] ${
            isActive(item.path)
              ? "bg-primary/10 text-primary font-medium"
              : "text-gray-700 hover:bg-gray-50"
          } ${isOpen || isMobile ? "px-4 py-3 gap-3" : "px-2 py-3 justify-center"}`}
          title={!isOpen && !isMobile ? item.label : ""}
        >
          <IconComponent className="w-5 h-5 flex-shrink-0" />
          {(isOpen || isMobile) && <span>{item.label}</span>}
        </Link>
      </li>
    );
  };

  if (isMobile) {
    // Mobile: Overlay sidebar (always shows icons + text)
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } w-64`}
        >
          <div className="h-full flex flex-col">
            {/* Menu */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {menuItems.map((item, index) => renderMenuItem(item, index))}
              </ul>
            </nav>
          </div>
        </aside>
      </>
    );
  }

  // Desktop: Collapsible sidebar (icons always visible)
  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-20 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => renderMenuItem(item, index))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;