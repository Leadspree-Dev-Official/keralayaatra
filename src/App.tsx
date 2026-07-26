import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import TaxiPlanner from "./components/TaxiPlanner";
import TourExplorer from "./components/TourExplorer";
import StayExplorer from "./components/StayExplorer";
import AITravelPlanner from "./components/AITravelPlanner";
import MyBookings from "./components/MyBookings";
import { BrandProvider, useBrand } from "./components/brand-demo/BrandProvider";
import { OnboardingModal, BrandResetButton } from "./components/brand-demo/OnboardingModal";
import AdminConsole from "./components/brand-demo/AdminConsole";
import { BookingRequest } from "./types";
import { Compass, Car, Sparkles, ShieldCheck, MapPin, Coffee, Sun, CloudRain, Clock } from "lucide-react";

export default function App() {
  const isAdmin = window.location.pathname === "/admin";
  return (
    <BrandProvider>
      {isAdmin ? <AdminConsole /> : <MainApp />}
    </BrandProvider>
  );
}

function MainApp() {
  const { countdown, session } = useBrand();
  const [activeTab, setActiveTab] = useState<string>("home");
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [aiPrefill, setAiPrefill] = useState<{ destinations: string[]; duration: number }>({
    destinations: [],
    duration: 5
  });

  // Clock state representing actual local Kerala time (IST is UTC + 5.5 hours)
  const [istTime, setIstTime] = useState<string>("");

  useEffect(() => {
    // Load existing bookings from local storage
    try {
      const saved = localStorage.getItem("keralayaatra_bookings");
      if (saved) {
        setBookings(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load local bookings:", e);
    }

    // Dynamic IST Clock timer
    const updateIST = () => {
      const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
      const istOffset = 5.5 * 3600000;
      const istDate = new Date(utc + istOffset);
      setIstTime(istDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }));
    };
    updateIST();
    const interval = setInterval(updateIST, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save bookings helper
  const handleAddBooking = (newBooking: BookingRequest) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    try {
      localStorage.setItem("keralayaatra_bookings", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save booking:", e);
    }
  };

  const handleCancelBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    try {
      localStorage.setItem("keralayaatra_bookings", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to update bookings:", e);
    }
  };

  const handleSetAiPrefillParams = (params: { destinations: string[]; duration: number }) => {
    setAiPrefill(params);
  };

  return (
    <div className="min-h-screen bg-brand-base text-brand-primary flex flex-col font-sans selection:bg-brand-raised selection:text-brand-secondary">
      
      {/* Brand Demo Components */}
      <OnboardingModal />
      <BrandResetButton />

      {/* Header component */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} bookingCount={bookings.length} />

      {/* Session Status Pill */}
      {session && countdown && (
        <div className="fixed top-2 right-4 z-[80] bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 text-[11px] text-white/50 flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-brand-raised" />
          <span>Resets in {countdown}</span>
        </div>
      )}

      {/* Main active content section */}
      <main className="flex-1 pb-16">
        {activeTab === "home" && (
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in" id="home-tab">
            
            {/* HERO SECTION */}
            <div className="relative rounded-3xl overflow-hidden border border-brand-border bg-gradient-to-br from-brand-surface-card to-brand-base p-6 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-8 shadow-brand-4">
              <div className="flex-1 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 bg-brand-border text-brand-raised border border-brand-border px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-brand-raised" />
                  <span>Licensed Kerala Tour Partner</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary leading-[1.1]">
                  Explore Kerala <br />
                  <span className="text-brand-raised">With Absolute Local Trust.</span>
                </h1>
                <p className="text-sm sm:text-base text-brand-inverse max-w-xl leading-relaxed">
                  Avoid deceptive taxi brokers and over-priced tour middlemen. We compute your transfers dynamically on standard mileage union guidelines, booking you in sustainable certified homestays with professional driver guides.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab("ai")}
                    className="flex items-center gap-2 bg-brand-raised hover:scale-[1.02] text-brand-secondary font-extrabold text-sm px-6 py-3 rounded-xl transition duration-150 cursor-pointer shadow-brand-3"
                    id="hero-ai-btn"
                  >
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>Plan with AI Itinerary Guide</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("taxi")}
                    className="flex items-center gap-1.5 bg-brand-surface-card hover:bg-brand-surface-card-hover border border-brand-border hover:border-brand-raised text-brand-primary font-bold text-sm px-6 py-3 rounded-xl transition duration-150 cursor-pointer"
                    id="hero-taxi-btn"
                  >
                    <Car className="w-4 h-4" />
                    <span>Estimate Taxi Fare</span>
                  </button>
                </div>
              </div>

              {/* Side Aesthetic card with live IST Kerala clock */}
              <div className="w-full lg:w-96 bg-brand-surface-card border border-brand-border p-6 rounded-2xl flex flex-col justify-between h-72 shadow-brand-1">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-brand-raised uppercase tracking-wider">Live Kerala Climate</span>
                    <div className="flex items-center gap-1.5 text-xs text-brand-inverse font-semibold">
                      <Sun className="w-3.5 h-3.5 text-brand-raised animate-spin-slow" />
                      <span>28°C • Monsoon Hills</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="block text-[10px] text-brand-inverse uppercase font-semibold">IST Time (Cochin Base)</span>
                    <span className="block text-4xl font-mono font-extrabold tracking-wider text-brand-primary">
                      {istTime || "12:00:00 PM"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-brand-border pt-4">
                  <span className="block text-xs font-extrabold text-brand-primary mb-1">Guaranteed Service Pillars</span>
                  <ul className="space-y-1 text-[11px] text-brand-inverse">
                    <li className="flex items-center gap-1.5">✓ Zero booking advance needed</li>
                    <li className="flex items-center gap-1.5">✓ 24/7 local Malayalam, English & Hindi support</li>
                    <li className="flex items-center gap-1.5">✓ Handpicked, certified heritage stays</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* THREE COLUMN VALUE CARD PROP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Transparent Taxi Estimation",
                  desc: "Configure multi-day outstation routes, pick vehicle fleet (Hatchback to Tempo Travellers), and receive guaranteed final union costs with chauffeur driver allowance inclusive.",
                  icon: Car,
                  actionLabel: "Launch Taxi Planner",
                  tab: "taxi"
                },
                {
                  title: "Handpicked Stays & Stays",
                  desc: "Rest easy in sustainable cardamom farm treehouses, traditional floating houseboats, or centuries-old courtyard bungalows. No standard commercial hotels allowed.",
                  icon: Coffee,
                  actionLabel: "Explore Stays",
                  tab: "stays"
                },
                {
                  title: "Instant AI Curated Trips",
                  desc: "Explain your travel companions, dates, and thematic interests. Our custom local Gemini AI compiles detailed timelines with driver instructions and culinary dishes.",
                  icon: Sparkles,
                  actionLabel: "Launch AI Architect",
                  tab: "ai"
                }
              ].map((pill, idx) => {
                const Icon = pill.icon;
                return (
                  <div
                    key={idx}
                    className="bg-brand-surface-card border border-brand-border p-5 rounded-2xl flex flex-col justify-between shadow-brand-1 hover:border-brand-raised/40 transition duration-200"
                  >
                    <div className="space-y-2.5">
                      <div className="w-10 h-10 bg-brand-raised/10 text-brand-raised rounded-xl flex items-center justify-center border border-brand-raised/20">
                        <Icon className="w-5 h-5 stroke-[2]" />
                      </div>
                      <h3 className="text-base font-extrabold text-brand-primary">{pill.title}</h3>
                      <p className="text-xs text-brand-inverse leading-relaxed">{pill.desc}</p>
                    </div>

                    <button
                      onClick={() => setActiveTab(pill.tab)}
                      className="text-xs font-bold text-brand-raised hover:text-brand-primary text-left mt-4 inline-flex items-center gap-1 transition-all cursor-pointer group"
                    >
                      <span>{pill.actionLabel}</span>
                      <span className="group-hover:translate-x-1 transition-transform">➔</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* CUSTOMER EXPERIMENTAL REVIEWS */}
            <div className="bg-brand-surface-card border border-brand-border rounded-3xl p-6 sm:p-8 space-y-5">
              <h2 className="text-lg font-bold text-brand-primary uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
                <Compass className="w-5 h-5 text-brand-raised" />
                <span>Happy Travelers Feedback</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="bg-brand-base border border-brand-border p-4.5 rounded-2xl space-y-3.5">
                  <p className="italic text-brand-primary leading-relaxed">
                    \"Keralayaatra changed our view on booking taxis in India! No bargaining, no surprises. Chauffeur Sreejith was like a family member, explaining the tea leaf plucking process in Munnar and stopping at the cleanest toddy cafes. Exceptional transparent service!\"
                  </p>
                  <div>
                    <span className="block font-bold text-brand-raised">Amit & Riya Sen</span>
                    <span className="block text-[10px] text-brand-inverse">Travelled in Innova Crysta • Kolkata</span>
                  </div>
                </div>

                <div className="bg-brand-base border border-brand-border p-4.5 rounded-2xl space-y-3.5">
                  <p className="italic text-brand-primary leading-relaxed">
                    \"The AI itinerary planner generated a stunningly realistic schedule. Usually AI misses actual road times, but this one knew Cochin to Munnar uphill drive timings perfectly. The homestay at Cardamom Treehouse was out of this world. Five stars!\"
                  </p>
                  <div>
                    <span className="block font-bold text-brand-raised">Jonathan & Sarah</span>
                    <span className="block text-[10px] text-brand-inverse">5-Day custom honeymoon tour • London</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === "taxi" && (
          <TaxiPlanner onAddBooking={handleAddBooking} setActiveTab={setActiveTab} />
        )}

        {activeTab === "tours" && (
          <TourExplorer
            onAddBooking={handleAddBooking}
            setActiveTab={setActiveTab}
            setAiParams={handleSetAiPrefillParams}
          />
        )}

        {activeTab === "stays" && (
          <StayExplorer onAddBooking={handleAddBooking} setActiveTab={setActiveTab} />
        )}

        {activeTab === "ai" && (
          <AITravelPlanner
            onAddBooking={handleAddBooking}
            setActiveTab={setActiveTab}
            prefillDestinations={aiPrefill.destinations}
            prefillDuration={aiPrefill.duration}
          />
        )}

        {activeTab === "bookings" && (
          <MyBookings bookings={bookings} onCancelBooking={handleCancelBooking} />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-brand-surface-card border-t border-brand-border py-8 px-4 text-center text-brand-inverse text-xs space-y-3 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-medium text-brand-primary text-left">
            © 2026 <span data-brand-text="business-name" data-brand-default="Keralayaatra.com">Keralayaatra.com</span>. Your Trusted Local Partner for Exploring Kerala Comfortably.
          </p>
          <div className="flex flex-wrap gap-4 text-brand-inverse font-semibold justify-center md:justify-end">
            <a href="tel:+919846012345" className="hover:text-brand-raised transition" data-brand-text="phone" data-brand-default="+91 98460 12345">Kochi Support Helpline</a>
            <span>•</span>
            <span className="text-brand-raised" data-brand-text="address" data-brand-default="Kerala, India">Zero Middlemen Guarantee</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 border-t border-brand-border/40 pt-3 text-[11px] text-brand-inverse">
          <p className="text-left leading-relaxed max-w-xl">
            All travel schedules, taxi Union rates, and guest allocations conform strictly to the Kerala State Motor Union and Sustainable Tourism guidelines.
          </p>
          <p className="md:text-right font-medium">
            Developer: <span className="text-brand-primary font-semibold">Aniruddha Das</span> | Developed by{" "}
            <a
              href="https://leadspree.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-raised hover:underline font-bold"
            >
              LeadSpree Business Solutions
            </a>
          </p>
        </div>
      </footer>

    </div>
  );
}
