import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChefHat, Minus, Plus, ShoppingCart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Category, MenuItem } from "../backend";
import { useAppContext } from "../context/AppContext";
import { useGetCategories, useGetMenuItems } from "../hooks/useQueries";

// Sample data for first-load population
const SAMPLE_CATEGORIES: Category[] = [
  { id: 1n, name: "Starters" },
  { id: 2n, name: "Mains" },
  { id: 3n, name: "Beverages" },
  { id: 4n, name: "Desserts" },
];

const SAMPLE_ITEMS: MenuItem[] = [
  {
    id: 1n,
    categoryId: 1n,
    name: "Gobi Manchurian",
    description: "Crispy cauliflower in spicy Indo-Chinese sauce",
    price: 160,
    available: true,
  },
  {
    id: 2n,
    categoryId: 1n,
    name: "Paneer Tikka",
    description: "Marinated cottage cheese, grilled in tandoor",
    price: 220,
    available: true,
  },
  {
    id: 3n,
    categoryId: 1n,
    name: "Veg Spring Rolls",
    description: "Golden fried rolls stuffed with spiced vegetables",
    price: 130,
    available: true,
  },
  {
    id: 4n,
    categoryId: 1n,
    name: "Crispy Corn",
    description: "Sweet corn tossed with chilli and herbs",
    price: 140,
    available: true,
  },
  {
    id: 5n,
    categoryId: 2n,
    name: "Paneer Butter Masala",
    description: "Creamy tomato curry with soft paneer cubes",
    price: 280,
    available: true,
  },
  {
    id: 6n,
    categoryId: 2n,
    name: "Dal Makhani",
    description: "Slow-cooked black lentils in rich buttery gravy",
    price: 220,
    available: true,
  },
  {
    id: 7n,
    categoryId: 2n,
    name: "Veg Dum Biryani",
    description: "Fragrant basmati rice layered with spiced vegetables",
    price: 260,
    available: true,
  },
  {
    id: 8n,
    categoryId: 2n,
    name: "Aloo Paratha",
    description: "Whole wheat flatbread stuffed with spiced potato",
    price: 90,
    available: true,
  },
  {
    id: 9n,
    categoryId: 2n,
    name: "Chole Bhature",
    description: "Fluffy fried bread with tangy chickpea curry",
    price: 150,
    available: true,
  },
  {
    id: 10n,
    categoryId: 3n,
    name: "Fresh Lime Soda",
    description: "Chilled lime soda, sweet or salted",
    price: 60,
    available: true,
  },
  {
    id: 11n,
    categoryId: 3n,
    name: "Masala Chai",
    description: "Aromatic spiced tea with ginger and cardamom",
    price: 40,
    available: true,
  },
  {
    id: 12n,
    categoryId: 3n,
    name: "Mangalore Filter Coffee",
    description: "Traditional South Indian filter coffee decoction",
    price: 50,
    available: true,
  },
  {
    id: 13n,
    categoryId: 3n,
    name: "Mango Lassi",
    description: "Thick yoghurt drink blended with Alphonso mango",
    price: 100,
    available: true,
  },
  {
    id: 14n,
    categoryId: 4n,
    name: "Gulab Jamun",
    description: "Soft milk solid dumplings in rose sugar syrup",
    price: 80,
    available: true,
  },
  {
    id: 15n,
    categoryId: 4n,
    name: "Rasgulla",
    description: "Spongy cottage cheese balls in light syrup",
    price: 80,
    available: true,
  },
  {
    id: 16n,
    categoryId: 4n,
    name: "Ice Cream",
    description: "Choose from Mango, Vanilla, or Butter Scotch",
    price: 90,
    available: true,
  },
];

