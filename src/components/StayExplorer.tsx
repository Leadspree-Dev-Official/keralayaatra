import React, { useState } from "react";
import { STAY_ITEMS } from "../data/stays";
import { StayItem, BookingRequest } from "../types";
import { Star, MapPin, Coffee, Compass, Check, Calendar, ArrowRight, X, Phone } from "lucide-react";

interface StayExplorerProps {
  onAddBooking: (booking: BookingRequest) => void;
  setActiveTab: (tab: string) => void;
}

export default function StayExplorer({ onAddBooking, setActiveTab }: StayExplorerProps) {
  const [selectedType, setSelectedType] = useState<string>("All");
  const [bookingStay, setBookingStay] = useState<StayItem | null>(null);

  // Form states
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [nights, setNights] = useState<number>(2);
  const [guests, setGuests] = useState<number>(2);
  const [custName, setCustName] = useState<string>("");
  const [custEmail, setCustEmail] = useState<string>("");
  const [custPhone, setCustPhone] = useState<string>("");
  const [bookingDone, setBookingDone] = useState<string | null>(null);

  const filterTypes = ["All", "Homestay", "Eco Resort", "Heritage Bungalow", "Houseboat"];

  const filteredStays = selectedType === "All"
    ? STAY_ITEMS
    : STAY_ITEMS.filter(stay => stay.type === selectedType);

  const handleBookStaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingStay) return;
    if (!checkInDate) {
      alert("Please choose a check-in date");
      return;
    }

    const calculatedCost = bookingStay.pricePerNight * nights;
    const refCode = "KY-ST-" + Math.floor(100000 + Math.random() * 900000);

    const newBooking: BookingRequest = {
      id: "booking_" + Date.now(),
      bookingType: "stay",
      title: `Stay Booking: ${bookingStay.name} (${bookingStay.location})`,
      date: checkInDate,
      details: {
        stayId: bookingStay.id,
        stayName: bookingStay.name,
        location: bookingStay.location,
        stayType: bookingStay.type,
        nights,
        guests,
        pricePerNight: bookingStay.pricePerNight,
        custName,
        custEmail,
        custPhone,
        calculatedCost,
        refCode
      },
      cost: calculatedCost,
      status: "confirmed",
      bookingRef: refCode
    };

    onAddBooking(newBooking);
    setBookingDone(refCode);

    // Reset details
    setCustName("");
    setCustEmail("");
    setCustPhone("");
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in" id="stays-tab">
      
      {/* Intro block */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-primary mb-3">
          Experiential Homestays & Eco Resorts
        </h1>
        <p className="text-sm sm:text-base text-brand-inverse">
          Experience genuine Kerala hospitality. Wake up in tea plantation treehouses, sleep on wooden houseboats, or relax in century-old heritage courtyard bungalows.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-8">
        {filterTypes.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
              selectedType === t
                ? "bg-brand-raised text-brand-secondary shadow-brand-3 font-semibold"
                : "bg-brand-surface-card hover:bg-brand-surface-card-hover text-brand-inverse hover:text-brand-primary border border-brand-border"
            }`}
            id={`filter-stay-${t.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {t}s
          </button>
        ))}
      </div>

      {/* Stays list grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredStays.map((stay) => (
          <div
            key={stay.id}
            className="bg-brand-surface-card border border-brand-border rounded-3xl overflow-hidden hover:border-brand-raised transition-all duration-300 flex flex-col sm:flex-row group shadow-brand-1"
            id={`stay-card-${stay.id}`}
          >
            {/* Left/Top Image section */}
            <div className="relative w-full sm:w-2/5 h-60 sm:h-auto overflow-hidden">
              <img
                src={stay.image}
                alt={stay.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-brand-base/80 backdrop-blur-sm border border-brand-border text-brand-raised text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                {stay.type}
              </span>
            </div>

            {/* Right/Bottom content */}
            <div className="p-5 sm:p-6 w-full sm:w-3/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1 text-xs text-brand-inverse font-medium">
                    <MapPin className="w-3.5 h-3.5 text-brand-raised" />
                    <span>{stay.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-brand-raised text-brand-raised" />
                    <span className="text-xs font-extrabold text-brand-primary">{stay.rating}</span>
                    <span className="text-[10px] text-brand-inverse">({stay.reviewCount})</span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-brand-primary mb-2 line-clamp-1">
                  {stay.name}
                </h3>
                <p className="text-xs text-brand-inverse line-clamp-2 mb-4 leading-relaxed">
                  {stay.description}
                </p>

                {/* Amenities Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {stay.amenities.slice(0, 3).map((amenity, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-brand-base border border-brand-border text-brand-primary px-2 py-1 rounded-lg"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* Local Experiences Section */}
                <div className="mb-5 bg-brand-base border border-brand-border p-3 rounded-xl">
                  <span className="block text-[9px] font-bold text-brand-raised uppercase tracking-wider mb-1.5">
                    Included Local Experiences:
                  </span>
                  <ul className="space-y-1">
                    {stay.experiences.slice(0, 2).map((exp, idx) => (
                      <li key={idx} className="text-[10px] text-brand-primary font-medium flex items-center gap-1.5">
                        <Compass className="w-3 h-3 text-brand-raised shrink-0" />
                        <span className="line-clamp-1">{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pricing & Booking Button row */}
              <div className="border-t border-brand-border pt-4 flex items-center justify-between mt-auto">
                <div>
                  <span className="block text-[10px] text-brand-inverse uppercase font-semibold">Price per Night</span>
                  <span className="text-lg font-extrabold text-brand-raised">
                    ₹{stay.pricePerNight.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[9px] text-brand-inverse block">Double occupancy</span>
                </div>

                <button
                  onClick={() => {
                    setBookingStay(stay);
                    setNights(2);
                    setGuests(2);
                    setBookingDone(null);
                  }}
                  className="bg-brand-raised text-brand-secondary font-extrabold px-4.5 py-2.5 rounded-xl text-xs hover:scale-[1.03] active:scale-[0.98] transition cursor-pointer"
                  id={`book-stay-btn-${stay.id}`}
                >
                  Book Stay Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED BOOKING MODAL */}
      {bookingStay && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-base/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-surface-card border border-brand-border rounded-3xl max-w-lg w-full shadow-brand-4 animate-slide-up overflow-hidden">
            
            {/* Modal Head Banner */}
            <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-base">
              <div>
                <span className="text-[10px] text-brand-raised font-bold uppercase tracking-wider">{bookingStay.type} Booking</span>
                <h3 className="text-base font-extrabold text-brand-primary mt-0.5">{bookingStay.name}</h3>
              </div>
              <button
                onClick={() => setBookingStay(null)}
                className="text-brand-inverse hover:text-brand-primary p-1 rounded-full cursor-pointer"
                id="close-stay-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form body */}
            <div className="p-5 sm:p-6 space-y-4">
              {bookingDone ? (
                <div className="text-center py-6 space-y-4 font-sans">
                  <div className="w-12 h-12 bg-brand-raised/10 text-brand-raised rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-brand-primary">Room Reserved Successfully!</h4>
                    <p className="text-xs text-brand-inverse mt-1">
                      Your stay voucher is active. Chauffeurs can directly drop you off at this location.
                    </p>
                  </div>
                  <div className="bg-brand-base border border-brand-border p-3 rounded-xl text-left max-w-sm mx-auto">
                    <span className="block text-[10px] text-brand-inverse font-semibold">Stay Confirmation Code:</span>
                    <span className="font-mono text-sm font-extrabold text-brand-raised tracking-wider">{bookingDone}</span>
                  </div>
                  <button
                    onClick={() => {
                      setBookingStay(null);
                      setBookingDone(null);
                    }}
                    className="w-full bg-brand-raised text-brand-secondary py-2 rounded-xl text-xs font-bold cursor-pointer"
                    id="finish-stay-booking-btn"
                  >
                    OK, Back to listings
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookStaySubmit} className="space-y-4">
                  {/* Reservation setup row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-brand-inverse uppercase mb-1">Check-in Date</label>
                      <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl px-3 py-2 text-xs"
                        required
                        id="stay-checkin"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-brand-inverse uppercase mb-1">Duration (Nights)</label>
                      <input
                        type="number"
                        value={nights}
                        onChange={(e) => setNights(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl px-3 py-2 text-xs"
                        min="1"
                        required
                        id="stay-nights"
                      />
                    </div>
                  </div>

                  {/* Pricing Overview */}
                  <div className="bg-brand-base border border-brand-border rounded-xl p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="block text-[9px] text-brand-inverse font-medium">Rate: ₹{bookingStay.pricePerNight}/night</span>
                      <span className="font-bold text-brand-primary">Total stay fare ({nights} Nights)</span>
                    </div>
                    <span className="text-base font-extrabold text-brand-raised">
                      ₹{(bookingStay.pricePerNight * nights).toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Customer details */}
                  <div className="space-y-3 pt-2 border-t border-brand-border">
                    <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider">Lead Guest Details</h4>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-brand-inverse uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl px-3 py-2 text-xs"
                        placeholder="e.g. Anand Gopakumar"
                        required
                        id="stay-cust-name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-brand-inverse uppercase mb-1">Email</label>
                        <input
                          type="email"
                          value={custEmail}
                          onChange={(e) => setCustEmail(e.target.value)}
                          className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl px-3 py-2 text-xs"
                          placeholder="e.g. anand@outlook.com"
                          required
                          id="stay-cust-email"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-brand-inverse uppercase mb-1">WhatsApp Phone</label>
                        <input
                          type="tel"
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl px-3 py-2 text-xs"
                          placeholder="e.g. +91 99955 66778"
                          required
                          id="stay-cust-phone"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-raised text-brand-secondary font-extrabold text-sm py-2.5 rounded-xl hover:scale-[1.01] transition duration-150 cursor-pointer"
                    id="submit-stay-booking-btn"
                  >
                    Confirm Room Reservation
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
