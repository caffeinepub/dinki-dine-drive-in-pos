import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import {
  Banknote,
  Car,
  CheckCircle2,
  Phone,
  QrCode,
  Smartphone,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useGetPaymentSettings } from "../hooks/useQueries";

type PayMethod = "cash" | "phonepe" | "paytm";

function buildUpiQr(upiId: string, amount: number, name: string) {
  const uri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount.toFixed(2)}&cu=INR&tn=DinnerAtDinkiDine`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(uri)}`;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { vehicleDetails, sessionTotal, clearSession } = useAppContext();
  const { data: paymentSettings } = useGetPaymentSettings();
  const [method, setMethod] = useState<PayMethod | null>(null);
  const [paid, setPaid] = useState(false);

  const phonepeUpiId = paymentSettings?.[0] ?? "";
  const paytmUpiId = paymentSettings?.[1] ?? "";

  const handleDone = () => {
    clearSession();
    navigate({ to: "/" });
  };

  if (!vehicleDetails) {
    navigate({ to: "/" });
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-20">
        <h1 className="font-bold text-base text-center">
          Final Bill &amp; Payment
        </h1>
      </header>

      <main className="flex-1 px-4 py-5 pb-32 max-w-md mx-auto w-full space-y-4">
        {/* Vehicle Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/10 border border-secondary/20 rounded-2xl p-4"
        >
          <h2 className="font-bold text-sm text-secondary mb-3 uppercase tracking-wide">
            Your Vehicle
          </h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <Car className="w-4 h-4 text-secondary" />
              <div>
                <p className="text-xs text-muted-foreground">Vehicle</p>
                <p className="font-semibold text-sm">
                  {vehicleDetails.carColour} {vehicleDetails.carModel}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-secondary" />
              <div>
                <p className="text-xs text-muted-foreground">Mobile</p>
                <p className="font-semibold text-sm">
                  {vehicleDetails.mobileNumber}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bill Total */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-2xl border border-border shadow-sm p-5 text-center"
        >
          <p className="text-sm text-muted-foreground mb-1">
            Total Amount to Pay
          </p>
          <p className="text-4xl font-bold text-primary">
            ₹{sessionTotal.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Includes CGST 2.5% + SGST 2.5%
          </p>
        </motion.div>

        {/* Payment Method Selection */}
        {!paid && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border shadow-sm p-4"
          >
            <h2 className="font-bold text-base mb-4">Choose Payment Method</h2>
            <div className="grid grid-cols-3 gap-3">
              {/* Cash */}
              <button
                type="button"
                data-ocid="payment.toggle"
                onClick={() => setMethod("cash")}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  method === "cash"
                    ? "border-green-500 bg-green-50"
                    : "border-border hover:border-green-300"
                }`}
              >
                <Banknote
                  className={`w-7 h-7 ${method === "cash" ? "text-green-600" : "text-muted-foreground"}`}
                />
                <span
                  className={`text-xs font-semibold ${method === "cash" ? "text-green-700" : "text-foreground"}`}
                >
                  Cash
                </span>
              </button>

              {/* PhonePe */}
              <button
                type="button"
                data-ocid="payment.toggle"
                onClick={() => setMethod("phonepe")}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  method === "phonepe"
                    ? "border-purple-500 bg-purple-50"
                    : "border-border hover:border-purple-300"
                }`}
              >
                <Smartphone
                  className={`w-7 h-7 ${method === "phonepe" ? "text-purple-600" : "text-muted-foreground"}`}
                />
                <span
                  className={`text-xs font-semibold ${method === "phonepe" ? "text-purple-700" : "text-foreground"}`}
                >
                  PhonePe
                </span>
              </button>

              {/* Paytm */}
              <button
                type="button"
                data-ocid="payment.toggle"
                onClick={() => setMethod("paytm")}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  method === "paytm"
                    ? "border-blue-500 bg-blue-50"
                    : "border-border hover:border-blue-300"
                }`}
              >
                <QrCode
                  className={`w-7 h-7 ${method === "paytm" ? "text-blue-600" : "text-muted-foreground"}`}
                />
                <span
                  className={`text-xs font-semibold ${method === "paytm" ? "text-blue-700" : "text-foreground"}`}
                >
                  Paytm
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Cash Instructions */}
        {method === "cash" && !paid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center"
          >
            <Banknote className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="font-bold text-green-800 mb-1">Cash Payment</h3>
            <p className="text-sm text-green-700">
              Our staff will come to your vehicle and collect{" "}
              <strong>₹{sessionTotal.toFixed(2)}</strong> in cash.
            </p>
            <p className="text-xs text-green-600 mt-2">
              Please keep the exact amount ready if possible.
            </p>
            <Separator className="my-4 bg-green-200" />
            <Button
              data-ocid="payment.confirm_button"
              onClick={() => setPaid(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl h-12"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Staff Notified — Done
            </Button>
          </motion.div>
        )}

        {/* PhonePe QR */}
        {method === "phonepe" && !paid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-purple-50 border border-purple-200 rounded-2xl p-5 text-center"
          >
            <h3 className="font-bold text-purple-800 mb-1">Pay via PhonePe</h3>
            <p className="text-sm text-purple-600 mb-4">
              Scan QR code or use UPI ID below
            </p>
            {phonepeUpiId ? (
              <>
                <img
                  src={buildUpiQr(phonepeUpiId, sessionTotal, "Dinki Dine Veg")}
                  alt="PhonePe QR Code"
                  className="mx-auto w-52 h-52 rounded-xl mb-3"
                />
                <p className="text-xs text-purple-700 font-mono bg-purple-100 rounded-lg px-3 py-1.5 inline-block mb-4">
                  {phonepeUpiId}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">
                UPI ID not configured. Please ask staff for the QR code.
              </p>
            )}
            <Separator className="my-3 bg-purple-200" />
            <Button
              data-ocid="payment.confirm_button"
              onClick={() => setPaid(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl h-12"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />I Have Paid
            </Button>
          </motion.div>
        )}

        {/* Paytm QR */}
        {method === "paytm" && !paid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center"
          >
            <h3 className="font-bold text-blue-800 mb-1">Pay via Paytm</h3>
            <p className="text-sm text-blue-600 mb-4">
              Scan QR code or use UPI ID below
            </p>
            {paytmUpiId ? (
              <>
                <img
                  src={buildUpiQr(paytmUpiId, sessionTotal, "Dinki Dine Veg")}
                  alt="Paytm QR Code"
                  className="mx-auto w-52 h-52 rounded-xl mb-3"
                />
                <p className="text-xs text-blue-700 font-mono bg-blue-100 rounded-lg px-3 py-1.5 inline-block mb-4">
                  {paytmUpiId}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">
                UPI ID not configured. Please ask staff for the QR code.
              </p>
            )}
            <Separator className="my-3 bg-blue-200" />
            <Button
              data-ocid="payment.confirm_button"
              onClick={() => setPaid(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-12"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />I Have Paid
            </Button>
          </motion.div>
        )}

        {/* Thank You / End Session */}
        {paid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-center py-6"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-muted-foreground text-sm mb-6">
              We hope you enjoyed your meal at Dinki Dine Veg. Drive safe!
            </p>
            <Button
              data-ocid="payment.primary_button"
              onClick={handleDone}
              className="w-full h-12 font-bold rounded-xl bg-primary text-primary-foreground"
            >
              End Session
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
