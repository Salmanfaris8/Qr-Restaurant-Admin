import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  Utensils,
  Palette,
  QrCode,
  ShoppingCart,
  Users,
  BarChart3,
  CreditCard,
  Settings,
  HelpCircle,
  Bell,
  Search,
  Languages,
  Menu,
  X,
  Building2,
  LogOut
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/restaurant", label: "Restaurant", icon: Building2 },
  { path: "/categories", label: "Menu Categories", icon: FolderOpen },
  { path: "/menu-items", label: "Menu Items", icon: Utensils },
  { path: "/themes", label: "Theme Selection", icon: Palette },
  { path: "/qr-codes", label: "QR Codes", icon: QrCode },
  { path: "/subscription", label: "Subscription", icon: CreditCard },
  { path: "/customers", label: "Customers", icon: Users },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/help", label: "Help & Support", icon: HelpCircle },
  { path: "/language", label: "Language", icon: Languages },
];

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Get admin data from localStorage
  const getAdminData = () => {
    try {
      const adminJson = localStorage.getItem("admin");
      if (!adminJson) return null;
      return JSON.parse(adminJson);
    } catch {
      return null;
    }
  };

  const admin = getAdminData();

  const handleLogout = () => {
    // Clear all auth-related localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("token_expires_at");
    navigate("/", { replace: true });
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 lg:transform-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-[#1E88E5]">QR HOTELS</h1>
            <p className="text-xs text-gray-500 mt-1">Restaurant Management</p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-[#1E88E5] text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search - Hidden on small mobile */}
            <div className="hidden sm:flex items-center gap-4 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              <NavLink to="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
              </NavLink>

              <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 rounded-full bg-[#1E88E5] flex items-center justify-center text-white font-semibold">
                  {admin?.name?.charAt(0)?.toUpperCase() || admin?.email?.charAt(0)?.toUpperCase() || "A"}
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {admin?.name || "Restaurant Admin"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {admin?.email || "admin@qrhotels.com"}
                  </p>
                </div>
              </div>

              {/* Mobile - Just avatar */}
              <div className="md:hidden w-10 h-10 rounded-full bg-[#1E88E5] flex items-center justify-center text-white font-semibold">
                {admin?.name?.charAt(0)?.toUpperCase() || admin?.email?.charAt(0)?.toUpperCase() || "A"}
              </div>
            </div>
          </div>

          {/* Mobile Search - Below header */}
          <div className="sm:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}