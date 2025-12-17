import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive sidebar state
  useEffect(() => {
    const handleResize = () => {
      // Mobile: < 768px, Tablet: 768px-1023px, Desktop: >= 1024px
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else if (window.innerWidth >= 1024) {
        // Auto-open sidebar on desktop
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Navbar */}
      <Navbar
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
      />

      {/* Layout Body: Sidebar + Main Content */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isMobile={isMobile}
        />

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 overflow-y-auto bg-gray-50 ${
            isMobile ? "ml-0" : sidebarOpen ? "ml-64" : "ml-16"
          }`}
        >
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
