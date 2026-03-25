import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  Car,
  Clock,
  FileText,
  FlaskConical,
  PackageCheck,
  Phone,
  RefreshCw,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Order } from "../../backend";
import { useGetOrders, useUpdateOrderStatus } from "../../hooks/useQueries";
import { playBeep } from "../../utils/beep";

const STATUS_ORDER = ["Received", "Preparing", "Ready", "Delivered"];

function statusColor(status: string) {
  switch (status) {
    case "Received":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Preparing":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Ready":
      return "bg-green-100 text-green-700 border-green-200";
    case "Delivered":
      return "bg-gray-100 text-gray-500 border-gray-200";
    default:
      return "bg-gray-100 text-gray-500 border-gray-200";
  }
}

function timeAgo(createdAt: bigint) {
  const ms = Number(createdAt / 1_000_000n);
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

function nextStatus(current: string) {
  const idx = STATUS_ORDER.indexOf(current);
  return idx < STATUS_ORDER.length - 1 ? STATUS_ORDER[idx + 1] : null;
}

// --- Demo data ---
const _DEMO_STATUSES = ["Received", "Preparing", "Ready", "Delivered"];

interface DemoOrder {
  id: string;
  mobileNumber: string;
  carModel: string;
  carColour: string;
  status: string;
  createdAt: bigint;
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
    addons: { addonId: number; name: string; price: number }[];
  }[];
}

const DEMO_ORDERS: DemoOrder[] = [
  {
    id: "101",
    mobileNumber: "9876543210",
    carModel: "Swift",
    carColour: "White",
    status: "Received",
    createdAt: BigInt(Date.now() - 3 * 60 * 1000) * 1_000_000n,
    total: 360,
    items: [
      {
        name: "Masala Dosa",
        quantity: 2,
        price: 90,
        addons: [{ addonId: 1, name: "Extra Chutney", price: 10 }],
      },
      {
        name: "Filter Coffee",
        quantity: 2,
        price: 40,
        addons: [],
      },
      {
        name: "Kesari Bath",
        quantity: 1,
        price: 70,
        addons: [],
      },
    ],
  },
  {
    id: "102",
    mobileNumber: "9123456789",
    carModel: "Innova",
    carColour: "Silver",
    status: "Preparing",
    createdAt: BigInt(Date.now() - 8 * 60 * 1000) * 1_000_000n,
    total: 520,
    items: [
      {
        name: "Idli (3 pcs)",
        quantity: 2,
        price: 60,
        addons: [{ addonId: 2, name: "Ghee", price: 15 }],
      },
      {
        name: "Veg Uttapam",
        quantity: 2,
        price: 100,
        addons: [],
      },
      {
        name: "Mango Lassi",
        quantity: 2,
        price: 80,
        addons: [],
      },
    ],
  },
  {
    id: "103",
    mobileNumber: "9988776655",
    carModel: "Creta",
    carColour: "Red",
    status: "Ready",
    createdAt: BigInt(Date.now() - 15 * 60 * 1000) * 1_000_000n,
    total: 290,
    items: [
      {
        name: "Poha",
        quantity: 2,
        price: 55,
        addons: [],
      },
      {
        name: "Upma",
        quantity: 1,
        price: 60,
        addons: [{ addonId: 3, name: "Extra Pickle", price: 5 }],
      },
      {
        name: "Chai",
        quantity: 3,
        price: 30,
        addons: [],
      },
    ],
  },
  {
    id: "100",
    mobileNumber: "9000011111",
    carModel: "Baleno",
    carColour: "Blue",
    status: "Delivered",
    createdAt: BigInt(Date.now() - 35 * 60 * 1000) * 1_000_000n,
    total: 210,
    items: [
      {
        name: "Puri Bhaji",
        quantity: 2,
        price: 80,
        addons: [],
      },
      {
        name: "Lassi",
        quantity: 1,
        price: 50,
        addons: [],
      },
    ],
  },
];