export default function MenuPage() {
  const navigate = useNavigate();
  const {
    vehicleDetails,
    cart,
    addToCart,
    removeFromCart,
    cartTotal,
    cartItemCount,
  } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState<bigint | null>(null);

  const { data: categoriesData, isLoading: catLoading } = useGetCategories();
  const { data: itemsData, isLoading: itemsLoading } = useGetMenuItems();

  const categories =
    categoriesData && categoriesData.length > 0
      ? categoriesData
      : SAMPLE_CATEGORIES;
  const allItems = itemsData && itemsData.length > 0 ? itemsData : SAMPLE_ITEMS;

  useEffect(() => {
    if (!vehicleDetails) {
      navigate({ to: "/" });
    }
  }, [vehicleDetails, navigate]);

  useEffect(() => {
    if (categories.length > 0 && selectedCategory === null) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const filteredItems = selectedCategory
    ? allItems.filter((i) => i.categoryId === selectedCategory && i.available)
    : allItems.filter((i) => i.available);

  const getCartQty = (id: bigint) =>
    cart.find((c) => c.menuItemId === id)?.quantity ?? 0;

  const isLoading = catLoading || itemsLoading;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
          <ChefHat className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-base text-foreground leading-none">
            Dinki Dine Veg
          </h1>
          {vehicleDetails && (
            <p className="text-xs text-muted-foreground">
              {vehicleDetails.carColour} {vehicleDetails.carModel}
            </p>
          )}
        </div>
        {cartItemCount > 0 && (
          <button
            type="button"
            data-ocid="menu.secondary_button"
            onClick={() => navigate({ to: "/checkout" })}
            className="relative"
          >
            <ShoppingCart className="w-6 h-6 text-primary" />
            <span className="absolute -top-1.5 -right-1.5 bg-secondary text-secondary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cartItemCount}
            </span>
          </button>
        )}
      </header>

      {/* Category Pills */}
      <div className="bg-card border-b border-border px-4 py-3 sticky top-[57px] z-20">
        {isLoading ? (
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.id.toString()}
                data-ocid="menu.tab"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Menu Items */}
      <main className="flex-1 px-4 py-4 pb-32" data-ocid="menu.list">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-4 border border-border"
              >
                <Skeleton className="h-5 w-2/3 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-10 w-28 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div
            data-ocid="menu.empty_state"
            className="text-center py-16 text-muted-foreground"
          >
            <ChefHat className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No items in this category</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item, idx) => {
              const qty = getCartQty(item.id);
              return (
                <motion.div
                  key={item.id.toString()}
                  data-ocid={`menu.item.${idx + 1}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                  className="bg-card rounded-2xl p-4 border border-border shadow-xs"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-base">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                      <p className="text-base font-bold text-foreground mt-2">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {qty === 0 ? (
                        <button
                          type="button"
                          data-ocid={`menu.button.${idx + 1}`}
                          onClick={() => {
                            addToCart({
                              menuItemId: item.id,
                              name: item.name,
                              price: item.price,
                            });
                            toast.success(`${item.name} added!`);
                          }}
                          className="h-10 px-5 rounded-full bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/90 transition-colors"
                        >
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            data-ocid={`menu.button.${idx + 1}`}
                            onClick={() => removeFromCart(item.id)}
                            className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/90 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-6 text-center font-bold text-base">
                            {qty}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              addToCart({
                                menuItemId: item.id,
                                name: item.name,
                                price: item.price,
                              })
                            }
                            className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/90 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Sticky Cart Bar */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div
            data-ocid="menu.panel"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-primary px-4 py-3 flex items-center justify-between"
          >
            <div className="text-primary-foreground">
              <span className="font-bold text-base">
                {cartItemCount} item{cartItemCount !== 1 ? "s" : ""}
              </span>
              <span className="mx-2 opacity-60">|</span>
              <span className="font-bold text-base">
                ₹{cartTotal.toFixed(2)}
              </span>
            </div>
            <Button
              data-ocid="menu.primary_button"
              onClick={() => navigate({ to: "/checkout" })}
              className="bg-card text-primary font-bold rounded-full px-5 h-10 hover:bg-card/90"
            >
              Checkout <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
