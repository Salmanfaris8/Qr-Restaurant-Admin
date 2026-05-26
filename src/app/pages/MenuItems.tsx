import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Plus, Edit2, Trash2, Upload } from "lucide-react";
import { Badge } from "../components/ui/badge";
import axios from "axios";
import { toast } from "react-toastify";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  spiceLevel: number;
  isAvailable: boolean;

  Category?: {
    id: number;
    name: string;
  };
}

// const initialMenuItems: MenuItem[] = [
//   {
//     id: "1",
//     name: "Chicken Biryani",
//     description: "Aromatic basmati rice with tender chicken pieces",
//     price: 299,
//     category: "Biryani",
//     image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
//     isVeg: false,
//     spiceLevel: 3,
//     available: true,
//   },
//   {
//     id: "2",
//     name: "Paneer Tikka",
//     description: "Grilled cottage cheese with Indian spices",
//     price: 249,
//     category: "Starters",
//     image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400",
//     isVeg: true,
//     spiceLevel: 2,
//     available: true,
//   },
//   {
//     id: "3",
//     name: "Butter Chicken",
//     description: "Creamy tomato curry with tender chicken",
//     price: 320,
//     category: "Main Course",
//     image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400",
//     isVeg: false,
//     spiceLevel: 2,
//     available: true,
//   },
//   {
//     id: "4",
//     name: "Mango Lassi",
//     description: "Traditional yogurt drink with mango",
//     price: 89,
//     category: "Drinks",
//     image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400",
//     isVeg: true,
//     spiceLevel: 0,
//     available: true,
//   },
// ];

