import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Users, TrendingUp, Star } from "lucide-react";

const customerData = [
  { name: "Rajesh Kumar", visits: 24, lastVisit: "Today", totalSpent: 12450, favorite: "Chicken Biryani" },
  { name: "Priya Sharma", visits: 18, lastVisit: "Yesterday", totalSpent: 9870, favorite: "Paneer Tikka" },
  { name: "Mohammed Ali", visits: 32, lastVisit: "2 days ago", totalSpent: 15600, favorite: "Mutton Biryani" },
  { name: "Anita Desai", visits: 15, lastVisit: "Today", totalSpent: 7890, favorite: "Dal Makhani" },
  { name: "Vikram Singh", visits: 41, lastVisit: "Yesterday", totalSpent: 21340, favorite: "Butter Chicken" },
];

export function Customers() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customer Analytics</h1>
        <p className="text-gray-500 mt-1">Insights about your loyal customers</p>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900">1,247</p>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +15% this month
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#1E88E5]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Regular Customers</p>
                <p className="text-3xl font-bold text-gray-900">456</p>
                <p className="text-xs text-gray-500 mt-1">5+ visits</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Spend/Visit</p>
                <p className="text-3xl font-bold text-gray-900">₹523</p>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +8% this month
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers Table */}
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
          <p className="text-sm text-gray-500">Your most loyal patrons</p>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Total Visits</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Favorite Dish</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerData.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{customer.visits} visits</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{customer.lastVisit}</TableCell>
                    <TableCell className="font-semibold">₹{customer.totalSpent.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-gray-600">{customer.favorite}</TableCell>
                    <TableCell>
                      {customer.visits > 20 ? (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600">
                          <Star className="w-3 h-3 mr-1" />
                          VIP
                        </Badge>
                      ) : (
                        <Badge className="bg-green-500">Regular</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {customerData.map((customer, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{customer.name}</h3>
                      <p className="text-sm text-gray-500">{customer.lastVisit}</p>
                    </div>
                    {customer.visits > 20 ? (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600">
                        <Star className="w-3 h-3 mr-1" />
                        VIP
                      </Badge>
                    ) : (
                      <Badge className="bg-green-500">Regular</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Visits</p>
                      <p className="font-semibold">{customer.visits}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Spent</p>
                      <p className="font-semibold">₹{customer.totalSpent.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Favorite:</p>
                    <p className="text-sm font-medium">{customer.favorite}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}