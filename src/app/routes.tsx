import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";

import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardOverview } from "./pages/DashboardOverview";
import { MenuCategories } from "./pages/MenuCategories";
import { MenuItems } from "./pages/MenuItems";
import { ThemeSelection } from "./pages/ThemeSelection";
import { QRCodes } from "./pages/QRCodes";
import { Orders } from "./pages/Orders";
import { Customers } from "./pages/Customers";
import { Analytics } from "./pages/Analytics";
import { Subscription } from "./pages/Subscription";
import { Settings } from "./pages/Settings";
import { LanguageSettings } from "./pages/LanguageSettings";
import { Notifications } from "./pages/Notifications";
import { Help } from "./pages/Help";
import Page from "./pages/page"; // Login page

export const router = createBrowserRouter([
  // 🌐 Public Route (Login)
  {
    path: "/",
    Component: Page,
  },

  // 🔒 Protected Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        Component: DashboardLayout,
        children: [
          { path: "dashboard", Component: DashboardOverview },
          { path: "categories", Component: MenuCategories },
          { path: "menu-items", Component: MenuItems },
          { path: "themes", Component: ThemeSelection },
          { path: "qr-codes", Component: QRCodes },
          { path: "orders", Component: Orders },
          { path: "customers", Component: Customers },
          { path: "analytics", Component: Analytics },
          { path: "subscription", Component: Subscription },
          { path: "restaurant", Component: Settings },
          { path: "language", Component: LanguageSettings },
          { path: "notifications", Component: Notifications },
          { path: "help", Component: Help },
        ],
      },
    ],
  },
]);