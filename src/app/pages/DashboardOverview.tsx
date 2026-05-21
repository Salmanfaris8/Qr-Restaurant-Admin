import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  ShoppingCart,
  Utensils,
  QrCode,
  DollarSign,
  Plus,
  Palette,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const scanData = [
  { day: "Mon", scans: 45 },
  { day: "Tue", scans: 52 },
  { day: "Wed", scans: 61 },
  { day: "Thu", scans: 48 },
  { day: "Fri", scans: 73 },
  { day: "Sat", scans: 89 },
  { day: "Sun", scans: 95 },
];

const popularDishes = [
  { name: "Biryani", orders: 145 },
  { name: "Butter Chicken", orders: 132 },
  { name: "Paneer Tikka", orders: 98 },
  { name: "Dal Makhani", orders: 87 },
  { name: "Naan", orders: 156 },
];

export function DashboardOverview() {
  const [showPopup, setShowPopup] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("subscription");
    const popupShown = localStorage.getItem("subscription_popup_shown");

    let parsed = null;
    try {
      parsed = data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to parse subscription data:", error);
      parsed = null;
    }

    const isExpired = parsed?.expiresAt && Date.now() > parsed.expiresAt;

    // Remove expired subscription
    if (isExpired) {
      localStorage.removeItem("subscription");
    }

    // ACTIVE subscription → NEVER show popup
    if (parsed && !isExpired) {
      setSubscription(parsed);
      setShowPopup(false);
      localStorage.removeItem("subscription_popup_shown");
      return;
    }

    // No subscription OR expired → show popup only once
    if (!popupShown) {
      setShowPopup(true);
      localStorage.setItem("subscription_popup_shown", "true");
    } else {
      setShowPopup(false);
    }
  }, []);

  const requireSubscription = () => {
    if (!subscription) {
      setShowPopup(true);
      return false;
    }

    // Extra safety: expired check
    if (subscription?.expiresAt && Date.now() > subscription.expiresAt) {
      localStorage.removeItem("subscription");
      setSubscription(null);
      setShowPopup(true);
      return false;
    }

    return true;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-sm border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Today's Orders
            </CardTitle>
            <ShoppingCart className="w-5 h-5 text-[#1E88E5]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">48</div>
            <p className="text-xs text-[#00C853] flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Menu Items
            </CardTitle>
            <Utensils className="w-5 h-5 text-[#1E88E5]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">124</div>
            <p className="text-xs text-gray-500 mt-1">Across 8 categories</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              QR Scans Today
            </CardTitle>
            <QrCode className="w-5 h-5 text-[#1E88E5]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">95</div>
            <p className="text-xs text-[#00C853] flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +23% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="w-5 h-5 text-[#1E88E5]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">₹45,230</div>
            <p className="text-xs text-[#00C853] flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +18% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle>QR Scan Activity</CardTitle>
            <p className="text-sm text-gray-500">Weekly scan trends</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scanData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="scans"
                  stroke="#1E88E5"
                  strokeWidth={3}
                  dot={{ fill: "#1E88E5", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle>Popular Dishes</CardTitle>
            <p className="text-sm text-gray-500">Top selling items this week</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularDishes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar
                  dataKey="orders"
                  fill="#00C853"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <p className="text-sm text-gray-500">Common tasks at your fingertips</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => {
                if (!requireSubscription()) return;
                navigate("/categories");
              }}
              className="h-auto py-6 flex-col gap-2 bg-[#1E88E5] hover:bg-[#1976D2]"
            >
              <Plus className="w-6 h-6" />
              <span>Add Menu Item</span>
            </Button>
            <Button
              onClick={() => {
                if (!requireSubscription()) return;
                navigate("/qr-codes");
              }}
              className="h-auto py-6 flex-col gap-2 bg-[#00C853] hover:bg-[#00B248]"
            >
              <QrCode className="w-6 h-6" />
              <span>Generate QR Code</span>
            </Button>
            <Button
              onClick={() => {
                if (!requireSubscription()) return;
                navigate("/themes");
              }}
              className="h-auto py-6 flex-col gap-2 bg-[#FF6F00] hover:bg-[#F57C00]"
            >
              <Palette className="w-6 h-6" />
              <span>Change Theme</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-[92%] max-w-md shadow-2xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#1E88E5] via-[#1976D2] to-[#1565C0] p-7 text-white text-center">
              <h2 className="text-2xl font-bold tracking-tight">
                Upgrade Your Plan
              </h2>
              <p className="text-sm opacity-90 mt-2">
                Unlock powerful restaurant management tools
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-center">
              {/* Highlight box */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  You are currently on{" "}
                  <span className="font-semibold text-[#1E88E5]">Free Access</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Upgrade to continue using premium features without limits
                </p>
              </div>

              {/* Features */}
              <div className="text-left bg-gray-50 p-5 rounded-xl space-y-3 text-sm">
                <p className="font-semibold text-gray-800 mb-2">
                  ✨ What you unlock:
                </p>
                <div className="space-y-2 text-gray-600">
                  <p>🚀 Unlimited menu & category management</p>
                  <p>📊 Advanced analytics & reports</p>
                  <p>📱 Instant QR code generation</p>
                  <p>🎨 Full theme customization</p>
                  <p>⚡ Priority performance & support</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  className="w-full bg-gradient-to-r from-[#1E88E5] to-[#1976D2] hover:opacity-95 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
                  onClick={() => {
                    setShowPopup(false);
                    navigate("/subscription");
                  }}
                >
                  View Plans & Upgrade
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPopup(false)}
                >
                  Continue with limited access
                </Button>
              </div>

              {/* Footer note */}
              <p className="text-[11px] text-gray-400 mt-2">
                Secure payments • Cancel anytime • Instant activation
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}