import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  ChefHat,
  LayoutDashboard,
  LogOut,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clear, identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  useEffect(() => {
    if (!isInitializing && !isLoading) {
      if (!identity || isAdmin === false) {
        navigate({ to: "/admin/login" });
      }
    }
  }, [identity, isAdmin, isInitializing, isLoading, navigate]);

  const navItems = [
    { path: "/admin/dashboard", label: "Live Orders", icon: LayoutDashboard },
    { path: "/admin/menu", label: "Menu Management", icon: UtensilsCrossed },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-16 md:w-56 bg-sidebar flex flex-col flex-shrink-0">
        <div className="px-3 md:px-4 py-5 flex items-center gap-3 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <ChefHat className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="hidden md:block">
            <p className="font-bold text-sidebar-foreground text-sm leading-tight">
              Dinki Dine
            </p>
            <p className="text-sidebar-foreground/50 text-xs">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-2 md:px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                type="button"
                key={item.path}
                data-ocid="admin.link"
                onClick={() => navigate({ to: item.path })}
                className={`w-full flex items-center gap-3 px-2 md:px-3 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="hidden md:block text-sm font-semibold">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="px-2 md:px-3 py-4 border-t border-sidebar-border">
          <button
            type="button"
            data-ocid="admin.secondary_button"
            onClick={clear}
            className="w-full flex items-center gap-3 px-2 md:px-3 py-2.5 rounded-xl text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="hidden md:block text-sm font-semibold">
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
