import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Users, Folder, Calendar, BarChart, Settings, ShieldCheck } from "lucide-react";
import { getAuthUser } from "@/Common/authSession";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const authUser = getAuthUser();
  const dashboardLink = authUser?.userId ? `/admin/${authUser.userId}/dashboard` : "/admin/user-management";

  const menuItems = [
    { name: "Dashboard", icon: <Home className="w-6 h-6" />, link: dashboardLink, match: (path) => path.startsWith("/admin/") && path.endsWith("/dashboard") },
    { name: "Users", icon: <Users className="w-6 h-6" />, link: "/admin/user-management", match: (path) => path.startsWith("/admin/user-management") },
    { name: "Questions", icon: <Folder className="w-6 h-6" />, link: "/admin/question-dash", match: (path) => path.startsWith("/admin/question") || path.startsWith("/admin/view-questions") },
    { name: "Calendar", icon: <Calendar className="w-6 h-6" />, link: "/admin/calendar", match: (path) => path.startsWith("/admin/calendar") },
    { name: "Reports", icon: <BarChart className="w-6 h-6" />, link: "/admin/report-dash", match: (path) => path.startsWith("/admin/report") },
    { name: "Auth Logs", icon: <ShieldCheck className="w-6 h-6" />, link: "/admin/auth-logs", match: (path) => path.startsWith("/admin/auth-logs") },
    { name: "Settings", icon: <Settings className="w-6 h-6" />, link: "/admin/settings", match: (path) => path.startsWith("/admin/settings") },
  ];

  return (
    <aside className={`h-screen bg-white border-r border-gray-200 fixed left-0 top-0 ${isOpen ? "w-56" : "w-20"} transition-all duration-300 z-50`}>
      {/* Toggle Button */}
      <div className="p-4 flex justify-end">
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900" title={isOpen ? "Collapse sidebar" : "Expand sidebar"}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col items-center mt-4 space-y-2 px-2">
        {menuItems.map((item, index) => {
          const isActive = item.match ? item.match(location.pathname) : location.pathname === item.link;
          return (
            <Link
              key={index}
              to={item.link}
              title={item.name}
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-green-600 text-white font-semibold shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <div className="flex-shrink-0 flex items-center justify-center">
                {item.icon}
              </div>
              {isOpen && <span className="ml-3 truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="mt-auto p-4">
        <button className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 hover:ring-2 hover:ring-green-500">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
