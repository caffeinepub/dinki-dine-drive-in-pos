import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { Car, ChefHat, Palette, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";

const CAR_COLOURS = [
  "White",
  "Red",
  "Black",
  "Silver",
  "Blue",
  "Grey",
  "Brown",
  "Yellow",
  "Orange",
];

export default function VehicleFormPage() {
  const navigate = useNavigate();
  const { setVehicleDetails } = useAppContext();
  const [mobileNumber, setMobileNumber] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carColour, setCarColour] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!mobileNumber || mobileNumber.length < 10)
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    if (!carModel.trim()) newErrors.carModel = "Please enter your car model";
    if (!carColour) newErrors.carColour = "Please select your car colour";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setVehicleDetails({ mobileNumber, carModel: carModel.trim(), carColour });
    navigate({ to: "/menu" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <ChefHat className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-base text-foreground leading-tight">
            Dinki Dine Veg
          </h1>
          <p className="text-xs text-muted-foreground">
            Mangalore's Finest Vegetarian
          </p>
        </div>
        <div className="ml-auto">
          <span className="text-xs font-medium bg-secondary/10 text-secondary px-2 py-1 rounded-full">
            Drive-In
          </span>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-secondary px-6 py-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-secondary-foreground tracking-tight">
            Dinki Dine Veg
          </h2>
          <p className="text-secondary-foreground/80 mt-1 text-sm font-medium">
            Drive-In Ordering
          </p>
          <p className="text-secondary-foreground/70 mt-2 text-xs">
            Park. Scan. Order. Enjoy 🌿
          </p>
        </motion.div>
      </div>

      {/* Form */}
      <motion.main
        className="flex-1 px-4 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-2xl shadow-card p-5 border border-border">
            <h3 className="font-bold text-lg text-foreground mb-1">
              Your Vehicle Details
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              We use this to identify and deliver your order to the right car.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mobile */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="mobile"
                  className="font-semibold text-sm flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-secondary" /> Mobile Number
                </Label>
                <Input
                  id="mobile"
                  data-ocid="vehicle.input"
                  type="tel"
                  inputMode="numeric"
                  placeholder="e.g. 9876543210"
                  value={mobileNumber}
                  onChange={(e) =>
                    setMobileNumber(
                      e.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  className="h-12 text-base rounded-xl border-border"
                  autoComplete="tel"
                  name="mobile"
                />
                {errors.mobile && (
                  <p
                    data-ocid="vehicle.error_state"
                    className="text-xs text-destructive"
                  >
                    {errors.mobile}
                  </p>
                )}
              </div>

              {/* Car Model */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="carModel"
                  className="font-semibold text-sm flex items-center gap-1.5"
                >
                  <Car className="w-4 h-4 text-secondary" /> Car Model
                </Label>
                <Input
                  id="carModel"
                  data-ocid="vehicle.input"
                  type="text"
                  placeholder="e.g. Swift, Innova, i20"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  className="h-12 text-base rounded-xl border-border"
                  autoComplete="off"
                  name="carModel"
                />
                {errors.carModel && (
                  <p className="text-xs text-destructive">{errors.carModel}</p>
                )}
              </div>

              {/* Car Colour */}
              <div className="space-y-1.5">
                <Label className="font-semibold text-sm flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-secondary" /> Car Colour
                </Label>
                <Select value={carColour} onValueChange={setCarColour}>
                  <SelectTrigger
                    data-ocid="vehicle.select"
                    className="h-12 text-base rounded-xl border-border"
                  >
                    <SelectValue placeholder="Select colour" />
                  </SelectTrigger>
                  <SelectContent>
                    {CAR_COLOURS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.carColour && (
                  <p className="text-xs text-destructive">{errors.carColour}</p>
                )}
              </div>

              <Button
                type="submit"
                data-ocid="vehicle.primary_button"
                className="w-full h-14 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground mt-2"
              >
                Start Ordering 🍽️
              </Button>
            </form>
          </div>

          {/* Admin link */}
          <p className="text-center mt-4 text-xs text-muted-foreground">
            Restaurant staff?{" "}
            <a
              href="/admin/login"
              className="text-primary font-semibold hover:underline"
              data-ocid="vehicle.link"
            >
              Admin Panel
            </a>
          </p>
        </div>
      </motion.main>

      <footer className="py-4 text-center text-xs text-muted-foreground">
        © {currentYear}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Built with ❤️ using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
