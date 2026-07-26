import React, { useState, useEffect } from "react";
import { Car, User, Briefcase, Calendar, MapPin, Calculator, Info, CheckCircle2, Ticket, Printer, ArrowRight } from "lucide-react";
import { TaxiVehicle, TaxiEstimate, BookingRequest } from "../types";

interface TaxiPlannerProps {
  onAddBooking: (booking: BookingRequest) => void;
  setActiveTab: (tab: string) => void;
}

const VEHICLES: TaxiVehicle[] = [
  {
    id: "hatchback",
    name: "Hatchback (Tiago/WagonR)",
    type: "hatchback",
    capacity: 4,
    luggage: 2,
    image: "🚗",
    description: "Ideal for couples or solo travelers packing light. Very fuel-efficient for winding ghat curves.",
    baseRatePerKm: 14,
    minDailyKms: 200
  },
  {
    id: "sedan",
    name: "Sedan (Toyota Etios/Dzire)",
    type: "sedan",
    capacity: 4,
    luggage: 3,
    image: "🚗",
    description: "Our standard reliable family choice. Comfort-tuned suspension and spacious trunk.",
    baseRatePerKm: 16,
    minDailyKms: 200
  },
  {
    id: "suv",
    name: "MUV / SUV (Maruti Ertiga)",
    type: "suv",
    capacity: 6,
    luggage: 4,
    image: "🚙",
    description: "Great budget option for larger families. Generous cabin cooling with rear AC vents.",
    baseRatePerKm: 20,
    minDailyKms: 200
  },
  {
    id: "premium_suv",
    name: "Premium SUV (Innova Crysta)",
    type: "premium_suv",
    capacity: 7,
    luggage: 5,
    image: "🚐",
    description: "Industry-gold standard for touring comfort. High clearance, captain seats, supreme safety.",
    baseRatePerKm: 24,
    minDailyKms: 200
  },
  {
    id: "tempo",
    name: "Tempo Traveller (Force Luxury)",
    type: "tempo",
    capacity: 12,
    luggage: 10,
    image: "🚌",
    description: "Perfect for large group tours and corporate trips. Luxury pushback seating and high roof clearance.",
    baseRatePerKm: 28,
    minDailyKms: 200
  }
];

// Presets for typical routes starting from Cochin (Airport/Railway)
const ROUTE_PRESETS = [
  { label: "Cochin to Munnar Hills", distance: 130, stops: ["Cheeyappara Waterfalls", "Valara Waterfalls", "Neriamangalam Bridge"] },
  { label: "Cochin to Alleppey Houseboat Pier", distance: 80, stops: ["Marari Beach", "Kumarakom canal bypass"] },
  { label: "Cochin to Thekkady Wilds (Periyar)", distance: 165, stops: ["Kanjirappally Rubber plantations", "Vagamon view points"] },
  { label: "Cochin to Kovalam Crescent Beach", distance: 220, stops: ["Alappuzha beach bypass", "Kollam Ashtamudi overlook"] },
  { label: "Munnar Hills to Thekkady Spice Trail", distance: 110, stops: ["Lock Heart Gap", "Anayirangal Dam", "Chinnakanal view"] },
  { label: "Thekkady Wilds to Alleppey Backwaters", distance: 140, stops: ["Kuttanad paddies", "Kottayam heritage path"] }
];

