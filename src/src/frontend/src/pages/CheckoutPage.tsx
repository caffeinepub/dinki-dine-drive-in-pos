import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Car,
  Hash,
  Loader2,
  Palette,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";
import { useActor } from "../hooks/useActor";
import { useAppendToOrder, usePlaceOrder } from "../hooks/useQueries";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    vehicleDetails,
    cart,
    cartTotal,
    clearCart,
    setLastOrderId,
    removeFromCart,
    addToCart,
    addToSessionTotal,
    sessionOrderId,
    setSessionOrderId,
  } = useAppContext();
  const placeOrder = usePlaceOrder();
  const appendToOrder = useAppendToOrder();
  const { isFetching: actorFetching } = useActor();

  useEffect(() => {
    if (!vehicleDetails) navigate({ to: "/" });
    if (cart.length === 0) navigate({ to: "/menu" });
  }, [vehicleDetails, cart, navigate]);

  const gst = cartTotal * 0.05;
  const grandTotal = cartTotal + gst;

  const handlePlaceOrder = async () => {
    if (!vehicleDetails) return;
    try {
      const items = cart.map((c) => ({
        menuItemId: c.menuItemId,
        name: c.name,
        price: c.price,
        quantity: BigInt(c.quantity),
        addons: (c.addons ?? []).map((a) => ({
          addonId: a.addonId,
          name: a.name,
          price: a.price,
        })),
      }));

      if (sessionOrderId !== null) {
        try {
          await appendToOrder.mutateAsync({ orderId: sessionOrderId, items });
          setLastOrderId(sessionOrderId);
        } catch {
          // Order may no longer exist (e.g. after canister reset). Place as fresh order.
          const orderId = await placeOrder.mutateAsync({
            mobileNumber: vehicleDetails.mobileNumber,
            carModel: vehicleDetails.carModel,
            carColour: vehicleDetails.carColour,
            carNumber: vehicleDetails.carNumber,
            items,
          });
          setLastOrderId(orderId);
          setSessionOrderId(orderId);
        }
      } else {
        const orderId = await placeOrder.mutateAsync({
          mobileNumber: vehicleDetails.mobileNumber,
          carModel: vehicleDetails.carModel,
          carColour: vehicleDetails.carColour,
          carNumber: vehicleDetails.carNumber,
          items,
        });
        setLastOrderId(orderId);
        setSessionOrderId(orderId);
      }

      addToSessionTotal(grandTotal);
      clearCart();
      navigate({ to: "/order-confirmed" });
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to place order. Please try again.",
      );
    }
  };

  const isPending =
    placeOrder.isPending || appendToOrder.isPending || actorFetching;

  if (!vehicleDetails || cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
        <button
          type="button"
          data-ocid="checkout.secondary_button"
          onClick={() => navigate({ to: "/menu" })}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-accent"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-base">Order Summary</h1>
      </header>

      <main className="flex-1 px-4 py-5 pb-32 max-w-md mx-auto w-full">
        {/* Vehicle Info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/10 border border-secondary/20 rounded-2xl p-4 mb-5"
        >
          <h2 className="font-bold text-sm text-secondary mb-3 uppercase tracking-wide">
            Your Vehicle
          </h2>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <Car className="w-4 h-4 text-secondary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Model</p>
                <p className="font-semibold text-sm">
                  {vehicleDetails.carModel}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-secondary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Colour</p>
                <p className="font-semibold text-sm">
                  {vehicleDetails.carColour}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-secondary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Car Number</p>
                <p className="font-semibold text-sm">
                  {vehicleDetails.carNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Mobile</p>
                <p className="font-semibold text-sm">
                  {vehicleDetails.mobileNumber}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Items */}
        <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="font-bold text-base flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" /> Your Order
            </h2>
          </div>
          <div className="divide-y divide-border">
            {cart.map((item, idx) => {
              const addonTotal =
                item.addons?.reduce((s, a) => s + a.price, 0) ?? 0;
              const itemUnitPrice = item.price + addonTotal;
              const itemLineTotal = itemUnitPrice * item.quantity;
              return (
                <motion.div
                  key={`${item.menuItemId.toString()}-${idx}`}
                  data-ocid={`checkout.item.${idx + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-4 py-3 flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">
                      {item.name}
                    </p>
                    {item.addons && item.addons.length > 0 && (
                      <div className="mt-0.5 space-y-0.5">
                        {item.addons.map((a) => (
                          <p
                            key={a.addonId.toString()}
                            className="text-xs text-secondary"
                          >
                            + {a.name} ₹{a.price.toFixed(2)}
                          </p>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      ₹{itemUnitPrice.toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.menuItemId)}
                      className="w-7 h-7 rounded-full bg-secondary/15 text-secondary flex items-center justify-center text-sm font-bold"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-bold text-sm">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        addToCart({
                          menuItemId: item.menuItemId,
                          name: item.name,
                          price: item.price,
                          addons: item.addons,
                        })
                      }
                      className="w-7 h-7 rounded-full bg-secondary/15 text-secondary flex items-center justify-center text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-bold text-sm w-16 text-right">
                    ₹{itemLineTotal.toFixed(2)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bill Summary */}
        <div className="bg-card rounded-2xl border border-border shadow-xs p-4 mb-4">
          <h2 className="font-bold text-base mb-3">Bill Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST (5%)</span>
              <span className="font-semibold">₹{gst.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-base">
              <span className="font-bold">Grand Total</span>
              <span className="font-bold text-primary">
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <Button
          data-ocid="checkout.primary_button"
          onClick={handlePlaceOrder}
          disabled={isPending}
          className="w-full h-14 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Placing Order...
            </>
          ) : (
            "Place Order 🍽️"
          )}
        </Button>
      </main>
    </div>
  );
}