export function MenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const API = import.meta.env.VITE_API_URL;
  const IMG = import.meta.env.VITE_API_URL_IMG;

  const token = localStorage.getItem("token");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isVeg: true,
    spiceLevel: "2",
    available: true,
  });

  useEffect(() => {
    const data = localStorage.getItem("subscription");
    const popupShown = localStorage.getItem("subscription_popup_shown");

    const parsed = data ? JSON.parse(data) : null;

    const isExpired =
      parsed?.expiresAt && Date.now() > parsed.expiresAt;

    // ✅ valid subscription
    if (parsed && !isExpired) {
      setSubscription(parsed);
      setShowPopup(false);
      localStorage.removeItem("subscription_popup_shown");
      return;
    }

    // ❌ no subscription OR expired
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

  const fetchCategories = async () => {
  try {
    const res = await axios.get(`${API}/hotel-admin/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setCategories(res.data.data || []);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  if (token) {
    fetchCategories();
    fetchMenuItems();
  }
}, [token]);

const fetchMenuItems = async (categoryId?: string) => {
  try {
    setLoading(true);

    if (!token) {
      toast.error("Login required");
      return;
    }

    let url = `${API}/hotel-admin/menu-items`;

    // ✅ if category selected → call category API
    if (categoryId && categoryId !== "all") {
      url = `${API}/hotel-admin/menu-items/${categoryId}`;
    }

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setMenuItems(res.data.data || []);
  } catch (err: any) {
    console.error(err);
    toast.error(err.response?.data?.message || "Error fetching menu");
  } finally {
    setLoading(false);
  }
};

const handleEditItem = (item: any) => {
  console.log("EDIT CLICKED", item);

  try {
    setEditingItem(item);

    setFormData({
      name: item?.name || "",
      description: item?.description || "",
      price: item?.price ? String(item.price) : "",
      category: item?.categoryId ? String(item.categoryId) : "",
      isVeg: item?.isVeg ?? true,
      spiceLevel: item?.spiceLevel ? String(item.spiceLevel) : "2",
      available: item?.isAvailable ?? true,
    });

    // ✅ IMPORTANT: set image preview for edit mode
    if (item?.image) {
      setPreview(`${IMG}/${item.image}`);
    } else {
      setPreview(null);
    }

    setSelectedFile(null);

    setIsDialogOpen(true);
  } catch (err) {
    console.error("EDIT ERROR:", err);
  }
};

const handleDeleteItem = async (id: string) => {
  if (!requireSubscription()) return;

  try {
    await axios.delete(`${API}/hotel-admin/menu-items/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Menu item deleted successfully!");
    fetchMenuItems();
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete menu item");
  }
};

const handleSaveItem = async () => {
  if (!requireSubscription()) return;

  if (!formData.category) {
    toast.error("Please select category");
    return;
  }

  try {
    const form = new FormData();

    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("categoryId", Number(formData.category).toString());
    form.append("isVeg", String(formData.isVeg));
    form.append("spiceLevel", formData.spiceLevel);
    form.append("isAvailable", String(formData.available));

    if (selectedFile) {
      form.append("image", selectedFile);
    }
    
    console.log("CATEGORY BEFORE SEND:", formData.category);
    console.log("TYPE:", typeof formData.category);
    if (editingItem) {
      await axios.put(
        `${API}/hotel-admin/menu-items/${editingItem.id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Menu item updated successfully!");
    } else {
      await axios.post(`${API}/hotel-admin/menu-items`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Menu item added successfully!");
    }

    // ✅ CLOSE MODAL
    setIsDialogOpen(false);

    // ✅ RESET FORM (IMPORTANT)
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      isVeg: true,
      spiceLevel: "2",
      available: true,
    });

    setSelectedFile(null);
    setEditingItem(null);

    fetchMenuItems();
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong!");
  }
};

const toggleAvailability = async (id: string) => {
  if (!requireSubscription()) return;

  try {
    await axios.patch(
      `${API}/hotel-admin/menu-items/${id}/toggle`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Availability updated!");
    fetchMenuItems();
  } catch (err) {
    console.error(err);
    toast.error("Failed to update availability");
  }
};

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Items</h1>
          <p className="text-gray-500 mt-1">Manage your restaurant menu items</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button
            onClick={() => {
              if (!requireSubscription()) return;

              setEditingItem(null);

              setFormData({
                name: "",
                description: "",
                price: "",
                category: "",
                isVeg: true,
                spiceLevel: "2",
                available: true,
              });

              setPreview(null);   // ✅ important
              setSelectedFile(null);

              setIsDialogOpen(true);
            }}
            className="bg-[#1E88E5] hover:bg-[#1976D2]"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Menu Item
          </Button>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Update the menu item details below." : "Add a new dish to your restaurant menu."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="itemName">Dish Name</Label>
                <Input
                  className="mt-2"
                  id="itemName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Chicken Biryani"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  className="mt-2"
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your dish..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    className="mt-2"
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="299"
                  />
                </div>
                
                <div>
                  <Label className="mb-2" htmlFor="category">Category</Label>

                  <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </div>
              </div>
              
              <div>
                <Label className="mb-2" htmlFor="spiceLevel">Spice Level</Label>
                <Select value={formData.spiceLevel} onValueChange={(value) => setFormData({ ...formData, spiceLevel: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No Spice</SelectItem>
                    <SelectItem value="1">Mild 🌶️</SelectItem>
                    <SelectItem value="2">Medium 🌶️🌶️</SelectItem>
                    <SelectItem value="3">Hot 🌶️🌶️🌶️</SelectItem>
                    <SelectItem value="4">Extra Hot 🌶️🌶️🌶️🌶️</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Upload Image</Label>
                <input
                  id="menu-image-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedFile(file);

                    if (file) {
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
                <div
                  className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#1E88E5] transition-colors cursor-pointer"
                  onClick={() => document.getElementById("menu-image-upload")?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </div>

                {preview && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-2">Preview:</p>
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-40 object-contain rounded-lg border"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <Label htmlFor="isVeg">Vegetarian</Label>
                <Switch
                  id="isVeg"
                  checked={formData.isVeg}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVeg: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <Label htmlFor="available">Available</Label>
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                />
              </div>
              
              <Button onClick={handleSaveItem} className="w-full bg-[#1E88E5] hover:bg-[#1976D2]">
                {editingItem ? "Save Changes" : "Add Menu Item"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3 flex-wrap mb-4">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          onClick={() => {
            setSelectedCategory("all");
            fetchMenuItems("all");
          }}
        >
          All
        </Button>

        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === String(cat.id) ? "default" : "outline"}
            onClick={() => {
              setSelectedCategory(String(cat.id));
              fetchMenuItems(String(cat.id));
            }}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Card key={item.id} className="bg-white shadow-sm border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
            <div className="relative">
              <img
                src={`${IMG}/${item?.image}`}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge variant={item.isVeg ? "default" : "destructive"} className={item.isVeg ? "bg-green-500" : "bg-red-500"}>
                  {item.isVeg ? "VEG" : "NON-VEG"}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-[#1E88E5]">₹{item.price}</span>
                <span className="text-sm text-gray-500">
                  <span className="text-sm text-gray-500">
                    {item.category?.name || "No Category"}
                  </span>
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.isAvailable}
                    onCheckedChange={() => toggleAvailability(item.id)}
                  />
                  <span className="text-xs text-gray-600">
                    {item.isAvailable == true ? "Available" : "Unavailable"}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditItem(item)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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