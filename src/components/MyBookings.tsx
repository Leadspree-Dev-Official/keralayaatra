import React, { useState } from "react";
import { BookingRequest } from "../types";
import { Ticket, Calendar, MapPin, Printer, Trash2, CheckCircle2, ShoppingBag, Umbrella, Compass, HelpCircle, Heart, X } from "lucide-react";

interface MyBookingsProps {
  bookings: BookingRequest[];
  onCancelBooking: (id: string) => void;
}

const PACKING_LISTS = {
  hills: [
    { item: "Light woollens/sweater for cool Munnar evenings", checked: false },
    { item: "Comfortable non-slip trekking shoes", checked: false },
    { item: "Umbrella or windcheater (hills have sudden rain showers)", checked: false },
    { item: "Natural insect and mosquito repellent cream", checked: false },
    { item: "Binoculars for wildlife viewing in Rajamala / Periyar", checked: false }
  ],
  beaches: [
    { item: "Sunscreen lotion SPF 50+ (Kerala tropical sun is intense)", checked: false },
    { item: "Swimwear and quick-dry beach clothing", checked: false },
    { item: "Sunglasses and lightweight sun hat", checked: false },
    { item: "Comfortable beach slippers/flip-flops", checked: false },
    { item: "Waterproof dry-bag for phones and keys", checked: false }
  ],
  houseboats: [
    { item: "Lightweight, breathable linen or cotton outfits", checked: false },
    { item: "Personal medicines & motion sickness pills", checked: false },
    { item: "Power bank for cameras and phone recording", checked: false },
    { item: "Good book or travel journal to relax on the deck", checked: false },
    { item: "Mosquito spray (essential for backwater night stays)", checked: false }
  ]
};

