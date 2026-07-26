import React, { useState } from "react";
import { TOUR_PACKAGES } from "../data/tours";
import { TourPackage, BookingRequest } from "../types";
import { Map, Clock, Check, AlertCircle, Sparkles, Filter, Eye, ChevronRight, X, Calendar, User, ShoppingCart, HelpCircle } from "lucide-react";

interface TourExplorerProps {
  onAddBooking: (booking: BookingRequest) => void;
  setActiveTab: (tab: string) => void;
  setAiParams: (params: { destinations: string[]; duration: number }) => void;
}

export default function TourExplorer({ onAddBooking, setActiveTab, setAiParams }: TourExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null);

  // Customization choices inside modal
  const [hotelStandard, setHotelStandard] = useState<"standard" | "premium" | "luxury">("premium");
  const [adultsCount, setAdultsCount] = useState<number>(2);
  const [travelDate, setTravelDate] = useState<string>("");
  const [guestName, setGuestName] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");
  const [bookingCompleted, setBookingCompleted] = useState<string | null>(null);

  // Filter Categories
  const categories = ["All", "Hills", "Backwaters", "Beaches", "Wildlife", "Honeymoon", "Best Seller"];

  const filteredTours = selectedCategory === "All"
    ? TOUR_PACKAGES
    : TOUR_PACKAGES.filter(pkg => pkg.categories.includes(selectedCategory));

  // Compute calculated pricing
  const calculateTourCost = (basePrice: number) => {
    let multiplier = 1;
    if (hotelStandard === "standard") multiplier = 0.85; // 15% discount for homestays
    if (hotelStandard === "luxury") multiplier = 1.6; // 60% premium for 5-star resorts

    // Base price assumes double sharing (2 adults). Each extra adult adds 40% of base.
    const adultFactor = adultsCount <= 2 ? 1 : 1 + (adultsCount - 2) * 0.4;
    return Math.round(basePrice * multiplier * adultFactor);
  };

  const handleBookTourSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTour) return;
    if (!travelDate) {
      alert("Please select a departure date");
      return;
    }

    const calculatedCost = calculateTourCost(selectedTour.priceFrom);
    const refCode = "KY-TR-" + Math.floor(100000 + Math.random() * 900000);

    const newBooking: BookingRequest = {
      id: "booking_" + Date.now(),
      bookingType: "tour",
      title: `Tour Package: ${selectedTour.name}`,
      date: travelDate,
      details: {
        tourId: selectedTour.id,
        tourName: selectedTour.name,
        hotelStandard,
        adultsCount,
        guestName,
        guestEmail,
        guestPhone,
        calculatedCost,
        refCode
      },
      cost: calculatedCost,
      status: "confirmed",
      bookingRef: refCode
    };

    onAddBooking(newBooking);
    setBookingCompleted(refCode);

    // Reset customer fields
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
  };

  const handleLaunchAICustomizer = (tour: TourPackage) => {
    // Map tour highlights to destinations
    const destMap: Record<string, string[]> = {
      tour_1: ["Munnar", "Alleppey", "Fort Kochi"],
      tour_2: ["Varkala", "Kovalam", "Trivandrum"],
      tour_3: ["Munnar", "Thekkady", "Cochin"],
    };
    const destinations = destMap[tour.id] || ["Munnar", "Alleppey"];
    
    setAiParams({
      destinations,
      duration: tour.durationDays
    });
    
    // Close modal and head to AI tab
    setSelectedTour(null);
    setActiveTab("ai");
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in" id="tours-tab">
      
      {/* Intro section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-primary mb-3">
          Handpicked Private Kerala Tours
        </h1>
        <p className="text-sm sm:text-base text-brand-inverse">
          Carefully designed thematic packages. Fully customizable with private chauffeurs, premium hotel bookings, and experiential local sightseeing guides.
        </p>
      </div>

      {/* Category Filter buttons */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
              selectedCategory === cat
                ? "bg-brand-raised text-brand-secondary shadow-brand-3 font-semibold"
                : "bg-brand-surface-card hover:bg-brand-surface-card-hover text-brand-inverse hover:text-brand-primary border border-brand-border"
            }`}
            id={`filter-tour-${cat.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTours.map((tour) => (
          <div
            key={tour.id}
            className="bg-brand-surface-card border border-brand-border rounded-3xl overflow-hidden hover:border-brand-raised transition-all duration-300 flex flex-col group shadow-brand-1"
            id={`tour-card-${tour.id}`}
          >
            {/* Image banner */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={tour.heroImage}
                alt={tour.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-brand-base/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-brand-raised border border-brand-border flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{tour.durationDays} Days / {tour.durationDays - 1} Nights</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                {/* Categories */}
                <div className="flex flex-wrap gap-1 mb-2.5">
                  {tour.categories.map((c) => (
                    <span
                      key={c}
                      className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-brand-border text-brand-raised"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <h3 className="text-base font-extrabold text-brand-primary mb-2 line-clamp-1">
                  {tour.name}
                </h3>
                <p className="text-xs text-brand-inverse line-clamp-2 mb-4 leading-relaxed">
                  {tour.description}
                </p>

                {/* Bullet Highlights */}
                <ul className="space-y-1.5 mb-5 text-[11px] text-brand-primary font-medium">
                  {tour.highlights.slice(0, 3).map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-brand-raised shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing & Button footer */}
              <div className="border-t border-brand-border pt-4 flex items-center justify-between mt-auto">
                <div>
                  <span className="block text-[10px] text-brand-inverse uppercase font-semibold">Price per Person</span>
                  <span className="text-lg font-extrabold text-brand-raised">
                    ₹{tour.priceFrom.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[9px] text-brand-inverse block">on twin sharing</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedTour(tour);
                    setHotelStandard("premium");
                    setAdultsCount(2);
                    setBookingCompleted(null);
                  }}
                  className="flex items-center gap-1 bg-brand-raised text-brand-secondary px-4 py-2 rounded-xl text-xs font-bold hover:scale-[1.03] transition duration-200 cursor-pointer"
                  id={`view-tour-btn-${tour.id}`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View & Configure</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL WITH CALCULATOR & DIRECT BOOKING */}
      {selectedTour && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-base/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-surface-card border border-brand-border rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-brand-4 animate-slide-up flex flex-col">
            
            {/* Modal Header banner */}
            <div className="relative h-48 md:h-64 shrink-0">
              <img
                src={selectedTour.heroImage}
                alt={selectedTour.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-surface-card to-transparent" />
              <button
                onClick={() => setSelectedTour(null)}
                className="absolute top-4 right-4 bg-brand-base/70 hover:bg-brand-base border border-brand-border text-brand-primary p-2 rounded-full transition cursor-pointer"
                id="close-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-5 right-5">
                <span className="text-[10px] bg-brand-raised text-brand-secondary font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {selectedTour.durationDays} Days Private Tour
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-primary mt-1 tracking-tight">
                  {selectedTour.name}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Itinerary Details (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-brand-raised uppercase tracking-wider mb-2">Tour Overview</h4>
                  <p className="text-xs text-brand-inverse leading-relaxed">{selectedTour.description}</p>
                </div>

                {/* Day-by-day Itinerary Accordion */}
                <div>
                  <h4 className="text-sm font-bold text-brand-raised uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Map className="w-4 h-4 text-brand-raised" />
                    <span>Daily Activity Itinerary</span>
                  </h4>
                  <div className="space-y-4 border-l border-brand-border pl-4 ml-2">
                    {selectedTour.itinerary.map((step) => (
                      <div key={step.day} className="relative">
                        <div className="absolute -left-[25px] top-0 w-4 h-4 bg-brand-raised text-brand-secondary text-[9px] font-extrabold rounded-full flex items-center justify-center border border-brand-base">
                          {step.day}
                        </div>
                        <h5 className="text-xs font-bold text-brand-primary uppercase">
                          Day {step.day}: {step.title}
                        </h5>
                        <p className="text-xs text-brand-inverse mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inclusions & Exclusions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-brand-border">
                  <div>
                    <h5 className="text-xs font-bold text-brand-raised uppercase tracking-wider mb-2">Inclusions</h5>
                    <ul className="space-y-1 text-[11px] text-brand-primary">
                      {selectedTour.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3 h-3 text-brand-raised shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-brand-inverse uppercase tracking-wider mb-2">Exclusions</h5>
                    <ul className="space-y-1 text-[11px] text-brand-inverse">
                      {selectedTour.exclusions.map((exc, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-red-500 shrink-0 font-bold leading-none mt-0.5">×</span>
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column: Custom Calculator & Booking Form (5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                
                {bookingCompleted ? (
                  <div className="bg-brand-base border border-brand-border rounded-2xl p-5 text-center shadow-brand-2 space-y-4">
                    <Check className="w-10 h-10 text-brand-raised mx-auto bg-brand-raised/10 p-2 rounded-full" />
                    <h4 className="text-base font-bold text-brand-primary">Tour Requested Successfully!</h4>
                    <p className="text-xs text-brand-inverse">
                      Your booking is registered. Our coordinator will contact you shortly on your phone with hotels and vehicle numbers.
                    </p>
                    <div className="text-xs bg-brand-surface-card p-3 rounded-xl border border-brand-border text-left">
                      <span className="block text-[10px] text-brand-inverse font-medium">Ref Code:</span>
                      <span className="font-mono text-sm font-extrabold text-brand-raised">{bookingCompleted}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedTour(null);
                        setBookingCompleted(null);
                      }}
                      className="w-full bg-brand-raised text-brand-secondary py-2 rounded-xl text-xs font-extrabold cursor-pointer"
                      id="ok-done-btn"
                    >
                      Got it, thanks!
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Live Calculator Widget */}
                    <div className="bg-brand-base border border-brand-border rounded-2xl p-4 space-y-4">
                      <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider border-b border-brand-border pb-2">
                        Configure Tour Options
                      </h4>

                      {/* Hotel Standard */}
                      <div>
                        <label className="block text-[10px] font-semibold text-brand-inverse uppercase tracking-wide mb-1.5">Hotel Category</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: "standard", label: "Homestays" },
                            { id: "premium", label: "3-Star Deluxe" },
                            { id: "luxury", label: "5-Star Resorts" }
                          ].map((std) => (
                            <button
                              key={std.id}
                              type="button"
                              onClick={() => setHotelStandard(std.id as any)}
                              className={`py-1.5 rounded-lg text-[10px] font-bold border transition text-center cursor-pointer ${
                                hotelStandard === std.id
                                  ? "bg-brand-raised text-brand-secondary border-brand-raised"
                                  : "bg-brand-surface-card text-brand-inverse border-brand-border hover:bg-brand-surface-card-hover"
                              }`}
                              id={`hotel-std-${std.id}`}
                            >
                              {std.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Adults count */}
                      <div>
                        <label className="block text-[10px] font-semibold text-brand-inverse uppercase tracking-wide mb-1">Number of Travellers</label>
                        <div className="flex items-center justify-between bg-brand-surface-card border border-brand-border rounded-xl p-2">
                          <span className="text-xs text-brand-inverse font-medium">Adults / Teens</span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                              className="w-6 h-6 rounded bg-brand-border text-brand-primary font-bold text-xs flex items-center justify-center cursor-pointer"
                              id="adult-minus-btn"
                            >
                              -
                            </button>
                            <span className="text-xs font-extrabold text-brand-primary">{adultsCount}</span>
                            <button
                              type="button"
                              onClick={() => setAdultsCount(adultsCount + 1)}
                              className="w-6 h-6 rounded bg-brand-border text-brand-primary font-bold text-xs flex items-center justify-center cursor-pointer"
                              id="adult-plus-btn"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Gemini shortcut button */}
                      <button
                        onClick={() => handleLaunchAICustomizer(selectedTour)}
                        className="w-full flex items-center justify-center gap-1.5 bg-brand-surface-card hover:bg-brand-surface-card-hover border border-dashed border-brand-raised/40 text-brand-raised py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer"
                        id="ai-customizer-shortcut-btn"
                      >
                        <Sparkles className="w-3.5 h-3.5 animate-pulse text-brand-raised" />
                        <span>Customize Route with AI Guide</span>
                      </button>

                      {/* Computed price display */}
                      <div className="bg-brand-surface-card p-3 rounded-xl border border-brand-border flex items-center justify-between">
                        <div>
                          <span className="block text-[9px] text-brand-inverse uppercase font-semibold">Total Cost Estimate</span>
                          <span className="text-lg font-extrabold text-brand-raised">
                            ₹{calculateTourCost(selectedTour.priceFrom).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <span className="text-[9px] text-brand-inverse text-right leading-tight max-w-[100px]">
                          Private car + {hotelStandard} rooms
                        </span>
                      </div>
                    </div>

                    {/* Quick Reservation details */}
                    <div className="bg-brand-base border border-brand-border rounded-2xl p-4">
                      <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider border-b border-brand-border pb-2 mb-3">
                        Submit Reservation Details
                      </h4>

                      <form onSubmit={handleBookTourSubmit} className="space-y-3">
                        <div>
                          <label className="block text-[9px] font-bold text-brand-inverse uppercase mb-1">Departure Date</label>
                          <input
                            type="date"
                            value={travelDate}
                            onChange={(e) => setTravelDate(e.target.value)}
                            className="w-full bg-brand-surface-card text-brand-primary border border-brand-border rounded-xl px-2.5 py-1.5 text-xs"
                            required
                            id="tour-form-date"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-brand-inverse uppercase mb-1">Full Name</label>
                          <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full bg-brand-surface-card text-brand-primary border border-brand-border rounded-xl px-2.5 py-1.5 text-xs"
                            placeholder="e.g. Priyan Pillai"
                            required
                            id="tour-form-name"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-bold text-brand-inverse uppercase mb-1">Email ID</label>
                            <input
                              type="email"
                              value={guestEmail}
                              onChange={(e) => setGuestEmail(e.target.value)}
                              className="w-full bg-brand-surface-card text-brand-primary border border-brand-border rounded-xl px-2.5 py-1.5 text-xs"
                              placeholder="e.g. email@host.com"
                              required
                              id="tour-form-email"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-brand-inverse uppercase mb-1">WhatsApp Phone</label>
                            <input
                              type="tel"
                              value={guestPhone}
                              onChange={(e) => setGuestPhone(e.target.value)}
                              className="w-full bg-brand-surface-card text-brand-primary border border-brand-border rounded-xl px-2.5 py-1.5 text-xs"
                              placeholder="e.g. +91..."
                              required
                              id="tour-form-phone"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-brand-raised text-brand-secondary font-extrabold text-xs py-2.5 rounded-xl transition duration-150 cursor-pointer text-center"
                          id="submit-tour-booking-btn"
                        >
                          Request Confirmation (Free)
                        </button>
                      </form>
                    </div>
                  </>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
