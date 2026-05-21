import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Check, CreditCard } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const billingHistory = [
  { date: "Mar 1, 2026", plan: "Standard", amount: 999, status: "Paid" },
  { date: "Feb 1, 2026", plan: "Standard", amount: 999, status: "Paid" },
  { date: "Jan 1, 2026", plan: "Basic", amount: 499, status: "Paid" },
  { date: "Dec 1, 2025", plan: "Basic", amount: 499, status: "Paid" },
];

export function Subscription() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  // Get token from separate localStorage key (not "auth")
  const getToken = () => {
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("token_expires_at");

    if (!token || !expiresAt) {
      return null;
    }

    // Check if token expired
    if (new Date() > new Date(expiresAt)) {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      localStorage.removeItem("token_expires_at");
      return null;
    }

    return token;
  };

  // Get subscription from localStorage
  const getSubscription = () => {
    const data = localStorage.getItem("subscription");
    if (!data) return null;

    try {
      const parsed = JSON.parse(data);

      if (parsed.expiresAt && new Date().getTime() > parsed.expiresAt) {
        localStorage.removeItem("subscription");
        return null;
      }

      return parsed;
    } catch (error) {
      console.error("Failed to parse subscription:", error);
      return null;
    }
  };

  const token = getToken();

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const currentPlan = plans.find((p) => p.id === subscription?.planId);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/public/plans`);
        setPlans(res.data.data);
      } catch (err) {
        console.error("Failed to fetch plans:", err);
        toast.error("Failed to load subscription plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const stored = getSubscription();
    if (stored) {
      setSubscription(stored);
    }
  }, []);

  const handleSubscribe = async (planId) => {
    // Check if token exists
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-order`,
        { planId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: "INR",
        name: "Subscription Payment",
        description: "Plan Purchase",
        order_id: data.order.id,

        handler: async function (response) {
          const loadingToast = toast.loading("Verifying payment...");

          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyRes.data.success) {
              const sub = verifyRes.data.data;

              const expiryTime = new Date();
              expiryTime.setDate(expiryTime.getDate() + 30);

              localStorage.setItem(
                "subscription",
                JSON.stringify({
                  planId: sub.planId,
                  startDate: sub.startDate,
                  expiryDate: sub.expiryDate,
                  status: sub.status,
                  expiresAt: expiryTime.getTime(),
                })
              );

              // Remove subscription popup flag so it shows again if subscription expires
              localStorage.removeItem("subscription_popup_shown");

              toast.update(loadingToast, {
                render: "Subscription activated ✅",
                type: "success",
                isLoading: false,
                autoClose: 3000,
              });

              setTimeout(() => {
                window.location.reload();
              }, 1500);
            } else {
              toast.update(loadingToast, {
                render: "Verification failed ❌",
                type: "error",
                isLoading: false,
                autoClose: 3000,
              });
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            toast.update(loadingToast, {
              render: err.response?.data?.message || "Verification failed ❌",
              type: "error",
              isLoading: false,
              autoClose: 3000,
            });
          }
        },

        theme: {
          color: "#1E88E5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Create order error:", err);
      const errorMessage = err.response?.data?.message || "Failed to create order";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
        <p className="text-gray-500 mt-1">Manage your plan and billing information</p>
      </div>

      {/* Current Plan */}
      <Card className="bg-gradient-to-br from-[#1E88E5] to-[#1976D2] text-white shadow-lg">
        <CardContent className="pt-6">
          {currentPlan ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Current Plan</p>
                <h2 className="text-3xl font-bold mt-1">
                  {currentPlan ? `${currentPlan.name} Plan` : "No Active Plan"}
                </h2>

                <p className="text-sm opacity-90 mt-2">
                  Next billing date:{" "}
                  {subscription ? formatDate(subscription.expiryDate) : "--"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">
                  ₹{currentPlan ? currentPlan.price : 0}
                </p>
                <p className="text-sm opacity-90">
                  {currentPlan ? currentPlan.duration + " days" : ""}
                </p>
                <Badge className="mt-2 bg-white text-[#1E88E5]">
                  {subscription?.status || "Inactive"}
                </Badge>
              </div>
            </div>
          ) : (
            <h2 className="text-3xl font-bold mt-1">No Active Plan</h2>
          )}
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`bg-white shadow-sm transition-all justify-between ${
                plan.popular
                  ? "border-2 border-[#1E88E5] shadow-lg scale-105"
                  : "border border-gray-200 hover:shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="bg-[#1E88E5] text-white text-center py-2 text-sm font-semibold rounded-t-lg">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹{plan.price}</span>
                  <span className="text-gray-500">/{plan.duration} days</span>
                </div>

                <ul className="space-y-3 mt-5">
                  {plan.Features?.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#00C853] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full ${
                    plan.popular
                      ? "bg-[#1E88E5] hover:bg-[#1976D2]"
                      : plan.name === "Standard"
                      ? "bg-gray-400 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={subscription?.planId === plan.id}
                >
                  {subscription?.planId === plan.id
                    ? "Current Plan"
                    : "Upgrade to " + plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <p className="text-sm text-gray-500">Manage your payment information</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-500">Expires 12/2027</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Default
              </Badge>
            </div>
            <Button variant="outline" className="w-full">
              Update Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Billing Information */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <p className="text-sm text-gray-500">Your billing details</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Next billing date</span>
                <span className="font-semibold">
                  {subscription ? formatDate(subscription.expiryDate) : "--"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount</span>
                <span className="font-semibold">
                  ₹{currentPlan ? currentPlan.price : 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Billing cycle</span>
                <span className="font-semibold">
                  {currentPlan ? currentPlan.duration + " days" : "--"}
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <Button variant="outline" className="w-full">
                Update Billing Info
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing History */}
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <p className="text-sm text-gray-500">Your past invoices and payments</p>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map((bill, index) => (
                  <TableRow key={index}>
                    <TableCell>{bill.date}</TableCell>
                    <TableCell>{bill.plan}</TableCell>
                    <TableCell className="font-semibold">₹{bill.amount}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">{bill.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="link" size="sm">
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile List */}
          <div className="md:hidden space-y-3">
            {billingHistory.map((bill, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{bill.date}</span>
                  <Badge className="bg-green-500">{bill.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{bill.plan}</span>
                  <span className="font-semibold">₹{bill.amount}</span>
                </div>
                <Button variant="link" size="sm" className="p-0 h-auto">
                  Download Invoice
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}