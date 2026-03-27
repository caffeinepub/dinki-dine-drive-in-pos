import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface VehicleDetails {
  mobileNumber: string;
  carModel: string;
  carColour: string;
  carNumber: string;
}

export interface CartItemAddon {
  addonId: bigint;
  name: string;
  price: number;
}

export interface CartItem {
  menuItemId: bigint;
  name: string;
  price: number;
  quantity: number;
  addons?: CartItemAddon[];
}

const VEHICLE_KEY = "dinkidine_vehicle";

function loadVehicle(): VehicleDetails | null {
  try {
    const raw = localStorage.getItem(VEHICLE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as VehicleDetails;
    // If loaded data is missing required fields (e.g. carNumber from older sessions), discard it
    if (
      !data.mobileNumber ||
      !data.carModel ||
      !data.carColour ||
      !data.carNumber
    ) {
      localStorage.removeItem(VEHICLE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function saveVehicle(v: VehicleDetails) {
  try {
    localStorage.setItem(VEHICLE_KEY, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

function removeVehicle() {
  try {
    localStorage.removeItem(VEHICLE_KEY);
  } catch {
    /* ignore */
  }
}

interface AppContextType {
  vehicleDetails: VehicleDetails | null;
  setVehicleDetails: (details: VehicleDetails) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (menuItemId: bigint) => void;
  updateQuantity: (menuItemId: bigint, quantity: number) => void;
  clearCart: () => void;
  clearSession: () => void;
  cartTotal: number;
  cartItemCount: number;
  lastOrderId: bigint | null;
  setLastOrderId: (id: bigint) => void;
  sessionTotal: number;
  addToSessionTotal: (amount: number) => void;
  sessionOrderId: bigint | null;
  setSessionOrderId: (id: bigint) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [vehicleDetails, setVehicleDetailsState] =
    useState<VehicleDetails | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastOrderId, setLastOrderId] = useState<bigint | null>(null);
  const [sessionTotal, setSessionTotal] = useState<number>(0);
  const [sessionOrderId, setSessionOrderId] = useState<bigint | null>(null);

  // Restore vehicle from localStorage on mount
  useEffect(() => {
    const saved = loadVehicle();
    if (saved) setVehicleDetailsState(saved);
  }, []);

  const setVehicleDetails = (details: VehicleDetails) => {
    setVehicleDetailsState(details);
    saveVehicle(details);
  };

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.menuItemId);
      if (existing && (!item.addons || item.addons.length === 0)) {
        return prev.map((c) =>
          c.menuItemId === item.menuItemId
            ? { ...c, quantity: c.quantity + 1 }
            : c,
        );
      }
      if (existing && item.addons && item.addons.length > 0) {
        const sameAddons = prev.find(
          (c) =>
            c.menuItemId === item.menuItemId &&
            JSON.stringify(
              (c.addons ?? []).map((a) => a.addonId.toString()).sort(),
            ) ===
              JSON.stringify(
                item.addons!.map((a) => a.addonId.toString()).sort(),
              ),
        );
        if (sameAddons) {
          return prev.map((c) =>
            c === sameAddons ? { ...c, quantity: c.quantity + 1 } : c,
          );
        }
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (menuItemId: bigint) => {
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.menuItemId === menuItemId);
      if (idx === -1) return prev;
      const item = prev[idx];
      if (item.quantity <= 1) {
        return prev.filter((_, i) => i !== idx);
      }
      return prev.map((c, i) =>
        i === idx ? { ...c, quantity: c.quantity - 1 } : c,
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
  };

  const clearSession = () => {
    setCart([]);
    setVehicleDetailsState(null);
    setSessionTotal(0);
    setSessionOrderId(null);
    removeVehicle();
  };

  const addToSessionTotal = (amount: number) => {
    setSessionTotal((prev) => prev + amount);
  };

  const cartTotal = cart.reduce(
    (sum, item) =>
      sum +
      (item.price + (item.addons?.reduce((s, a) => s + a.price, 0) ?? 0)) *
        item.quantity,
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
        clearSession,
        cartTotal,
        cartItemCount,
        lastOrderId,
        setLastOrderId,
        sessionTotal,
        addToSessionTotal,
        sessionOrderId,
        setSessionOrderId,
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
