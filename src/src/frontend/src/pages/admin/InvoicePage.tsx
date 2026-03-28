import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, FileText, Printer } from "lucide-react";
import { useGetOrders } from "../../hooks/useQueries";

// --- Demo Data ---
const DEMO_INVOICE = {
  id: "42",
  date: new Date(),
  mobile: "9876543210",
  carModel: "Swift Dzire",
  carColour: "White",
  carNumber: "KA 01 AB 1234",
  items: [
    {
      name: "Masala Dosa",
      quantity: 2,
      rate: 80,
      addons: [{ name: "Extra Chutney", price: 10 }],
    },
    {
      name: "Filter Coffee",
      quantity: 2,
      rate: 30,
      addons: [{ name: "Extra Chutney", price: 10 }],
    },
    {
      name: "Idli (3 pcs)",
      quantity: 1,
      rate: 60,
      addons: [{ name: "Sambar", price: 15 }],
    },
    {
      name: "Vada",
      quantity: 2,
      rate: 40,
      addons: [{ name: "Sambar", price: 15 }],
    },
  ],
};

function formatDate(d: Date) {
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type InvoiceItem = {
  name: string;
  quantity: number;
  rate: number;
  addons: { name: string; price: number }[];
};

function InvoiceView({
  id,
  date,
  mobile,
  carModel,
  carColour,
  carNumber,
  items,
}: {
  id: string;
  date: Date;
  mobile: string;
  carModel: string;
  carColour: string;
  carNumber: string;
  items: InvoiceItem[];
}) {
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => {
    const itemTotal = item.rate * item.quantity;
    const addonTotal = item.addons.reduce(
      (s, a) => s + a.price * item.quantity,
      0,
    );
    return sum + itemTotal + addonTotal;
  }, 0);
  const gst = subtotal * 0.05;
  const grandTotal = subtotal + gst;

  return (
    <div className="min-h-screen bg-muted/40 py-8 px-4">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-shadow { box-shadow: none !important; }
        }
      `}</style>

      {/* Toolbar */}
      <div className="no-print max-w-[480px] mx-auto flex gap-2 mb-4">
        <Button
          data-ocid="invoice.back_button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => navigate({ to: "/admin/dashboard" })}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <Button
          data-ocid="invoice.print_button"
          size="sm"
          className="gap-1.5 ml-auto"
          onClick={() => window.print()}
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF
        </Button>
      </div>

      {/* Invoice Card */}
      <div
        data-ocid="invoice.card"
        className="print-shadow max-w-[480px] mx-auto bg-white border border-border rounded-2xl shadow-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground text-center py-6 px-4">
          <h1 className="text-2xl font-bold tracking-widest font-display">
            DINKI DINE VEG
          </h1>
          <p className="text-sm mt-0.5 opacity-90">Drive-In Restaurant</p>
          <p className="text-xs mt-0.5 opacity-80">
            Kadri Park Road, Kadri Hill
          </p>
          <p className="text-xs opacity-80">Mangalore - 575004</p>
          <p className="text-xs mt-0.5 opacity-70">
            Ph: +91 94482 41023 | 0824-2988813
          </p>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Dotted divider */}
          <div className="border-t-2 border-dashed border-border" />

          {/* Order Info */}
          <div className="grid grid-cols-2 gap-y-1.5 text-sm">
            <span className="text-muted-foreground">Invoice #</span>
            <span className="font-semibold text-right">{id}</span>
            <span className="text-muted-foreground">Date & Time</span>
            <span className="font-semibold text-right text-xs">
              {formatDate(date)}
            </span>
            <span className="text-muted-foreground">Mobile</span>
            <span className="font-semibold text-right">{mobile}</span>
            <span className="text-muted-foreground">Vehicle</span>
            <span className="font-semibold text-right">
              {carColour} {carModel}
            </span>
            <span className="text-muted-foreground">Car Number</span>
            <span className="font-semibold text-right">{carNumber}</span>
          </div>

          <div className="border-t-2 border-dashed border-border" />

          {/* KOT Section Header */}
          <div className="text-center">
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Order Details (KOT)
            </p>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-2 text-xs font-bold uppercase tracking-wide text-muted-foreground border-b border-border pb-1.5">
            <span>Item</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Rate</span>
            <span className="text-right">Amt</span>
          </div>

          {/* Items */}
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.name}>
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-2 text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-right text-muted-foreground">
                    {item.quantity}
                  </span>
                  <span className="text-right text-muted-foreground">
                    ₹{item.rate}
                  </span>
                  <span className="text-right font-semibold">
                    ₹{(item.rate * item.quantity).toFixed(0)}
                  </span>
                </div>
                {item.addons.map((addon) => (
                  <div
                    key={addon.name}
                    className="grid grid-cols-[1fr_auto_auto_auto] gap-x-2 text-xs text-secondary pl-3 mt-0.5"
                  >
                    <span>+ {addon.name}</span>
                    <span className="text-right">{item.quantity}</span>
                    <span className="text-right">₹{addon.price}</span>
                    <span className="text-right">
                      ₹{(addon.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="border-t-2 border-dashed border-border" />

          {/* Totals */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST @ 5%</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-1">
              <span>Grand Total</span>
              <span className="text-primary text-lg">
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-border" />

          {/* Footer */}
          <div className="text-center space-y-1 pb-2">
            <p className="text-sm font-semibold text-foreground">
              🙏 Thank you for dining with us!
            </p>
            <p className="text-xs text-muted-foreground">
              Dinki Dine Veg — Kadri Park Road, Mangalore 575004
            </p>
          </div>
        </div>
      </div>

      {/* Bottom branding */}
      <p className="no-print text-center text-xs text-muted-foreground mt-6">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Built with love using caffeine.ai
        </a>
      </p>
    </div>
  );
}

export default function InvoicePage() {
  const { orderId } = useParams({ strict: false });
  const { data: orders } = useGetOrders();

  // Demo mode
  if (orderId === "demo") {
    return (
      <InvoiceView
        id={DEMO_INVOICE.id}
        date={DEMO_INVOICE.date}
        mobile={DEMO_INVOICE.mobile}
        carModel={DEMO_INVOICE.carModel}
        carColour={DEMO_INVOICE.carColour}
        carNumber={DEMO_INVOICE.carNumber}
        items={DEMO_INVOICE.items}
      />
    );
  }

  const order = orders?.find((o) => o.id.toString() === orderId);

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">Order not found</p>
        </div>
      </div>
    );
  }

  const items: InvoiceItem[] = order.items.map((item) => ({
    name: item.name,
    quantity: Number(item.quantity),
    rate: item.price,
    addons: (item.addons ?? []).map((a) => ({ name: a.name, price: a.price })),
  }));

  return (
    <InvoiceView
      id={order.id.toString()}
      date={new Date(Number(order.createdAt / 1_000_000n))}
      mobile={order.mobileNumber}
      carModel={order.carModel}
      carColour={order.carColour}
      carNumber={order.carNumber}
      items={items}
    />
  );
}
