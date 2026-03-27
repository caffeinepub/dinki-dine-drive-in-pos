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
import { Car, ChefHat, Hash, Palette, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
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
  const { setVehicleDetails, vehicleDetails } = useAppContext();
  const [mobileNumber, setMobileNumber] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carColour, setCarColour] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // If vehicle details already exist (restored from localStorage), skip to menu
  useEffect(() => {
    if (vehicleDetails) {
      navigate({ to: "/menu" });
    }
  }, [vehicleDetails, navigate]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!mobileNumber || mobileNumber.length < 10)
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    if (!carModel.trim()) newErrors.carModel = "Please enter your car model";
    if (!carColour) newErrors.carColour = "Please select your car colour";
    if (!carNumber.trim()) newErrors.carNumber = "Please enter your car number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setVehicleDetails({
      mobileNumber,
      carModel: carModel.trim(),
      carColour,
      carNumber: carNumber.trim().toUpperCase(),
    });
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
          <h1 className="font-bold text-lg text-foreground leading-none">
            Dinki Dine Veg
          </h1>
          <p className="text-xs text-muted-foreground">Drive-In Ordering</p>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 py-6 max-w-sm mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-foreground">Welcome! 🚗</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Enter your vehicle details to start ordering.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mobile */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-sm font-semibold">
                <Phone className="w-4 h-4 text-primary" /> Mobile Number
              </Label>
              <Input
                data-ocid="vehicle.input"
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="10-digit mobile number"
                maxLength={10}
                className="h-12 rounded-xl text-base"
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
              <Label className="flex items-center gap-1.5 text-sm font-semibold">
                <Car className="w-4 h-4 text-primary" /> Car Model
              </Label>
              <Input
                data-ocid="vehicle.input"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                placeholder="e.g. Maruti Swift, Honda City"
                className="h-12 rounded-xl text-base"
              />
              {errors.carModel && (
                <p
                  data-ocid="vehicle.error_state"
                  className="text-xs text-destructive"
                >
                  {errors.carModel}
                </p>
              )}
            </div>

            {/* Car Colour */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-sm font-semibold">
                <Palette className="w-4 h-4 text-primary" /> Car Colour
              </Label>
              <Select value={carColour} onValueChange={setCarColour}>
                <SelectTrigger
                  data-ocid="vehicle.select"
                  className="h-12 rounded-xl text-base"
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
                <p
                  data-ocid="vehicle.error_state"
                  className="text-xs text-destructive"
                >
                  {errors.carColour}
                </p>
              )}
            </div>

            {/* Car Number */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-sm font-semibold">
                <Hash className="w-4 h-4 text-primary" /> Car Number
              </Label>
              <Input
                data-ocid="vehicle.input"
                value={carNumber}
                onChange={(e) => setCarNumber(e.target.value)}
                placeholder="e.g. KA 01 AB 1234"
                className="h-12 rounded-xl text-base uppercase"
              />
              {errors.carNumber && (
                <p
                  data-ocid="vehicle.error_state"
                  className="text-xs text-destructive"
                >
                  {errors.carNumber}
                </p>
              )}
            </div>

            <Button
              data-ocid="vehicle.submit_button"
              type="submit"
              className="w-full h-14 text-base font-bold rounded-xl mt-2"
            >
              Start Ordering 🍽️
            </Button>
          </form>
        </motion.div>
      </main>

      <footer className="text-center text-xs text-muted-foreground py-4 px-4">
        © {currentYear}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Built with love using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
