import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const dailyScans = [
  { date: "Mar 10", scans: 65 },
  { date: "Mar 11", scans: 78 },
  { date: "Mar 12", scans: 82 },
  { date: "Mar 13", scans: 71 },
  { date: "Mar 14", scans: 95 },
  { date: "Mar 15", scans: 103 },
  { date: "Mar 16", scans: 89 },
];

const popularDishes = [
  { name: "Biryani", orders: 245 },
  { name: "Butter Chicken", orders: 198 },
  { name: "Paneer Tikka", orders: 167 },
  { name: "Naan", orders: 312 },
  { name: "Dal Makhani", orders: 143 },
];

const peakHours = [
  { hour: "12 PM", orders: 45 },
  { hour: "1 PM", orders: 67 },
  { hour: "2 PM", orders: 52 },
  { hour: "7 PM", orders: 78 },
  { hour: "8 PM", orders: 89 },
  { hour: "9 PM", orders: 71 },
  { hour: "10 PM", orders: 43 },
];

const categoryData = [
  { name: "Main Course", value: 340 },
  { name: "Starters", value: 220 },
  { name: "Biryani", value: 280 },
  { name: "Drinks", value: 190 },
  { name: "Desserts", value: 150 },
];

const COLORS = ["#1E88E5", "#00C853", "#FF6F00", "#9C27B0", "#F44336"];

export function Analytics() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">Detailed insights into your restaurant performance</p>
      </div>

      {/* Daily QR Scans */}
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>Daily QR Scans</CardTitle>
          <p className="text-sm text-gray-500">Track customer engagement over the week</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyScans}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="scans"
                stroke="#1E88E5"
                strokeWidth={3}
                dot={{ fill: "#1E88E5", r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Popular Dishes */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle>Most Popular Dishes</CardTitle>
            <p className="text-sm text-gray-500">Top selling items this month</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularDishes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="orders" fill="#00C853" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle>Orders by Category</CardTitle>
            <p className="text-sm text-gray-500">Distribution across menu categories</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Peak Hours */}
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>Peak Hours Analysis</CardTitle>
          <p className="text-sm text-gray-500">Busiest times of the day</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={peakHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="orders" fill="#FF6F00" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">Total Orders</p>
            <p className="text-3xl font-bold">1,247</p>
            <p className="text-xs opacity-75 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">Revenue</p>
            <p className="text-3xl font-bold">₹1.2L</p>
            <p className="text-xs opacity-75 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">Avg. Order Value</p>
            <p className="text-3xl font-bold">₹523</p>
            <p className="text-xs opacity-75 mt-1">Per order</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">Customer Rating</p>
            <p className="text-3xl font-bold">4.7★</p>
            <p className="text-xs opacity-75 mt-1">Based on 245 reviews</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
