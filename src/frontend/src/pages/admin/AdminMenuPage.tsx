import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Category, MenuItem } from "../../backend";
import {
  useAddCategory,
  useAddMenuItem,
  useDeleteCategory,
  useDeleteMenuItem,
  useGetCategories,
  useGetMenuItems,
  useUpdateMenuItem,
} from "../../hooks/useQueries";

interface ItemForm {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  available: boolean;
}

const EMPTY_FORM: ItemForm = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  available: true,
};

export default function AdminMenuPage() {
  const { data: categories = [], isLoading: catLoading } = useGetCategories();
  const { data: menuItems = [], isLoading: itemsLoading } = useGetMenuItems();

  const addMenuItem = useAddMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  const addCategory = useAddCategory();
  const deleteCategory = useDeleteCategory();

  const [itemDialog, setItemDialog] = useState<{
    open: boolean;
    editing: MenuItem | null;
  }>({
    open: false,
    editing: null,
  });
  const [itemForm, setItemForm] = useState<ItemForm>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "item" | "category";
    id: bigint;
    name: string;
  } | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  const [filterCat, setFilterCat] = useState<string>("all");

  const openAdd = () => {
    setItemForm(EMPTY_FORM);
    setItemDialog({ open: true, editing: null });
  };

  const openEdit = (item: MenuItem) => {
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      categoryId: item.categoryId.toString(),
      available: item.available,
    });
    setItemDialog({ open: true, editing: item });
  };

  const handleSaveItem = async () => {
    const price = Number.parseFloat(itemForm.price);
    if (!itemForm.name.trim() || Number.isNaN(price) || !itemForm.categoryId) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      if (itemDialog.editing) {
        await updateMenuItem.mutateAsync({
          id: itemDialog.editing.id,
          name: itemForm.name.trim(),
          description: itemForm.description.trim(),
          price,
          categoryId: BigInt(itemForm.categoryId),
          available: itemForm.available,
        });
        toast.success("Item updated");
      } else {
        await addMenuItem.mutateAsync({
          name: itemForm.name.trim(),
          description: itemForm.description.trim(),
          price,
          categoryId: BigInt(itemForm.categoryId),
          available: itemForm.available,
        });
        toast.success("Item added");
      }
      setItemDialog({ open: false, editing: null });
    } catch {
      toast.error("Failed to save item");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "item") {
        await deleteMenuItem.mutateAsync(deleteTarget.id);
        toast.success("Item deleted");
      } else {
        await deleteCategory.mutateAsync(deleteTarget.id);
        toast.success("Category deleted");
      }
    } catch {
      toast.error("Failed to delete");
    }
    setDeleteTarget(null);
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      await addCategory.mutateAsync(newCatName.trim());
      setNewCatName("");
      setAddingCat(false);
      toast.success("Category added");
    } catch {
      toast.error("Failed to add category");
    }
  };

  const filteredItems =
    filterCat === "all"
      ? menuItems
      : menuItems.filter((i) => i.categoryId.toString() === filterCat);

  const getCatName = (id: bigint) =>
    categories.find((c) => c.id === id)?.name ?? "Uncategorised";
  const isPending = addMenuItem.isPending || updateMenuItem.isPending;

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {menuItems.length} items across {categories.length} categories
          </p>
        </div>
        <Button
          data-ocid="menu_mgmt.primary_button"
          onClick={openAdd}
          className="bg-primary text-primary-foreground rounded-xl font-semibold"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Item
        </Button>
      </div>

      {/* Categories Section */}
      <div className="bg-card rounded-2xl border border-border p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base flex items-center gap-2">
            <Tag className="w-4 h-4 text-secondary" /> Categories
          </h2>
          <Button
            data-ocid="menu_mgmt.secondary_button"
            size="sm"
            variant="outline"
            onClick={() => setAddingCat(true)}
            className="rounded-xl text-xs"
          >
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>

        {addingCat && (
          <div className="flex gap-2 mb-3">
            <Input
              data-ocid="menu_mgmt.input"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Category name"
              className="rounded-xl h-9 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCategory();
              }}
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleAddCategory}
              disabled={addCategory.isPending}
              className="rounded-xl bg-primary text-primary-foreground"
            >
              {addCategory.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setAddingCat(false);
                setNewCatName("");
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
          </div>
        )}

        {catLoading ? (
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div
                key={cat.id.toString()}
                data-ocid="menu_mgmt.panel"
                className="flex items-center gap-1.5 bg-muted rounded-xl px-3 py-1.5"
              >
                <span className="text-sm font-medium">{cat.name}</span>

                <button
                  type="button"
                  data-ocid="menu_mgmt.delete_button"
                  onClick={() =>
                    setDeleteTarget({
                      type: "category",
                      id: cat.id,
                      name: cat.name,
                    })
                  }
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter + Items */}
      <div className="flex items-center gap-3 mb-4">
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger
            data-ocid="menu_mgmt.select"
            className="w-48 rounded-xl h-9 text-sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id.toString()} value={c.id.toString()}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filteredItems.length} items
        </span>
      </div>

      {itemsLoading ? (
        <div data-ocid="menu_mgmt.loading_state" className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div
          data-ocid="menu_mgmt.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <p>No items found. Add your first menu item!</p>
        </div>
      ) : (
        <div className="space-y-2" data-ocid="menu_mgmt.list">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id.toString()}
              data-ocid={`menu_mgmt.item.${idx + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.03 }}
              className="bg-card rounded-2xl border border-border p-3 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-foreground">
                    {item.name}
                  </p>
                  {!item.available && (
                    <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                      Unavailable
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {getCatName(item.categoryId)} · ₹{item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-ocid={`menu_mgmt.edit_button.${idx + 1}`}
                  onClick={() => openEdit(item)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </button>

                <button
                  type="button"
                  data-ocid={`menu_mgmt.delete_button.${idx + 1}`}
                  onClick={() =>
                    setDeleteTarget({
                      type: "item",
                      id: item.id,
                      name: item.name,
                    })
                  }
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Item Dialog */}
      <Dialog
        open={itemDialog.open}
        onOpenChange={(open) => setItemDialog({ open, editing: null })}
      >
        <DialogContent
          data-ocid="menu_mgmt.dialog"
          className="rounded-2xl max-w-md"
        >
          <DialogHeader>
            <DialogTitle>
              {itemDialog.editing ? "Edit Item" : "Add Menu Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-sm font-semibold">Name *</Label>
              <Input
                data-ocid="menu_mgmt.input"
                value={itemForm.name}
                onChange={(e) =>
                  setItemForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Paneer Tikka"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-semibold">Description</Label>
              <Textarea
                data-ocid="menu_mgmt.textarea"
                value={itemForm.description}
                onChange={(e) =>
                  setItemForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Brief description of the dish"
                className="rounded-xl resize-none h-20"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-sm font-semibold">Price (₹) *</Label>
                <Input
                  data-ocid="menu_mgmt.input"
                  type="number"
                  value={itemForm.price}
                  onChange={(e) =>
                    setItemForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="0.00"
                  className="rounded-xl"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-semibold">Category *</Label>
                <Select
                  value={itemForm.categoryId}
                  onValueChange={(v) =>
                    setItemForm((f) => ({ ...f, categoryId: v }))
                  }
                >
                  <SelectTrigger
                    data-ocid="menu_mgmt.select"
                    className="rounded-xl"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id.toString()} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                data-ocid="menu_mgmt.switch"
                checked={itemForm.available}
                onCheckedChange={(v) =>
                  setItemForm((f) => ({ ...f, available: v }))
                }
              />
              <Label className="text-sm">Available for ordering</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="menu_mgmt.cancel_button"
              variant="outline"
              onClick={() => setItemDialog({ open: false, editing: null })}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              data-ocid="menu_mgmt.save_button"
              onClick={handleSaveItem}
              disabled={isPending}
              className="rounded-xl bg-primary text-primary-foreground"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent data-ocid="menu_mgmt.modal" className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {deleteTarget?.type === "category" ? "Category" : "Item"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="menu_mgmt.cancel_button"
              className="rounded-xl"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="menu_mgmt.confirm_button"
              onClick={handleDeleteConfirm}
              className="rounded-xl bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