export default function MyBookings({ bookings, onCancelBooking }: MyBookingsProps) {
  const [checklistType, setChecklistType] = useState<"hills" | "beaches" | "houseboats">("hills");
  const [packingItems, setPackingItems] = useState(PACKING_LISTS);
  const [viewingVoucher, setViewingVoucher] = useState<BookingRequest | null>(null);

  const toggleChecklistItem = (category: "hills" | "beaches" | "houseboats", idx: number) => {
    const updated = { ...packingItems };
    updated[category][idx].checked = !updated[category][idx].checked;
    setPackingItems(updated);
  };

  const handlePrintVoucher = (booking: BookingRequest) => {
    setViewingVoucher(booking);
    // Slight timeout so DOM updates before printing
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in" id="bookings-tab">
      
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-primary mb-3">
          Your Personal Trip Dashboard
        </h1>
        <p className="text-sm sm:text-base text-brand-inverse">
          Access your private taxi reservations, resort confirmations, custom AI travel itineraries, and calculate your luggage checklist in one unified offline hub.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: Saved Reservations (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-lg font-bold text-brand-primary uppercase tracking-wider flex items-center gap-2 border-b border-brand-border pb-3">
            <Ticket className="w-5 h-5 text-brand-raised" />
            <span>Active Tour & Ride Bookings ({bookings.length})</span>
          </h2>

          {bookings.length === 0 ? (
            <div className="bg-brand-surface-card border border-brand-border rounded-3xl p-10 text-center space-y-4">
              <Compass className="w-12 h-12 text-brand-inverse mx-auto animate-spin-slow" />
              <h3 className="text-base font-bold text-brand-primary">No bookings registered yet</h3>
              <p className="text-xs text-brand-inverse max-w-sm mx-auto leading-relaxed">
                Configure your routes in the **Taxi Planner**, browse custom **Tours**, or compile a customized itinerary using our **AI Planner** to register your vouchers.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-brand-surface-card border border-brand-border rounded-2xl p-5 hover:border-brand-raised transition-all flex flex-col sm:flex-row justify-between gap-4 shadow-brand-1"
                  id={`booking-card-${booking.id}`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-border text-brand-raised">
                        {booking.bookingType}
                      </span>
                      <span className="text-[10px] font-mono text-brand-inverse font-bold">
                        Ref: {booking.bookingRef}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-brand-primary">
                      {booking.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-brand-inverse font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-raised" /> Date: {booking.date}
                      </span>
                      {booking.details.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-raised" /> {booking.details.location}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-brand-inverse leading-relaxed">
                      {booking.bookingType === "taxi" && (
                        <span>Car: {booking.details.vehicleName} | Outstation {booking.details.days} Days</span>
                      )}
                      {booking.bookingType === "tour" && (
                        <span>Hotel: {booking.details.hotelStandard} standard | {booking.details.adultsCount} Guests</span>
                      )}
                      {booking.bookingType === "stay" && (
                        <span>Property: {booking.details.stayType} | {booking.details.nights} Nights</span>
                      )}
                      {booking.bookingType === "itinerary" && (
                        <span className="line-clamp-1">Custom AI curated detailed timeline saved</span>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col justify-between items-end gap-3 shrink-0 border-t sm:border-t-0 border-brand-border pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="block text-[10px] uppercase text-brand-inverse">Guaranteed Price</span>
                      <span className="text-base font-extrabold text-brand-raised">
                        {typeof booking.cost === "number" ? `₹${booking.cost.toLocaleString("en-IN")}` : booking.cost}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePrintVoucher(booking)}
                        className="bg-brand-border hover:bg-brand-surface-card-hover text-brand-primary p-2 rounded-lg border border-brand-border hover:border-brand-raised cursor-pointer"
                        title="Print Voucher"
                        id={`print-booking-btn-${booking.id}`}
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to cancel this booking reservation?")) {
                            onCancelBooking(booking.id);
                          }
                        }}
                        className="bg-brand-border hover:bg-red-950/20 text-red-500 p-2 rounded-lg border border-brand-border hover:border-red-900/40 cursor-pointer"
                        title="Cancel Booking"
                        id={`cancel-booking-btn-${booking.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Checklist Generator (5 cols) */}
        <div className="lg:col-span-5 bg-brand-surface-card border border-brand-border rounded-3xl p-5 sm:p-6 shadow-brand-1">
          <h2 className="text-base font-bold text-brand-primary uppercase tracking-wider border-b border-brand-border pb-3 mb-5 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-raised" />
            <span>Kerala Packing Packing Checklist</span>
          </h2>

          <p className="text-xs text-brand-inverse mb-4 leading-relaxed">
            Kerala's weather changes from tropical coastal heat to breezy high-altitude chilly ranges. Choose your focus below and tick off items.
          </p>

          {/* Checklist type buttons */}
          <div className="grid grid-cols-3 gap-1.5 mb-5">
            {[
              { id: "hills", label: "Hill Range (Munnar)" },
              { id: "beaches", label: "Seaside (Varkala)" },
              { id: "houseboats", label: "Water lagoons" }
            ].map((chk) => (
              <button
                key={chk.id}
                onClick={() => setChecklistType(chk.id as any)}
                className={`py-1.5 rounded-lg text-[10px] font-bold border transition text-center cursor-pointer ${
                  checklistType === chk.id
                    ? "bg-brand-raised text-brand-secondary border-brand-raised shadow-brand-3"
                    : "bg-brand-base text-brand-inverse border-brand-border hover:bg-brand-surface-card-hover"
                }`}
                id={`checklist-tab-${chk.id}`}
              >
                {chk.label}
              </button>
            ))}
          </div>

          {/* Items checklist */}
          <div className="space-y-3">
            {packingItems[checklistType].map((itemObj, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => toggleChecklistItem(checklistType, idx)}
                className="w-full text-left bg-brand-base hover:bg-brand-surface-card-hover border border-brand-border p-3.5 rounded-xl transition flex items-start gap-3 cursor-pointer focus:outline-none"
                id={`checklist-item-${checklistType}-${idx}`}
              >
                <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                  itemObj.checked ? "bg-brand-raised border-brand-raised text-brand-secondary" : "border-brand-border bg-brand-surface-card"
                }`}>
                  {itemObj.checked && <span className="text-[10px] font-bold">✓</span>}
                </div>
                <span className={`text-xs font-medium leading-relaxed ${itemObj.checked ? "line-through text-brand-inverse" : "text-brand-primary"}`}>
                  {itemObj.item}
                </span>
              </button>
            ))}
          </div>

          {/* Eco travel guideline advice */}
          <div className="mt-5 bg-brand-surface-card-selected border border-brand-raised/15 p-4 rounded-2xl flex gap-3 text-[11px] text-brand-primary">
            <Umbrella className="w-4 h-4 text-brand-raised shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-brand-raised mb-0.5">Eco-partner Traveling tip</p>
              <p className="text-brand-inverse">
                Kerala strictly bans single-use plastic bags. Carry reusable canvas bags and refillable water bottles to keep God's Own Country green!
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* DETAILED PRINT DIALOG / VOUCHER PREVIEW IF REQUESTED */}
      {viewingVoucher && (
        <div className="fixed inset-0 z-50 bg-brand-base overflow-y-auto p-6 md:p-12 print:p-0 print:static flex flex-col items-center">
          <div className="max-w-2xl w-full bg-brand-strong text-brand-secondary p-8 rounded-3xl border border-brand-border print:border-none shadow-brand-4 font-sans space-y-6">
            
            {/* Voucher Header */}
            <div className="flex justify-between items-start border-b-2 border-brand-secondary pb-4">
              <div>
                <h1 className="text-2xl font-extrabold text-brand-secondary tracking-tight">Keralayaatra</h1>
                <p className="text-xs font-semibold text-brand-inverse">Explore Kerala with Local Trust</p>
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold bg-brand-secondary text-brand-strong px-2.5 py-1 rounded">TRAVEL VOUCHER</span>
                <span className="block text-[11px] font-mono mt-1">Ref No: {viewingVoucher.bookingRef}</span>
              </div>
            </div>

            {/* Main content body */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="block text-[10px] font-bold text-brand-inverse uppercase tracking-wider mb-0.5">Reservation Subject</span>
                <h2 className="text-base font-extrabold text-brand-secondary">{viewingVoucher.title}</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-bold text-brand-inverse uppercase tracking-wider">Date of Service</span>
                  <span className="font-bold text-brand-secondary">{viewingVoucher.date}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-brand-inverse uppercase tracking-wider">Lead Customer Name</span>
                  <span className="font-bold text-brand-secondary">{viewingVoucher.details.guestName || viewingVoucher.details.custName || "Valued Visitor"}</span>
                </div>
              </div>

              <div className="border-t border-brand-border pt-4">
                <h4 className="text-xs font-bold text-brand-secondary uppercase tracking-wider mb-2">Service Details</h4>
                <div className="space-y-1 bg-brand-strong border border-brand-border rounded-xl p-3">
                  {viewingVoucher.bookingType === "taxi" && (
                    <>
                      <p>• <strong>Pickup:</strong> {viewingVoucher.details.pickup}</p>
                      <p>• <strong>Destination:</strong> {viewingVoucher.details.destination}</p>
                      <p>• <strong>Vehicle Class:</strong> {viewingVoucher.details.vehicleName}</p>
                      <p>• <strong>Rental Days:</strong> {viewingVoucher.details.days} Days outstation rental</p>
                      <p>• <strong>Estimated Route Distance:</strong> {viewingVoucher.details.routeDistance} km</p>
                    </>
                  )}
                  {viewingVoucher.bookingType === "tour" && (
                    <>
                      <p>• <strong>Tour Package ID:</strong> {viewingVoucher.details.tourId}</p>
                      <p>• <strong>Selected Hotels Category:</strong> {viewingVoucher.details.hotelStandard} deluxe</p>
                      <p>• <strong>Adults Count:</strong> {viewingVoucher.details.adultsCount} Travellers sharing</p>
                    </>
                  )}
                  {viewingVoucher.bookingType === "stay" && (
                    <>
                      <p>• <strong>Property:</strong> {viewingVoucher.details.stayName}</p>
                      <p>• <strong>Accomodations Type:</strong> {viewingVoucher.details.stayType}</p>
                      <p>• <strong>Location:</strong> {viewingVoucher.details.location}</p>
                      <p>• <strong>Stay Duration:</strong> {viewingVoucher.details.nights} Nights</p>
                    </>
                  )}
                  {viewingVoucher.bookingType === "itinerary" && (
                    <>
                      <p>• <strong>Custom Timeline Name:</strong> {viewingVoucher.details.title}</p>
                      <p>• <strong>Summary:</strong> {viewingVoucher.details.summary}</p>
                      <p>• <strong>Day Count:</strong> {viewingVoucher.details.duration} Days</p>
                    </>
                  )}
                </div>
              </div>

              {/* Price Voucher Row */}
              <div className="border-t-2 border-brand-secondary pt-4 flex justify-between items-center bg-brand-secondary/5 p-4 rounded-xl">
                <div>
                  <span className="block font-bold text-[10px] text-brand-inverse uppercase">Total Cost Breakdown</span>
                  <span className="text-xs font-bold">Driver fees + hotel rooms + toll inclusive</span>
                </div>
                <span className="text-lg font-extrabold text-brand-secondary">
                  {typeof viewingVoucher.cost === "number" ? `₹${viewingVoucher.cost.toLocaleString("en-IN")}` : viewingVoucher.cost}
                </span>
              </div>
            </div>

            {/* Footer and Terms */}
            <div className="border-t border-brand-border pt-4 text-[10px] text-brand-inverse space-y-1">
              <p>• <strong>Union regulations:</strong> All taxi rates follow standard regional state transport regulations.</p>
              <p>• <strong>Support desk:</strong> For real-time updates of driver details, contact support at <strong>+91 98460 12345</strong>.</p>
              <p>• <strong>Thank you for choosing Keralayaatra as your trusted Kerala exploration partner!</strong></p>
            </div>

            {/* Print action buttons */}
            <div className="flex justify-end gap-3 print:hidden pt-4 border-t border-brand-border">
              <button
                onClick={() => setViewingVoucher(null)}
                className="bg-brand-border hover:bg-brand-surface-card-hover text-brand-secondary px-5 py-2 rounded-xl text-xs font-bold cursor-pointer border border-brand-border"
                id="close-voucher-preview-btn"
              >
                Close Preview
              </button>
              <button
                onClick={() => window.print()}
                className="bg-brand-secondary hover:opacity-90 text-brand-strong px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                id="print-now-btn"
              >
                Print Voucher
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
