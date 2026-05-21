import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Plus, GripVertical, Edit2, Trash2 } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { MultiBackend } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import axios from "axios";
import { toast } from "react-toastify";

function DraggableCategory({
  category,
  index,
  moveCategory,
  onEdit,
  onDelete,
  requireSubscription,
}) {
  const [{ isDragging }, drag] = useDrag({
    type: "category",
    item: { index },

    canDrag: () => {
      if (!requireSubscription()) return false;
      return true;
    },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "category",
    hover: (item) => {
      if (!requireSubscription()) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveCategory(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Card className="bg-white shadow-sm border-gray-200 hover:shadow-md transition-all cursor-move">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GripVertical className="w-5 h-5 text-gray-400" />
              <div className="text-4xl">{category.icon || "🍽️"}</div>
              <div>
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <p className="text-sm text-gray-500">
                  {category.itemCount || 0} items
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (!requireSubscription()) return;
                  onEdit(category);
                }}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-red-500 hover:text-red-600"
                onClick={() => {
                  if (!requireSubscription()) return;
                  onDelete(category.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function MenuCategories() {
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [subscription, setSubscription] = useState(null);

  const API = import.meta.env.VITE_API_URL;

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
    const data = localStorage.getItem("subscription");
    const popupShown = sessionStorage.getItem("subscription_popup_shown");

    const showPopupOnce = () => {
      setShowPopup(true);
      sessionStorage.setItem("subscription_popup_shown", "true");
    };

    // No subscription
    if (!data) {
      if (!popupShown) showPopupOnce();
      return;
    }

    const parsed = JSON.parse(data);

    // Expired subscription
    if (parsed?.expiresAt && Date.now() > parsed.expiresAt) {
      localStorage.removeItem("subscription");
      if (!popupShown) showPopupOnce();
      return;
    }

    setSubscription(parsed);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      if (!token) return;

      const res = await axios.get(`${API}/hotel-admin/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

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

  const reorderTimeout = useRef(null);

  const moveCategory = (dragIndex, hoverIndex) => {
    setCategories((prev) => {
      const updated = [...prev];

      const draggedItem = updated[dragIndex];
      if (!draggedItem?.id) return prev;

      updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, draggedItem);

      if (reorderTimeout.current) {
        clearTimeout(reorderTimeout.current);
      }

      reorderTimeout.current = setTimeout(() => {
        const payload = updated
          .filter((c) => c?.id != null)
          .map((cat, index) => ({
            id: Number(cat.id),
            order: index + 1,
          }));

        updateOrder(payload);
      }, 400);

      return updated;
    });
  };

  const updateOrder = async (updatedOrder) => {
    try {
      if (!Array.isArray(updatedOrder) || updatedOrder.length === 0) return;

      await axios.put(
        `${API}/hotel-admin/categories/reorder`,
        { categories: updatedOrder },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Category order updated 🔄");
    } catch (err) {
      console.error("REORDER ERROR:", err.response?.data || err.message);
      toast.error("Failed to update order");
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await axios.post(
        `${API}/hotel-admin/categories`,
        { name: categoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Category added successfully 🎉");

      fetchCategories();
      setCategoryName("");
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add category");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setIsDialogOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await axios.put(
        `${API}/hotel-admin/categories/${editingCategory.id}`,
        { name: categoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Category updated successfully");

      fetchCategories();
      setEditingCategory(null);
      setCategoryName("");
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${API}/hotel-admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Category deleted 🗑️");

      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Menu Categories</h1>
            <p className="text-gray-500 mt-1">
              Organize your menu items into categories
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button
              onClick={() => {
                if (!requireSubscription()) return;

                setEditingCategory(null);
                setCategoryName("");

                setIsDialogOpen(true);
              }}
              className="bg-[#1E88E5] hover:bg-[#1976D2]"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Category
            </Button>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </DialogTitle>
                <DialogDescription>
                  {editingCategory
                    ? "Update the category details below."
                    : "Create a new menu category for organizing your items."}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    className="mt-3"
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g., Appetizers"
                  />
                </div>
                <Button
                  onClick={
                    editingCategory
                      ? handleUpdateCategory
                      : handleAddCategory
                  }
                  className="w-full bg-[#1E88E5] hover:bg-[#1976D2]"
                >
                  {editingCategory ? "Update Category" : "Add Category"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Drag and drop categories to reorder them.
            The order here will reflect in your customer menu.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 gap-4">
            {categories.length === 0 ? (
              <div className="text-center py-16 border rounded-xl bg-gray-50">
                <p className="text-lg font-semibold text-gray-700">
                  No categories found 🍽️
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Start by adding your first category
                </p>

                <Button
                  className="mt-4 bg-[#1E88E5] hover:bg-[#1976D2]"
                  onClick={() => {
                    if (!requireSubscription()) return;
                    setEditingCategory(null);
                    setCategoryName("");
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            ) : (
              categories.map((category, index) => (
                <DraggableCategory
                  key={category.id || index}
                  category={category}
                  index={index}
                  moveCategory={moveCategory}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                  requireSubscription={requireSubscription}
                />
              ))
            )}
          </div>
        </div>
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
                  <span className="font-semibold text-[#1E88E5]">
                    Free Access
                  </span>
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
    </DndProvider>
  );
}