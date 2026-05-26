import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Download, Printer, QrCode, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import axios from "axios";
import { toast } from "react-toastify";

const tableNumbers = Array.from({ length: 12 }, (_, i) => i + 1);

export function QRCodes() {
  const [showPopup, setShowPopup] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [qrList, setQrList] = useState([]);
  const [restaurantQR, setRestaurantQR] = useState(null);

  const API = import.meta.env.VITE_API_URL;

  const token = localStorage.getItem("token");

  useEffect(() => {
    const data = localStorage.getItem("subscription");
    const popupShown = localStorage.getItem("subscription_popup_shown");

    const parsed = data ? JSON.parse(data) : null;
    const isExpired = parsed?.expiresAt && Date.now() > parsed.expiresAt;

    // ✅ valid subscription
    if (parsed && !isExpired) {
      setSubscription(parsed);
      setShowPopup(false);
      localStorage.removeItem("subscription_popup_shown");
      return;
    }

    // ❌ no subscription or expired
    if (!popupShown) {
      setShowPopup(true);
      localStorage.setItem("subscription_popup_shown", "true");
    }

    if (isExpired) {
      localStorage.removeItem("subscription");
    }
  }, []);

  const requireSubscription = () => {
    if (!subscription) {
      setShowPopup(true);
      return false;
    }

    if (subscription?.expiresAt && Date.now() > subscription.expiresAt) {
      localStorage.removeItem("subscription");
      setSubscription(null);
      setShowPopup(true);
      return false;
    }

    return true;
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`${API}/hotel-admin/restaurant`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setRestaurantId(res.data.data.id);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRestaurant();
  }, []);

  const fetchQR = async () => {
    try {
      const res = await axios.get(`${API}/hotel-admin/qr-code`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const list = res.data.data;
      setQrList(list);

      // 🔥 separate restaurant QR
      const restaurant = list.find(q => q.type === "restaurant");
      setRestaurantQR(restaurant);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQR();
  }, []);

  const handleGenerateRestaurantQR = async () => {
    if (!requireSubscription()) return;

    try {
      await axios.post(
        `${API}/hotel-admin/qr-restaurant`,
        { restaurantId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Restaurant QR Generated ✅");
      fetchQR();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed ❌");
    }
  };

  const handleGenerateTableQR = async (tableNumber) => {
    if (!requireSubscription()) return;

    try {
      await axios.post(
        `${API}/hotel-admin/qr-table`,
        { restaurantId, tableNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Table ${tableNumber} QR Generated ✅`);
      fetchQR();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed ❌");
    }
  };

  const handleDownloadQR = async (id) => {
    try {
      const res = await axios.get(`${API}/hotel-admin/qr-code/download/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "qr.png";
      link.click();

      toast.success("Downloaded ✅");
    } catch {
      toast.error("Download failed ❌");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">QR Code Generator</h1>
        <p className="text-gray-500 mt-1">Generate and manage QR codes for your restaurant</p>
      </div>

      <Tabs defaultValue="restaurant" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="restaurant">Restaurant QR</TabsTrigger>
          <TabsTrigger value="tables">Table QR Codes</TabsTrigger>
        </TabsList>

        {/* ================= RESTAURANT ================= */}
        <TabsContent value="restaurant" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-white shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle>Restaurant QR Code</CardTitle>
                <p className="text-sm text-gray-500">Main menu QR code for your restaurant</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-8 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-64 h-64 bg-gray-50 border-4 border-[#1E88E5] rounded-lg flex items-center justify-center mb-4">
                      
                      {restaurantQR ? (
                        <img
                          src={restaurantQR.qrImage}
                          alt="Restaurant QR"
                          className="w-48 h-48 object-contain"
                        />
                      ) : (
                        <QrCode className="w-48 h-48 text-gray-400" />
                      )}

                    </div>

                    <div className="flex items-center justify-center text-center p-4">
                      <p className="text-sm text-gray-600 mb-0">
                        Scan to view menu at:<br />
                        {subscription ? (
                          <span className="font-mono text-[#1E88E5]">
                            {restaurantQR?.url || "Generate QR first"}
                          </span>
                        ) : (
                          <span className="font-mono text-gray-400 select-none">
                            🔒 Upgrade to unlock custom URL
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      if (!requireSubscription()) return;
                      handleGenerateRestaurantQR();
                    }}
                    className="flex-1 bg-[#1E88E5] hover:bg-[#1976D2]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Generate Qr
                  </Button>

                  <Button
                    onClick={() => {
                      if (!requireSubscription()) return;
                      if (!restaurantQR?.id) return;

                      handleDownloadQR(restaurantQR.id);
                    }}
                    className="flex-1 bg-[#00C853] hover:bg-[#00B248]"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Download PNG
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ================= TABLES ================= */}
        <TabsContent value="tables" className="space-y-6">
          <Card className="bg-white shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle>Table QR Codes</CardTitle>
              <p className="text-sm text-gray-500">Generate unique QR codes for each table</p>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                {tableNumbers.map((num) => (
                  <Card
                    key={num}
                    className={`cursor-pointer transition-all"border border-gray-200 hover:shadow-md"
                    `}
                    onClick={() => {
                      if (!requireSubscription()) return;
                    }}
                  >
                    <CardContent className="p-4 text-center">
        <div className="w-full aspect-square bg-gray-50 rounded-lg flex flex-col items-center justify-center mb-2 gap-2">
          
          {(() => {
            const qr = qrList
              .filter(q => q.type === "table")
              .reverse() // latest QR first
              .find(q => Number(q.tableNumber) === num);

            return qr ? (
              <>
                <img
                  src={qr.qrImage}
                  alt={`Table ${num}`}
                  className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
                />

                <span style={{fontSize: "9px"}} className="font-mono text-[#1E88E5]">
                {qr.url || "Generate QR first"}
                </span>

                {/* Download button (optional bonus) */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadQR(qr.id);
                  }}
                >
                  Download PNG
                </Button>
              </>
            ) : (
              <>
                <QrCode className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400" />

                {/* Generate Button */}
                <Button
                  size="sm"
                  className="bg-[#1E88E5] hover:bg-[#1976D2]"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click conflict
                    if (!requireSubscription()) return;
                    handleGenerateTableQR(num);
                  }}
                >
                  Generate
                </Button>
              </>
            );
          })()}

        </div>

        <p className="font-semibold text-sm sm:text-base">
          Table {num}
        </p>
      </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 bg-[#1E88E5] hover:bg-[#1976D2]">
                  <Download className="w-4 h-4 mr-2" />
                  Download All Tables
                </Button>

                <Button className="flex-1 bg-[#00C853] hover:bg-[#00B248]">
                  <Printer className="w-4 h-4 mr-2" />
                  Print All Tables
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* BATCH ACTIONS (UNCHANGED) */}
          <Card className="bg-white shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle>Batch Actions</CardTitle>
              <p className="text-sm text-gray-500">Manage multiple table QR codes</p>
            </CardHeader>
            <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="tableRange">Generate QR Codes for Tables</Label>
                      <div className="flex gap-3 mt-2">
                        <Input id="tableRange" type="number" placeholder="From" defaultValue="1" />
                        <Input type="number" placeholder="To" defaultValue="12" />
                        <Button
                          onClick={() => {
                            if (!requireSubscription()) return;
                          }}
                          className="bg-[#1E88E5] hover:bg-[#1976D2]"
                        >
                          Generate
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                      onClick={() => {
                        if (!requireSubscription()) return;
                      }}
                      variant="outline" className="h-auto py-4">
                        Download as ZIP
                      </Button>
                      <Button 
                      onClick={() => {
                        if (!requireSubscription()) return;
                      }}
                      variant="outline" className="h-auto py-4">
                        Print as PDF
                      </Button>
                    </div>
                  </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
                  You are currently on <span className="font-semibold text-[#1E88E5]">Free Access</span>
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
                    window.location.href = "/subscription";
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