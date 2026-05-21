import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;
const IMG = import.meta.env.VITE_API_URL_IMG;

export function Settings() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    facebook: "",
    instagram: "",
    twitter: "",
  });
  const [isNew, setIsNew] = useState(true);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [hours, setHours] = useState({});
  const [subscription, setSubscription] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Get token from correct localStorage key
  const getToken = () => {
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("token_expires_at");

    if (!token || !expiresAt) {
      return null;
    }

    if (new Date() > new Date(expiresAt)) {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      localStorage.removeItem("token_expires_at");
      return null;
    }

    return token;
  };

  const token = getToken();

  useEffect(() => {
    fetchRestaurant();

    const data = localStorage.getItem("subscription");
    const popupShown = localStorage.getItem("subscription_popup_shown");

    const parsed = data ? JSON.parse(data) : null;
    const isExpired = parsed?.expiresAt && Date.now() > parsed.expiresAt;

    if (parsed && !isExpired) {
      setSubscription(parsed);
      setShowPopup(false);
      localStorage.removeItem("subscription_popup_shown");
      return;
    }

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

  const fetchRestaurant = async () => {
    try {
      const authToken = getToken();
      if (!authToken) {
        toast.error("Please login first");
        return;
      }

      const res = await axios.get(`${API}/hotel-admin/restaurant`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.data.data) {
        const r = res.data.data;

        setIsNew(false);

        const cleanPath = r.logo?.replace(/\\/g, "/");

        setLogoPreview(cleanPath ? `${IMG}/${cleanPath}` : null);

        const social = r.socialLinks || {};
        const hoursData = r.operatingHours || {};

        setHours(hoursData);

        setForm({
          name: r.name || "",
          address: r.address || "",
          phone: r.phone || "",
          email: r.email || "",
          description: r.description || "",
          facebook: social?.facebook || "",
          instagram: social?.instagram || "",
          twitter: social?.twitter || "",
        });
      } else {
        setIsNew(true);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        toast.warn("Subscription expired. Please upgrade your plan ⚠️");
        window.location.href = "/subscription";
      } else {
        console.error("Fetch error:", err);
      }
    }
  };

  const handleHoursChange = (day, field, value) => {
    setHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      if (!token) {
        toast.error("Please login first");
        return;
      }

      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("address", form.address);
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("description", form.description);
      formData.append("operatingHours", JSON.stringify(hours));
      formData.append(
        "socialLinks",
        JSON.stringify({
          facebook: form.facebook,
          instagram: form.instagram,
          twitter: form.twitter,
        })
      );

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      if (isNew) {
        await axios.post(`${API}/hotel-admin/restaurant/register`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Restaurant created successfully ✅");
        setIsNew(false);
      } else {
        await axios.put(`${API}/hotel-admin/restaurant/update`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Updated successfully ✅");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Restaurant</h1>
        <p className="text-gray-500 mt-1">
          Manage your restaurant profile and preferences
        </p>
      </div>

      {/* Restaurant Profile */}
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>Restaurant Profile</CardTitle>
          <p className="text-sm text-gray-500">
            Basic information about your restaurant
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="name">Restaurant Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => {
                if (!requireSubscription()) return;
                handleChange(e);
              }}
              disabled={!subscription}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Restaurant Logo</Label>

            <div className="mt-2 flex items-center gap-4">
              {/* Preview */}
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
                {logoFile ? (
                  <img
                    src={URL.createObjectURL(logoFile)}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : logoPreview ? (
                  <img
                    src={logoPreview}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-3xl">🍽️</span>
                )}
              </div>

              {/* Upload Area */}
              <div className="flex-1">
                <label
                  onClick={(e) => {
                    if (!requireSubscription()) {
                      e.preventDefault();
                    }
                  }}
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer block
                  ${
                    !subscription
                      ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60"
                      : "border-gray-300 hover:border-[#1E88E5]"
                  }`}
                >
                  <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload new logo</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={!subscription}
                    onChange={(e) => {
                      if (!requireSubscription()) return;

                      const file = e.target.files[0];
                      if (!file) return;

                      if (file.size > 2 * 1024 * 1024) {
                        alert("File must be less than 2MB");
                        return;
                      }

                      setLogoFile(file);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={form.address}
              onChange={(e) => {
                if (!requireSubscription()) return;
                handleChange(e);
              }}
              disabled={!subscription}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => {
                  if (!requireSubscription()) return;
                  handleChange(e);
                }}
                disabled={!subscription}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={form.email}
                onChange={(e) => {
                  if (!requireSubscription()) return;
                  handleChange(e);
                }}
                disabled={!subscription}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => {
                if (!requireSubscription()) return;
                handleChange(e);
              }}
              disabled={!subscription}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>Operating Hours</CardTitle>
          <p className="text-sm text-gray-500">
            Set your restaurant's working hours
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {[
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ].map((day) => (
            <div key={day} className="flex items-center gap-4">
              <div className="w-32">
                <Label>{day.charAt(0).toUpperCase() + day.slice(1)}</Label>
              </div>

              <Input
                type="time"
                value={hours[day]?.open || "11:00"}
                disabled={!subscription}
                onChange={(e) => {
                  if (!requireSubscription()) return;
                  handleHoursChange(day, "open", e.target.value);
                }}
                className="flex-1"
              />

              <span>to</span>

              <Input
                type="time"
                value={hours[day]?.close || "23:00"}
                disabled={!subscription}
                onChange={(e) => {
                  if (!requireSubscription()) return;
                  handleHoursChange(day, "close", e.target.value);
                }}
                className="flex-1"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <p className="text-sm text-gray-500">
            Connect your social media profiles
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              onChange={(e) => {
                if (!requireSubscription()) return;
                handleChange(e);
              }}
              disabled={!subscription}
              className="mt-2"
              id="facebook"
              value={form.facebook}
            />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              onChange={(e) => {
                if (!requireSubscription()) return;
                handleChange(e);
              }}
              disabled={!subscription}
              className="mt-2"
              id="instagram"
              value={form.instagram}
            />
          </div>
          <div>
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              onChange={(e) => {
                if (!requireSubscription()) return;
                handleChange(e);
              }}
              disabled={!subscription}
              className="mt-2"
              id="twitter"
              value={form.twitter}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <Button variant="outline" className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (!requireSubscription()) return;
            handleSave();
          }}
          disabled={loading}
          className="bg-[#1E88E5] hover:bg-[#1976D2] w-full sm:w-auto"
        >
          {loading ? "Saving..." : isNew ? "Create Restaurant" : "Save Changes"}
        </Button>
      </div>

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