function DemoOrderCard({
  order,
  idx,
  onStatusAdvance,
}: {
  order: DemoOrder;
  idx: number;
  onStatusAdvance: (id: string, newStatus: string) => void;
}) {
  const next = nextStatus(order.status);
  const repeatCount = 1;

  const handleAdvance = () => {
    if (!next) return;
    onStatusAdvance(order.id, next);
    toast.success(`Order #${order.id} → ${next}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className={`bg-card rounded-2xl border shadow-xs p-4 ${
        order.status === "Received" ? "border-primary/40" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-lg text-foreground">Order #{order.id}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <Clock className="w-3 h-3" />
            <span>{timeAgo(order.createdAt)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColor(order.status)}`}
          >
            {order.status}
          </span>
          {repeatCount > 1 && (
            <Badge
              variant="outline"
              className="text-xs gap-1 border-amber-300 text-amber-700 bg-amber-50"
            >
              <Users className="w-3 h-3" />
              {repeatCount} orders from this number
            </Badge>
          )}
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="flex gap-3 mb-3 bg-muted rounded-xl p-2.5">
        <div className="flex items-center gap-1.5 flex-1">
          <Car className="w-4 h-4 text-secondary flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Vehicle</p>
            <p className="font-semibold text-sm">
              {order.carColour} {order.carModel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Mobile</p>
            <p className="font-semibold text-sm">{order.mobileNumber}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1.5 mb-4">
        {order.items.map((item, itemIdx) => (
          <div key={`${itemIdx}-${item.name}`}>
            <div className="flex justify-between text-sm">
              <span className="text-foreground">
                {item.name}{" "}
                <span className="text-muted-foreground">× {item.quantity}</span>
              </span>
              <span className="font-medium">
                ₹{(item.price * item.quantity).toFixed(0)}
              </span>
            </div>
            {item.addons && item.addons.length > 0 && (
              <div className="ml-2 space-y-0.5 mt-0.5">
                {item.addons.map((addon) => (
                  <p key={addon.addonId} className="text-xs text-secondary">
                    + {addon.name} ₹{addon.price.toFixed(2)}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-between text-sm font-bold border-t border-border pt-1.5 mt-1.5">
          <span>Total</span>
          <span className="text-primary">₹{order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-xl gap-1.5"
          onClick={() => toast.info("Demo mode: invoice not available")}
        >
          <FileText className="w-4 h-4" />
          Print Bill
        </Button>
        {next && (
          <Button
            onClick={handleAdvance}
            size="sm"
            className="flex-1 rounded-xl bg-primary text-primary-foreground font-semibold"
          >
            <PackageCheck className="w-4 h-4 mr-1.5" />
            Mark as {next}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

function OrderCard({
  order,
  idx,
  repeatCount,
}: {
  order: Order;
  idx: number;
  repeatCount: number;
}) {
  const updateStatus = useUpdateOrderStatus();
  const navigate = useNavigate();
  const next = nextStatus(order.status);

  const handleAdvance = async () => {
    if (!next) return;
    try {
      await updateStatus.mutateAsync({ orderId: order.id, status: next });
      toast.success(`Order #${order.id} → ${next}`);
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const handlePrintBill = () => {
    navigate({ to: `/admin/invoice/${order.id.toString()}` });
  };

  return (
    <motion.div
      data-ocid={`orders.item.${idx + 1}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className={`bg-card rounded-2xl border shadow-xs p-4 ${
        order.status === "Received" ? "border-primary/40" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-lg text-foreground">
            Order #{order.id.toString()}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <Clock className="w-3 h-3" />
            <span>{timeAgo(order.createdAt)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColor(order.status)}`}
          >
            {order.status}
          </span>
          {repeatCount > 1 && (
            <Badge
              variant="outline"
              className="text-xs gap-1 border-amber-300 text-amber-700 bg-amber-50"
            >
              <Users className="w-3 h-3" />
              {repeatCount} orders from this number
            </Badge>
          )}
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="flex gap-3 mb-3 bg-muted rounded-xl p-2.5">
        <div className="flex items-center gap-1.5 flex-1">
          <Car className="w-4 h-4 text-secondary flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Vehicle</p>
            <p className="font-semibold text-sm">
              {order.carColour} {order.carModel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Mobile</p>
            <p className="font-semibold text-sm">{order.mobileNumber}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1.5 mb-4">
        {order.items.map((item, itemIdx) => (
          <div key={`${itemIdx}-${item.name}`}>
            <div className="flex justify-between text-sm">
              <span className="text-foreground">
                {item.name}{" "}
                <span className="text-muted-foreground">
                  × {item.quantity.toString()}
                </span>
              </span>
              <span className="font-medium">
                ₹{(item.price * Number(item.quantity)).toFixed(0)}
              </span>
            </div>
            {item.addons && item.addons.length > 0 && (
              <div className="ml-2 space-y-0.5 mt-0.5">
                {item.addons.map((addon) => (
                  <p
                    key={addon.addonId.toString()}
                    className="text-xs text-secondary"
                  >
                    + {addon.name} ₹{addon.price.toFixed(2)}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-between text-sm font-bold border-t border-border pt-1.5 mt-1.5">
          <span>Total</span>
          <span className="text-primary">₹{order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          data-ocid={`orders.secondary_button.${idx + 1}`}
          variant="outline"
          size="sm"
          className="flex-1 rounded-xl gap-1.5"
          onClick={handlePrintBill}
        >
          <FileText className="w-4 h-4" />
          Print Bill
        </Button>
        {next && (
          <Button
            data-ocid={`orders.button.${idx + 1}`}
            onClick={handleAdvance}
            disabled={updateStatus.isPending}
            size="sm"
            className="flex-1 rounded-xl bg-primary text-primary-foreground font-semibold"
          >
            <PackageCheck className="w-4 h-4 mr-1.5" />
            Mark as {next}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const { data: orders, isLoading, refetch, isFetching } = useGetOrders();
  const [demoMode, setDemoMode] = useState(false);
  const [demoOrders, setDemoOrders] = useState<DemoOrder[]>(DEMO_ORDERS);

  const activeOrders = orders?.filter((o) => o.status !== "Delivered") ?? [];
  const delivered = orders?.filter((o) => o.status === "Delivered") ?? [];

  const activeDemoOrders = demoOrders.filter((o) => o.status !== "Delivered");
  const deliveredDemoOrders = demoOrders.filter(
    (o) => o.status === "Delivered",
  );

  const knownOrderIds = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!orders) return;

    const incoming = orders.filter((o) => o.status === "Received");

    if (isFirstLoad.current) {
      for (const o of incoming) knownOrderIds.current.add(o.id.toString());
      isFirstLoad.current = false;
      return;
    }

    const newOrders = incoming.filter(
      (o) => !knownOrderIds.current.has(o.id.toString()),
    );

    if (newOrders.length > 0) {
      playBeep("alert");
      toast.info(
        `${newOrders.length} new order${newOrders.length > 1 ? "s" : ""} received!`,
      );
      for (const o of newOrders) knownOrderIds.current.add(o.id.toString());
    }
  }, [orders]);

  const mobileCountMap = activeOrders.reduce<Record<string, number>>(
    (acc, o) => {
      acc[o.mobileNumber] = (acc[o.mobileNumber] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const handleDemoStatusAdvance = (id: string, newStatus: string) => {
    setDemoOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    );
  };

  // Show demo mode when no real orders and not loading
  const showEmptyState = !isLoading && activeOrders.length === 0 && !demoMode;

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Live Orders
            </h1>
            {demoMode && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-300">
                DEMO
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">
            {demoMode
              ? "Sample orders for preview — not real data"
              : "Auto-refreshes every 10 seconds"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!demoMode && (
            <button
              type="button"
              data-ocid="orders.secondary_button"
              onClick={() => refetch()}
              className="p-2 rounded-xl hover:bg-accent transition-colors"
              title="Refresh"
            >
              <RefreshCw
                className={`w-5 h-5 text-muted-foreground ${
                  isFetching ? "animate-spin" : ""
                }`}
              />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setDemoMode((v) => !v);
              setDemoOrders(DEMO_ORDERS);
            }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
              demoMode
                ? "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200"
                : "bg-muted text-muted-foreground border-border hover:bg-accent"
            }`}
            title={demoMode ? "Exit demo mode" : "Preview with sample orders"}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            {demoMode ? "Exit Demo" : "Preview"}
          </button>
        </div>
      </div>

      {demoMode ? (
        <>
          {activeDemoOrders.length === 0 ? (
            <div className="text-center py-20">
              <Car className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-bold text-muted-foreground">
                All demo orders delivered!
              </h2>
              <button
                type="button"
                onClick={() => setDemoOrders(DEMO_ORDERS)}
                className="mt-3 text-sm text-primary underline"
              >
                Reset demo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {activeDemoOrders.map((order, idx) => (
                <DemoOrderCard
                  key={order.id}
                  order={order}
                  idx={idx}
                  onStatusAdvance={handleDemoStatusAdvance}
                />
              ))}
            </div>
          )}
          {deliveredDemoOrders.length > 0 && (
            <details className="mt-6">
              <summary className="text-sm font-semibold text-muted-foreground cursor-pointer select-none mb-3">
                Delivered Orders ({deliveredDemoOrders.length})
              </summary>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
                {deliveredDemoOrders.map((order, idx) => (
                  <DemoOrderCard
                    key={order.id}
                    order={order}
                    idx={idx}
                    onStatusAdvance={handleDemoStatusAdvance}
                  />
                ))}
              </div>
            </details>
          )}
        </>
      ) : isLoading ? (
        <div
          data-ocid="orders.loading_state"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border p-4"
            >
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-20 mb-4" />
              <Skeleton className="h-16 w-full mb-3 rounded-xl" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-9 w-full rounded-xl mt-3" />
            </div>
          ))}
        </div>
      ) : showEmptyState ? (
        <div data-ocid="orders.empty_state" className="text-center py-20">
          <Car className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-bold text-muted-foreground">
            No Active Orders
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            New orders will appear here automatically.
          </p>
          <button
            type="button"
            onClick={() => setDemoMode(true)}
            className="mt-4 flex items-center gap-1.5 mx-auto text-sm font-semibold px-4 py-2 rounded-xl bg-muted text-muted-foreground border border-border hover:bg-accent transition-colors"
          >
            <FlaskConical className="w-4 h-4" />
            Preview with sample orders
          </button>
        </div>
      ) : (
        <>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            data-ocid="orders.list"
          >
            {activeOrders.map((order, idx) => (
              <OrderCard
                key={order.id.toString()}
                order={order}
                idx={idx}
                repeatCount={mobileCountMap[order.mobileNumber] ?? 1}
              />
            ))}
          </div>
          {delivered.length > 0 && (
            <details className="mt-6">
              <summary className="text-sm font-semibold text-muted-foreground cursor-pointer select-none mb-3">
                Delivered Orders ({delivered.length})
              </summary>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
                {delivered.map((order, idx) => (
                  <OrderCard
                    key={order.id.toString()}
                    order={order}
                    idx={idx}
                    repeatCount={1}
                  />
                ))}
              </div>
            </details>
          )}
        </>
      )}
    </div>
  );
}
