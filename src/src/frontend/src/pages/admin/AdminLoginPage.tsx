import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ChefHat, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../../hooks/useQueries";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const {
    login,
    clear,
    identity,
    isLoggingIn,
    isLoginSuccess,
    isInitializing,
  } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  useEffect(() => {
    if (isLoginSuccess && isAdmin === true) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [isLoginSuccess, isAdmin, navigate]);

  const isLoggedIn = !!identity;
  const showAccessDenied = isLoggedIn && isAdmin === false && !adminLoading;

  return (
    <div className="min-h-screen bg-sidebar flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-sm w-full"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-3">
            <ChefHat className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-sidebar-foreground">
            Admin Panel
          </h1>
          <p className="text-sidebar-foreground/60 text-sm mt-1">
            Dinki Dine Veg — Drive-In POS
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
          {isInitializing ? (
            <div
              data-ocid="admin_login.loading_state"
              className="flex justify-center py-4"
            >
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : showAccessDenied ? (
            <div data-ocid="admin_login.error_state" className="text-center">
              <ShieldCheck className="w-12 h-12 text-destructive mx-auto mb-3" />
              <h2 className="font-bold text-lg text-foreground mb-1">
                Access Denied
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Your account does not have admin privileges.
              </p>
              <Button
                data-ocid="admin_login.cancel_button"
                variant="outline"
                onClick={clear}
                className="w-full rounded-xl"
              >
                Sign Out
              </Button>
            </div>
          ) : isLoggedIn && adminLoading ? (
            <div
              data-ocid="admin_login.loading_state"
              className="flex flex-col items-center py-4 gap-2"
            >
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Verifying admin access…
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-bold text-xl text-foreground mb-1">
                Staff Login
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Sign in with your Internet Identity to access the admin panel.
              </p>
              <Button
                data-ocid="admin_login.primary_button"
                onClick={login}
                disabled={isLoggingIn}
                className="w-full h-12 font-bold rounded-xl bg-primary text-primary-foreground"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                    in…
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </>
          )}
        </div>

        <p className="text-center mt-4 text-xs text-sidebar-foreground/40">
          <a href="/" className="hover:underline">
            ← Back to Customer Ordering
          </a>
        </p>
      </motion.div>
    </div>
  );
}
