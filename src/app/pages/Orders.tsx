import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Eye, Clock, CheckCircle2, ChefHat } from "lucide-react";

interface Order {
  id: string;
  tableNumber: number;
  items: string[];
  status: "Preparing" | "Ready" | "Served";
  time: string;
  total: number;
}

const initialOrders: Order[] = [
  {
    id: "ORD-001",
    tableNumber: 5,
    items: ["Chicken Biryani x2", "Butter Chicken x1", "Naan x3"],
    status: "Preparing",
    time: "10 mins ago",
    total: 897,
  },
  {
    id: "ORD-002",
    tableNumber: 3,
    items: ["Paneer Tikka x1", "Dal Makhani x1", "Roti x4"],
    status: "Ready",
    time: "5 mins ago",
    total: 456,
  },
  {
    id: "ORD-003",
    tableNumber: 8,
    items: ["Veg Biryani x1", "Raita x1", "Mango Lassi x2"],
    status: "Served",
    time: "25 mins ago",
    total: 467,
  },
  {
    id: "ORD-004",
    tableNumber: 12,
    items: ["Tandoori Chicken x1", "Garlic Naan x2", "Salad x1"],
    status: "Preparing",
    time: "3 mins ago",
    total: 589,
  },
  {
    id: "ORD-005",
    tableNumber: 7,
    items: ["Masala Dosa x2", "Filter Coffee x2"],
    status: "Ready",
    time: "8 mins ago",
    total: 298,
  },
];

const statusConfig = {
  Preparing: { color: "bg-orange-500", icon: ChefHat, text: "text-orange-500" },
  Ready: { color: "bg-blue-500", icon: Clock, text: "text-blue-500" },
  Served: { color: "bg-green-500", icon: CheckCircle2, text: "text-green-500" },
};

export function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filterStatus);

  const orderCounts = {
    preparing: orders.filter(o => o.status === "Preparing").length,
    ready: orders.filter(o => o.status === "Ready").length,
    served: orders.filter(o => o.status === "Served").length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-500 mt-1">Track and manage customer orders in real-time</p>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Preparing</p>
                <p className="text-3xl font-bold text-orange-500">{orderCounts.preparing}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ready</p>
                <p className="text-3xl font-bold text-blue-500">{orderCounts.ready}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Served</p>
                <p className="text-3xl font-bold text-green-500">{orderCounts.served}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="served">Served</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Items Ordered</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status].icon;
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Table {order.tableNumber}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-sm text-gray-600">
                              {item}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusConfig[order.status].color} flex items-center gap-1 w-fit`}>
                          <StatusIcon className="w-3 h-3" />
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{order.time}</TableCell>
                      <TableCell className="font-semibold">₹{order.total}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {order.status === "Preparing" && (
                            <Button
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600"
                              onClick={() => updateOrderStatus(order.id, "Ready")}
                            >
                              Mark Ready
                            </Button>
                          )}
                          {order.status === "Ready" && (
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => updateOrderStatus(order.id, "Served")}
                            >
                              Mark Served
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;
              return (
                <Card key={order.id} className="border-gray-200">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{order.id}</span>
                      <Badge variant="outline">Table {order.tableNumber}</Badge>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Items:</p>
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-700">{item}</p>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={`${statusConfig[order.status].color} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {order.status}
                      </Badge>
                      <span className="text-sm text-gray-500">{order.time}</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="font-semibold text-lg">₹{order.total}</span>
                      <div className="flex gap-2">
                        {order.status === "Preparing" && (
                          <Button
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600"
                            onClick={() => updateOrderStatus(order.id, "Ready")}
                          >
                            Ready
                          </Button>
                        )}
                        {order.status === "Ready" && (
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => updateOrderStatus(order.id, "Served")}
                          >
                            Served
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}