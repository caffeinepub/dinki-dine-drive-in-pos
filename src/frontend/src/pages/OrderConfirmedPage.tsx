import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Car, CheckCircle2, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";

export default function OrderConfirmedPage() {
  const navigate = useNavigate();
  const { lastOrderId } = useAppContext();

  const handleOrderMore = () => {
    navigate({ to: "/" });
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

        <Button
          data-ocid="confirmed.primary_button"
          onClick={handleOrderMore}
          className="w-full h-12 font-bold rounded-xl bg-primary text-primary-foreground"
        >
          Done
        </Button>
      </motion.div>
    </div>
  );
}
