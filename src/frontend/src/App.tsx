import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AdminLayout from "./components/AdminLayout";
import { AppProvider } from "./context/AppContext";
import CheckoutPage from "./pages/CheckoutPage";
import MenuPage from "./pages/MenuPage";
import OrderConfirmedPage from "./pages/OrderConfirmedPage";
import PaymentPage from "./pages/PaymentPage";
import VehicleFormPage from "./pages/VehicleFormPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminMenuPage from "./pages/admin/AdminMenuPage";

const rootRoute = createRootRoute({
  component: () => (
    <AppProvider>
      <Outlet />
      <Toaster richColors position="top-center" />
    </AppProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: VehicleFormPage,
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/menu",
  component: MenuPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const orderConfirmedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order-confirmed",
  component: OrderConfirmedPage,
});

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment",
  component: PaymentPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: AdminLoginPage,
});

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin",
  component: AdminLayout,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/dashboard",
  component: AdminDashboardPage,
});

const adminMenuRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/menu",
  component: AdminMenuPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  menuRoute,
  checkoutRoute,
  orderConfirmedRoute,
  paymentRoute,
  adminLoginRoute,
  adminLayoutRoute.addChildren([adminDashboardRoute, adminMenuRoute]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
