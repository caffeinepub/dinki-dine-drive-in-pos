import { type ReactNode, createContext, useContext, useState } from "react";

export interface VehicleDetails {
  mobileNumber: string;
  carModel: string;
  carColour: string;
}

export interface CartItem {
  menuItemId: bigint;
  name: string;
  price: number;
  quantity: number;
}

interface AppContextType {
  vehicleDetails: VehicleDetails | null;
  setVehicleDetails: (details: VehicleDetails) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (menuItemId: bigint) => void;
  updateQuantity: (menuItemId: bigint, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  lastOrderId: bigint | null;
  setLastOrderId: (id: bigint) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(
    null,
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastOrderId, setLastOrderId] = useState<bigint | null>(null);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.menuItemId);
      if (existing) {
        return prev.map((c) =>
          c.menuItemId === item.menuItemId
            ? { ...c, quantity: c.quantity + 1 }
            : c,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (menuItemId: bigint) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === menuItemId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((c) => c.menuItemId !== menuItemId);
      }
      return prev.map((c) =>
        c.menuItemId === menuItemId ? { ...c, quantity: c.quantity - 1 } : c,
      );
    });
  };

  const updateQuantity = (menuItemId: bigint, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((c) => c.menuItemId !== menuItemId));
    } else {
      setCart((prev) =>
        prev.map((c) => (c.menuItemId === menuItemId ? { ...c, quantity } : c)),
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    setVehicleDetails(null);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        vehicleDetails,
        setVehicleDetails,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        lastOrderId,
        setLastOrderId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
