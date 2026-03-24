import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  Car,
  CheckCircle2,
  Phone,
  Receipt,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { playBeep } from "../utils/beep";

export default function OrderConfirmedPage() {
  const navigate = useNavigate();
  const { lastOrderId } = useAppContext();

  useEffect(() => {
    playBeep("confirm");
  }, []);

  const handleOrderMore = () => {
    navigate({ to: "/menu" });
  };

  const handleRequestBill = () => {
    navigate({ to: "/payment" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="max-w-sm w-full text-center"
      >
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-14 h-14 text-primary" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          Order Placed! 🎉
        </h1>
        <p className="text-muted-foreground text-sm mb-2">
          Your order has been received by our kitchen.
        </p>

        {lastOrderId !== null && (
          <div className="bg-primary/10 rounded-2xl px-5 py-3 mb-5 inline-block">
            <p className="text-xs text-muted-foreground">Order Number</p>
            <p className="text-2xl font-bold text-primary">
              #{lastOrderId.toString()}
            </p>
          </div>
        )}

        <div className="bg-card rounded-2xl border border-border p-4 mb-6 text-left">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Delivery To
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Car className="w-4 h-4 text-secondary" />
            <span className="font-medium">
              Our staff will bring your order to your vehicle.
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-2">
            <Phone className="w-4 h-4 text-secondary" />
            <span className="text-muted-foreground">
              We may call you if needed.
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            data-ocid="confirmed.secondary_button"
            onClick={handleOrderMore}
            variant="outline"
            className="w-full h-12 font-bold rounded-xl border-primary text-primary hover:bg-primary/5"
          >
            <UtensilsCrossed className="w-4 h-4 mr-2" />
            Order More Items
          </Button>
          <Button
            data-ocid="confirmed.primary_button"
            onClick={handleRequestBill}
            className="w-full h-12 font-bold rounded-xl bg-green-600 hover:bg-green-700 text-white"
          >
            <Receipt className="w-4 h-4 mr-2" />
            Request Final Bill &amp; Pay
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