export default function TaxiPlanner({ onAddBooking, setActiveTab }: TaxiPlannerProps) {
  // Planner State
  const [pickup, setPickup] = useState("Cochin Airport (COK)");
  const [destination, setDestination] = useState("Munnar Hills");
  const [routeDistance, setRouteDistance] = useState(130);
  const [vehicleType, setVehicleType] = useState<"hatchback" | "sedan" | "suv" | "premium_suv" | "tempo">("sedan");
  const [packageType, setPackageType] = useState<"one_way" | "round">("round");
  const [days, setDays] = useState(3);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("09:00");

  // Estimation Result
  const [estimate, setEstimate] = useState<TaxiEstimate | null>(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);

  // Booking Form State
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState<BookingRequest | null>(null);

  // Trigger estimation calculation
  useEffect(() => {
    calculateEstimate();
  }, [routeDistance, vehicleType, days, packageType]);

  const calculateEstimate = async () => {
    setLoadingEstimate(true);
    try {
      const response = await fetch("/api/taxi/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routeDistance, vehicleType, days, packageType }),
      });
      if (response.ok) {
        const data = await response.json();
        setEstimate(data);
      } else {
        throw new Error("Failed backend taxi estimation");
      }
    } catch (err) {
      // Fallback local estimation math
      const rates: Record<string, number> = {
        hatchback: 14,
        sedan: 16,
        suv: 20,
        premium_suv: 24,
        tempo: 28,
      };
      const perKmRate = rates[vehicleType] || 16;
      const minKms = days * 200;
      const actualKms = packageType === "round" ? routeDistance * 2 : routeDistance;
      const billableKms = Math.max(actualKms, minKms);
      const baseFare = billableKms * perKmRate;
      const driverAllowance = days * 500;
      const tollPermitEstimation = packageType === "one_way" && routeDistance > 150 ? 800 : 400;

      setEstimate({
        billableKms,
        ratePerKm: perKmRate,
        baseFare,
        driverAllowance,
        tollPermitEstimation,
        total: baseFare + driverAllowance + tollPermitEstimation
      });
    } finally {
      setLoadingEstimate(false);
    }
  };

  const handleApplyPreset = (preset: typeof ROUTE_PRESETS[0]) => {
    const parts = preset.label.split(" to ");
    setPickup(parts[0]);
    setDestination(parts[1]);
    setRouteDistance(preset.distance);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupDate) {
      alert("Please select a pickup date");
      return;
    }

    const refCode = "KY-TX-" + Math.floor(100000 + Math.random() * 900000);
    const newBooking: BookingRequest = {
      id: "booking_" + Date.now(),
      bookingType: "taxi",
      title: `Taxi Service: ${pickup} ➔ ${destination}`,
      date: pickupDate,
      details: {
        pickup,
        destination,
        routeDistance,
        vehicleName: VEHICLES.find(v => v.type === vehicleType)?.name,
        vehicleType,
        packageType,
        days,
        pickupTime,
        guestName,
        guestEmail,
        guestPhone,
        specialNotes,
        billing: estimate,
        refCode
      },
      cost: estimate?.total || 0,
      status: "confirmed",
      bookingRef: refCode
    };

    onAddBooking(newBooking);
    setBookingSuccess(newBooking);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in" id="taxi-planner-tab">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-primary mb-3">
          Kerala Taxi Cost Estimator & Booking
        </h1>
        <p className="text-sm sm:text-base text-brand-inverse">
          No hidden fees, no surge charges. Transparent union-approved mileage calculations with local, polite, English/Hindi speaking driver guides.
        </p>
      </div>

      {bookingSuccess ? (
        /* SUCCESS SCREEN */
        <div className="max-w-2xl mx-auto bg-brand-surface-card border border-brand-border rounded-3xl p-6 sm:p-8 text-center shadow-brand-4 animate-slide-up">
          <div className="w-16 h-16 bg-brand-raised/20 text-brand-raised rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 stroke-[2]" />
          </div>
          <h2 className="text-2xl font-bold text-brand-primary mb-2">Taxi Reservation Confirmed!</h2>
          <p className="text-sm text-brand-inverse mb-6">
            Thank you for trusting Keralayaatra. Your local professional chauffeur is now assigned to your trip.
          </p>

          <div className="bg-brand-base border border-brand-border rounded-2xl p-5 text-left mb-6 font-sans">
            <div className="flex items-center justify-between border-b border-brand-border pb-3 mb-3">
              <span className="text-xs font-semibold uppercase text-brand-inverse tracking-wider">Booking Reference</span>
              <span className="text-sm font-extrabold text-brand-raised tracking-wider">{bookingSuccess.bookingRef}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-3">
              <div>
                <span className="block text-brand-inverse font-medium">Guest Name</span>
                <span className="text-sm font-bold text-brand-primary">{bookingSuccess.details.guestName}</span>
              </div>
              <div>
                <span className="block text-brand-inverse font-medium">Pickup Date & Time</span>
                <span className="text-sm font-bold text-brand-primary">{bookingSuccess.date} @ {bookingSuccess.details.pickupTime}</span>
              </div>
            </div>

            <div className="border-t border-brand-border pt-3">
              <span className="block text-brand-inverse text-[11px] uppercase tracking-wide mb-1.5">Route Information</span>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-primary">
                <span>{bookingSuccess.details.pickup}</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-raised" />
                <span>{bookingSuccess.details.destination}</span>
              </div>
              <div className="text-xs text-brand-inverse mt-1">
                Distance: {bookingSuccess.details.routeDistance} km | Car: {bookingSuccess.details.vehicleName}
              </div>
            </div>

            <div className="border-t border-brand-border mt-3 pt-3 flex items-center justify-between bg-brand-surface-card p-3 rounded-xl border border-dashed border-brand-border">
              <span className="text-xs font-semibold text-brand-primary">Guaranteed Tour Fare</span>
              <span className="text-base font-extrabold text-brand-raised">₹{bookingSuccess.cost.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-surface-card hover:bg-brand-surface-card-hover border border-brand-border text-brand-primary px-5 py-2.5 rounded-xl text-sm font-semibold transition"
              id="print-voucher-btn"
            >
              <Printer className="w-4 h-4" />
              <span>Print Taxi Voucher</span>
            </button>
            <button
              onClick={() => {
                setBookingSuccess(null);
                setGuestName("");
                setGuestEmail("");
                setGuestPhone("");
                setSpecialNotes("");
              }}
              className="w-full sm:w-auto bg-brand-raised hover:scale-[1.02] text-brand-secondary px-5 py-2.5 rounded-xl text-sm font-bold transition"
              id="book-another-btn"
            >
              Book Another Ride
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className="w-full sm:w-auto text-xs text-brand-inverse hover:text-brand-primary transition underline font-medium mt-2 sm:mt-0"
              id="view-bookings-link"
            >
              Go to Trip Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* MAIN INTERACTIVE PLANNER GRID */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Estimator Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Presets Card */}
            <div className="bg-brand-surface-card border border-brand-border rounded-2xl p-5 shadow-brand-1">
              <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-raised" />
                <span>Popular Tourist Route Presets</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {ROUTE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplyPreset(preset)}
                    className="text-xs bg-brand-base hover:bg-brand-surface-card-hover border border-brand-border hover:border-brand-raised text-brand-primary px-3 py-2 rounded-xl transition duration-150 cursor-pointer"
                    id={`preset-${idx}`}
                  >
                    {preset.label} <span className="text-brand-raised">({preset.distance}km)</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Form Fields */}
            <div className="bg-brand-surface-card border border-brand-border rounded-3xl p-5 sm:p-6 space-y-5 shadow-brand-1">
              <h3 className="text-lg font-bold text-brand-primary border-b border-brand-border pb-3 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-brand-raised" />
                <span>Configure Your Taxi Route</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pickup */}
                <div>
                  <label className="block text-xs font-bold text-brand-inverse uppercase tracking-wider mb-1.5">Pickup Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-raised" />
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-sm"
                      placeholder="e.g. Cochin Airport (COK)"
                      required
                      id="input-pickup"
                    />
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-xs font-bold text-brand-inverse uppercase tracking-wider mb-1.5">Dropoff / Primary Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-raised" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-sm"
                      placeholder="e.g. Munnar Tea Gardens"
                      required
                      id="input-destination"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Route Distance */}
                <div>
                  <label className="block text-xs font-bold text-brand-inverse uppercase tracking-wider mb-1.5">One-Way Distance (km)</label>
                  <input
                    type="number"
                    value={routeDistance}
                    onChange={(e) => setRouteDistance(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl px-3 py-2.5 text-sm"
                    min="1"
                    required
                    id="input-distance"
                  />
                </div>

                {/* Trip Style (One Way / Round Outstation) */}
                <div>
                  <label className="block text-xs font-bold text-brand-inverse uppercase tracking-wider mb-1.5">Trip Style</label>
                  <select
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value as "one_way" | "round")}
                    className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl px-3 py-2.5 text-sm"
                    id="select-package-type"
                  >
                    <option value="round">Round Outstation Trip</option>
                    <option value="one_way">One-Way Dropoff</option>
                  </select>
                </div>

                {/* Duration Days */}
                <div>
                  <label className="block text-xs font-bold text-brand-inverse uppercase tracking-wider mb-1.5">Rental Duration (Days)</label>
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl px-3 py-2.5 text-sm"
                    min="1"
                    required
                    id="input-days"
                  />
                </div>
              </div>

              {/* Vehicle Selection Grid */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-brand-inverse uppercase tracking-wider mb-3">Choose Your Vehicle Fleet</label>
                <div className="space-y-3">
                  {VEHICLES.map((car) => {
                    const isSelected = vehicleType === car.type;
                    return (
                      <button
                        key={car.id}
                        type="button"
                        onClick={() => setVehicleType(car.type)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer focus:outline-none ${
                          isSelected
                            ? "bg-brand-surface-card-selected border-brand-raised shadow-brand-3"
                            : "bg-brand-base border-brand-border hover:bg-brand-surface-card-hover"
                        }`}
                        id={`fleet-car-${car.id}`}
                      >
                        <div className="flex gap-4 items-start sm:items-center">
                          <span className="text-3xl bg-brand-surface-card p-2 rounded-xl border border-brand-border">{car.image}</span>
                          <div>
                            <h4 className="text-sm font-extrabold text-brand-primary flex items-center gap-2">
                              <span>{car.name}</span>
                              <span className="text-xs font-semibold text-brand-raised bg-brand-raised/10 px-2 py-0.5 rounded-md">
                                ₹{car.baseRatePerKm}/km
                              </span>
                            </h4>
                            <p className="text-xs text-brand-inverse mt-1 max-w-md">{car.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-[11px] text-brand-inverse font-medium">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3 text-brand-raised" /> {car.capacity} Passengers Max
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3 text-brand-raised" /> {car.luggage} Standard Bags
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE ESTIMATE BREAKDOWN & RESERVATION (5 cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            
            {/* Cost Summary Box */}
            <div className="bg-brand-surface-card border border-brand-border rounded-3xl p-5 sm:p-6 shadow-brand-4 space-y-5">
              <h3 className="text-base font-bold text-brand-primary uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-brand-raised" />
                <span>Trip Estimate Summary</span>
              </h3>

              {loadingEstimate ? (
                <div className="py-12 text-center text-brand-inverse text-xs animate-pulse">
                  Re-calculating local taxi fares...
                </div>
              ) : estimate ? (
                <div className="space-y-4">
                  
                  {/* Big Total */}
                  <div className="text-center bg-brand-base border border-brand-border rounded-2xl p-4">
                    <span className="block text-xs font-semibold text-brand-inverse uppercase tracking-wide mb-1">Estimated Grand Total</span>
                    <span className="text-3xl font-extrabold text-brand-raised">₹{estimate.total.toLocaleString("en-IN")}</span>
                    <span className="block text-[10px] text-brand-inverse mt-1">
                      Inclusive of driver allowance & estimated highway tolls
                    </span>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-brand-inverse font-medium">Base Fare ({estimate.billableKms} kms billable)</span>
                      <span className="text-brand-primary font-bold">₹{estimate.baseFare.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-inverse font-medium">Driver Outstation Allowance ({days} days)</span>
                      <span className="text-brand-primary font-bold">₹{estimate.driverAllowance.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-inverse font-medium">State Permits & Tourist Tolls Estimate</span>
                      <span className="text-brand-primary font-bold">₹{estimate.tollPermitEstimation.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="border-t border-brand-border pt-2.5 flex items-center justify-between text-brand-inverse">
                      <span className="font-semibold text-brand-raised">Minimum daily billable rule</span>
                      <span className="font-bold">200 km / day</span>
                    </div>
                  </div>

                  {/* Informational Warning */}
                  <div className="bg-brand-raised/5 border border-brand-raised/20 rounded-xl p-3.5 flex gap-2.5 text-[11px] text-brand-primary">
                    <Info className="w-4 h-4 text-brand-raised shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-brand-raised mb-0.5">Kerala Taxi Union Regulations</p>
                      <p className="text-brand-inverse">
                        If actual trip kilometers exceed the billable {estimate.billableKms}km, extra kms will be billed at standard rate of ₹{estimate.ratePerKm}/km directly with the driver.
                      </p>
                    </div>
                  </div>

                </div>
              ) : null}
            </div>

            {/* Quick Booking Reservation Form */}
            <div className="bg-brand-surface-card border border-brand-border rounded-3xl p-5 sm:p-6 shadow-brand-1">
              <h3 className="text-base font-bold text-brand-primary uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-brand-raised" />
                <span>Reserve Driver & Car Now</span>
              </h3>

              <form onSubmit={handleBookingSubmit} className="space-y-3.5 mt-4">
                {/* Travel Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-inverse uppercase tracking-wide mb-1">Pickup Date</label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl px-3 py-2 text-xs"
                      required
                      id="form-date"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-inverse uppercase tracking-wide mb-1">Pickup Time</label>
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl px-3 py-2 text-xs"
                      required
                      id="form-time"
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[11px] font-bold text-brand-inverse uppercase tracking-wide mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl px-3 py-2 text-xs"
                    placeholder="e.g. Rahul Sharma"
                    required
                    id="form-name"
                  />
                </div>

                {/* Contact */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-brand-inverse uppercase tracking-wide mb-1">Email ID</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl px-3 py-2 text-xs"
                      placeholder="e.g. rahul@example.com"
                      required
                      id="form-email"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-inverse uppercase tracking-wide mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl px-3 py-2 text-xs"
                      placeholder="e.g. +91 98765 43210"
                      required
                      id="form-phone"
                    />
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-[11px] font-bold text-brand-inverse uppercase tracking-wide mb-1">Special Notes (Optional)</label>
                  <textarea
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl px-3 py-2 text-xs h-16 resize-none"
                    placeholder="e.g. Need child booster seat. Requested English/Hindi speaking tour driver guide."
                    id="form-notes"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-raised hover:scale-[1.01] active:scale-[0.99] text-brand-secondary font-extrabold text-sm py-3 rounded-xl transition shadow-brand-3 flex items-center justify-center gap-2 cursor-pointer"
                  id="confirm-booking-btn"
                >
                  <Car className="w-4 h-4 shrink-0" />
                  <span>Confirm Reservation (No Advance Needed)</span>
                </button>
              </form>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
