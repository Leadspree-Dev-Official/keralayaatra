import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Compass, MapPin, Clock, ShieldCheck, Heart, Plane, Send, CheckSquare, RefreshCw, BookmarkPlus, Map, Printer, HelpCircle, Utensils, MessageCircle, AlertCircle, RefreshCcw } from "lucide-react";
import { SavedItinerary, ChatMessage, BookingRequest } from "../types";

interface AITravelPlannerProps {
  onAddBooking: (booking: BookingRequest) => void;
  setActiveTab: (tab: string) => void;
  prefillDestinations?: string[];
  prefillDuration?: number;
}

const KERALA_DESTINATIONS = [
  { id: "cochin", label: "Cochin (Airport/Heritage Fort Kochi)" },
  { id: "munnar", label: "Munnar (Misty Tea Valleys)" },
  { id: "thekkady", label: "Thekkady (Periyar Forest & Wildlife)" },
  { id: "alleppey", label: "Alleppey (Floating Houseboats)" },
  { id: "kumarakom", label: "Kumarakom (Backwater Resorts)" },
  { id: "kovalam", label: "Kovalam (Scenic Crescent Beaches)" },
  { id: "varkala", label: "Varkala (Therapeutic Sea Cliffs)" },
  { id: "wayanad", label: "Wayanad (Waterfalls & Caves)" },
  { id: "athirappilly", label: "Athirappilly (The Niagara of India)" }
];

const TRAVEL_STYLES = [
  { id: "relaxed", label: "Relaxed / Leisure", desc: "Slower pace, late mornings, focus on spa, wellness and boat rest." },
  { id: "balanced", label: "Balanced / Sightseeing", desc: "Classic sightseeing pace, covers major highlights comfortably." },
  { id: "active", label: "Active Adventure", desc: "Fast-paced, high trekking, bamboo rafting, and jungle explorations." },
  { id: "honeymoon", label: "Romantic Honeymoon", desc: "Privacy focus, candlelit dinners, beautiful scenery, scenic resort stays." }
];

const INTERESTS = [
  { id: "nature", label: "Lush Tea & Hill Stations" },
  { id: "backwaters", label: "Houseboats & Lagoons" },
  { id: "beaches", label: "Cliff & Golden Beaches" },
  { id: "wildlife", label: "Wildlife Safaris & Forests" },
  { id: "food", label: "Authentic Kerala Culinary" },
  { id: "culture", label: "Kathakali & Martial Arts" }
];

const LOADING_MESSAGES = [
  "Steeping fresh cardamom in your tea plantations...",
  "Warming up the clay pots for traditional red fish curry...",
  "Aligning houseboats in Vembanad Lake canals...",
  "Re-checking road conditions on Cochin-Munnar ghat curves...",
  "Securing front-row seats for Periyar Kathakali dances...",
  "Consulting the weather spirits at Kovalam lighthouse...",
  "Brewing fresh organic toddy shop estimates..."
];

const CHAT_SUGGESTIONS = [
  "Suggest offbeat places to visit near Munnar hills",
  "Where can I eat the best Karimeen Pollichathu in Fort Kochi?",
  "What is the best way to travel from Alleppey to Varkala?",
  "Tell me about the traditional snake boat race calendar"
];

export default function AITravelPlanner({
  onAddBooking,
  setActiveTab,
  prefillDestinations,
  prefillDuration
}: AITravelPlannerProps) {
  
  // Form input states
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(5);
  const [style, setStyle] = useState<string>("balanced");
  const [budget, setBudget] = useState<string>("Mid-range");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["nature", "backwaters"]);
  const [passengers, setPassengers] = useState<number>(2);

  // Prefill hook
  useEffect(() => {
    if (prefillDestinations && prefillDestinations.length > 0) {
      setSelectedDestinations(prefillDestinations);
    }
    if (prefillDuration) {
      setDuration(prefillDuration);
    }
  }, [prefillDestinations, prefillDuration]);

  // AI Planner States
  const [itinerary, setItinerary] = useState<SavedItinerary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [activeDayTab, setActiveDayTab] = useState<number>(1);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Chat Guide States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Namaskaram! 🙏 I am your Keralayaatra Local Expert Guide. I live in Kochi and know every tea estate, toddy shop, boat crew, and forest path across Kerala. Ask me anything about local restaurants, actual travel times, traditional festivals, or weather conditions!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Loading messages loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleDestClick = (destLabel: string) => {
    if (selectedDestinations.includes(destLabel)) {
      setSelectedDestinations(selectedDestinations.filter(d => d !== destLabel));
    } else {
      setSelectedDestinations([...selectedDestinations, destLabel]);
    }
  };

  const handleInterestClick = (interestLabel: string) => {
    if (selectedInterests.includes(interestLabel)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interestLabel));
    } else {
      setSelectedInterests([...selectedInterests, interestLabel]);
    }
  };

  const handleGenerateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDestinations.length === 0) {
      alert("Please select at least one destination!");
      return;
    }

    setIsGenerating(true);
    setErrorText(null);
    setItinerary(null);
    setLoadingMsgIdx(0);

    try {
      const response = await fetch("/api/gemini/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration,
          travelStyle: TRAVEL_STYLES.find(t => t.id === style)?.label,
          budget,
          destinations: selectedDestinations,
          interests: selectedInterests.map(id => INTERESTS.find(i => i.id === id)?.label || id),
          passengers
        }),
      });

      if (!response.ok) {
        throw new Error("Local server failed or returned error");
      }

      const data = await response.json();
      setItinerary({
        ...data,
        id: "itinerary_" + Date.now(),
        duration,
        destinations: selectedDestinations,
        createdAt: new Date().toLocaleDateString()
      });
      setActiveDayTab(1);
    } catch (err: any) {
      console.error(err);
      setErrorText("Oops, our local model gateway returned an error. We are running in offline-fallback mockup mode. Please double check that you have added a valid GEMINI_API_KEY in your environment variables or .env file!");
    } finally {
      setIsGenerating(false);
    }
  };

  // Chat message submit handler
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: "user_" + Date.now(),
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      // Create request payload of history
      const historyPayload = chatMessages.slice(-8).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: historyPayload
        }),
      });

      if (!response.ok) {
        throw new Error("Chat api returned error");
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: "ai_" + Date.now(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: "ai_err_" + Date.now(),
        role: "assistant",
        content: "I am having trouble connecting to my AI server backend right now, likely because the GEMINI_API_KEY environment variable is not configured yet. No worries! All our offline features like Taxi Estimators, Handpicked itineraries, and Stays are fully active!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Add the custom generated itinerary to booking cart
  const handleSaveItineraryBooking = () => {
    if (!itinerary) return;

    const refCode = "KY-IT-" + Math.floor(100000 + Math.random() * 900000);
    const newBooking: BookingRequest = {
      id: "booking_" + Date.now(),
      bookingType: "itinerary",
      title: `AI Custom Tour: ${itinerary.title}`,
      date: itinerary.createdAt,
      details: {
        ...itinerary,
        refCode
      },
      cost: itinerary.totalEstimatedCost,
      status: "confirmed",
      bookingRef: refCode
    };

    onAddBooking(newBooking);
    alert(`This custom itinerary has been successfully saved to your My Bookings dashboard (Ref: ${refCode})! You can download or print it there.`);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in" id="ai-planner-tab">
      
      {/* Tab intro text */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 bg-brand-raised/10 border border-brand-raised/20 text-brand-raised px-4.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Vibe-First AI Trip Curation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-primary mb-3">
          Instant Custom Kerala AI Planner
        </h1>
        <p className="text-sm sm:text-base text-brand-inverse">
          Ditch cookie-cutter tour brochures. Fill in your travel dreams, and our local Gemini AI will architect a custom, geographically accurate, culinary-focused trip in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Trip Inputs Architect (5 cols) */}
        <div className="lg:col-span-5 bg-brand-surface-card border border-brand-border rounded-3xl p-5 sm:p-6 shadow-brand-1">
          <h2 className="text-base font-bold text-brand-primary uppercase tracking-wider border-b border-brand-border pb-3 mb-5 flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-raised" />
            <span>Plan Your Custom Voyage</span>
          </h2>

          <form onSubmit={handleGenerateItinerary} className="space-y-5">
            {/* 1. Multiselect Destinations */}
            <div>
              <label className="block text-xs font-bold text-brand-inverse uppercase tracking-wider mb-2">
                Where do you want to explore?
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto border border-brand-border p-2.5 rounded-xl bg-brand-base">
                {KERALA_DESTINATIONS.map((dest) => {
                  const isSelected = selectedDestinations.includes(dest.label);
                  return (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => handleDestClick(dest.label)}
                      className={`text-left text-[11px] font-bold px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-brand-raised text-brand-secondary border-brand-raised"
                          : "bg-brand-surface-card text-brand-inverse border-brand-border hover:bg-brand-surface-card-hover hover:text-brand-primary"
                      }`}
                      id={`dest-pill-${dest.id}`}
                    >
                      {isSelected ? "✓ " : ""} {dest.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Duration Days and Headcount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-inverse uppercase tracking-wider mb-1.5">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Math.min(14, Math.max(1, Number(e.target.value))))}
                  className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl px-3 py-2 text-sm"
                  min="1"
                  max="14"
                  required
                  id="ai-duration-input"
                />
                <span className="text-[10px] text-brand-inverse">Max 14 days</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-inverse uppercase tracking-wider mb-1.5">
                  Travellers Count
                </label>
                <input
                  type="number"
                  value={passengers}
                  onChange={(e) => setPassengers(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl px-3 py-2 text-sm"
                  min="1"
                  required
                  id="ai-passengers-input"
                />
              </div>
            </div>

            {/* 3. Budget Tier */}
            <div>
              <label className="block text-xs font-bold text-brand-inverse uppercase tracking-wider mb-2">
                Accommodations & Dining Budget
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "Budget", label: "Homestays", desc: "Local feel" },
                  { id: "Mid-range", label: "Deluxe Hotels", desc: "Twin AC rooms" },
                  { id: "Luxury", label: "Premium Resorts", desc: "Private pool villas" }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setBudget(tier.id)}
                    className={`p-2.5 rounded-xl border transition text-center focus:outline-none cursor-pointer ${
                      budget === tier.id
                        ? "bg-brand-raised text-brand-secondary border-brand-raised shadow-brand-3"
                        : "bg-brand-base border-brand-border text-brand-inverse hover:bg-brand-surface-card-hover"
                    }`}
                    id={`budget-tier-${tier.id.toLowerCase()}`}
                  >
                    <span className="block text-xs font-bold">{tier.id}</span>
                    <span className="block text-[9px] opacity-80 font-medium">{tier.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Travel style select */}
            <div>
              <label className="block text-xs font-bold text-brand-inverse uppercase tracking-wider mb-1.5">
                Trip Tempo / Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-brand-base text-brand-primary border border-brand-border rounded-xl px-3 py-2.5 text-sm"
                id="ai-style-select"
              >
                {TRAVEL_STYLES.map((ts) => (
                  <option key={ts.id} value={ts.id}>
                    {ts.label} ({ts.desc.substring(0, 45)}...)
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Core Interests */}
            <div>
              <label className="block text-xs font-bold text-brand-inverse uppercase tracking-wider mb-2">
                Thematic Vibe Focuses
              </label>
              <div className="grid grid-cols-2 gap-2">
                {INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => handleInterestClick(interest.id)}
                      className={`text-left text-xs p-2.5 rounded-xl border transition cursor-pointer ${
                        isSelected
                          ? "bg-brand-surface-card-selected border-brand-raised text-brand-raised"
                          : "bg-brand-base border-brand-border text-brand-inverse hover:bg-brand-surface-card-hover hover:text-brand-primary"
                      }`}
                      id={`interest-btn-${interest.id}`}
                    >
                      <span>{interest.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full bg-brand-raised text-brand-secondary font-extrabold text-sm py-3.5 rounded-xl transition shadow-brand-3 flex items-center justify-center gap-2 cursor-pointer ${
                isGenerating ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.01]"
              }`}
              id="ai-generate-itinerary-btn"
            >
              <Sparkles className="w-5 h-5 shrink-0" />
              <span>{isGenerating ? "Drafting Custom Itinerary..." : "Architect Custom Itinerary"}</span>
            </button>
          </form>
        </div>

        {/* RIGHT: Display Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* AI Generation state loader */}
          {isGenerating && (
            <div className="bg-brand-surface-card border border-brand-border rounded-3xl p-12 text-center shadow-brand-4 space-y-5 animate-pulse min-h-[400px] flex flex-col justify-center items-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-brand-raised/20 border-t-brand-raised rounded-full animate-spin" />
                <Sparkles className="w-6 h-6 text-brand-raised absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="text-base font-bold text-brand-primary">Curating Your Perfect Itinerary</h4>
                <p className="text-xs text-brand-inverse leading-relaxed">
                  Our local AI travel consultant is checking ferry times, hotel standards, and kitchen schedules...
                </p>
              </div>
              <div className="bg-brand-base border border-brand-border px-5 py-2.5 rounded-xl text-[11px] text-brand-raised font-semibold animate-fade-in">
                {LOADING_MESSAGES[loadingMsgIdx]}
              </div>
            </div>
          )}

          {/* Fallback Warning Box */}
          {errorText && (
            <div className="bg-amber-950/20 border border-amber-900/40 rounded-2xl p-5 text-amber-200 text-xs flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">Preview Notice</p>
                <p className="leading-relaxed mb-3">{errorText}</p>
                <button
                  onClick={async () => {
                    // Try to trigger fallbacks
                    setIsGenerating(true);
                    setTimeout(() => {
                      setIsGenerating(false);
                      setItinerary({
                        id: "itinerary_" + Date.now(),
                        title: "Curated Scenic Munnar & Houseboat Safari",
                        summary: "Enjoy a high-contrast nature immersion through mist-clad mountains and sleepy water pathways. Highly customizable.",
                        totalEstimatedCost: "₹19,200 - ₹25,500",
                        duration,
                        destinations: selectedDestinations.length > 0 ? selectedDestinations : ["Munnar", "Alleppey"],
                        days: [
                          {
                            dayNumber: 1,
                            theme: "Arrive in Cochin & Transfer to High Hills",
                            description: "Your local personal chauffeur collects you from the airport and climbs winding roads past mountain cascades.",
                            activities: ["Sightsee Cheeyappara waterfalls", "Check into plantation cottage", "Walk spices trail"],
                            recommendedMeal: "Hot Appam with vegetable stew at local cottage dining.",
                            travelTip: "Climb before dusk to witness the foggy tea valleys sunset."
                          },
                          {
                            dayNumber: 2,
                            theme: "Explore Tea Estates & Boat Canopy",
                            description: "Take an early jungle safari inside Periyar forest to track elephants. Later, board a luxurious coconut-fiber houseboat.",
                            activities: ["Tata Tea Museum orthogonal tour", "Periyar Lake boat cruise", "Private houseboat dining on Vembanad Lake"],
                            recommendedMeal: "Fresh fried backwater Karimeen Pearl Spot fish in clay pot.",
                            travelTip: "Carry lightweight woollen wraps for cooler evening breezes."
                          }
                        ],
                        createdAt: new Date().toLocaleDateString()
                      });
                    }, 1200);
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-brand-primary px-4 py-1.5 rounded-xl font-bold cursor-pointer transition"
                  id="fallback-itinerary-btn"
                >
                  Generate Mock Itinerary Anyway
                </button>
              </div>
            </div>
          )}

          {/* RENDER ITINERARY RESULT */}
          {itinerary && !isGenerating && (
            <div className="bg-brand-surface-card border border-brand-border rounded-3xl p-5 sm:p-6 shadow-brand-4 space-y-6 animate-slide-up" id="itinerary-result-box">
              
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-brand-border pb-5">
                <div>
                  <span className="text-[10px] bg-brand-raised/15 text-brand-raised font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand-raised animate-pulse" />
                    <span>AI Curated Trip Itinerary</span>
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-brand-primary mt-2 leading-tight">
                    {itinerary.title}
                  </h3>
                  <p className="text-xs text-brand-inverse mt-1 leading-relaxed">{itinerary.summary}</p>
                </div>

                <div className="text-left sm:text-right shrink-0 bg-brand-base border border-brand-border p-3 rounded-2xl">
                  <span className="block text-[9px] text-brand-inverse font-bold uppercase tracking-wider">Estimated Tour Fare</span>
                  <span className="text-xl font-extrabold text-brand-raised">{itinerary.totalEstimatedCost}</span>
                  <span className="block text-[9px] text-brand-inverse">for {passengers} travelers</span>
                </div>
              </div>

              {/* Day filter Tab bar */}
              <div className="flex flex-wrap gap-1 border-b border-brand-border pb-3">
                {itinerary.days.map((day) => (
                  <button
                    key={day.dayNumber}
                    onClick={() => setActiveDayTab(day.dayNumber)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeDayTab === day.dayNumber
                        ? "bg-brand-raised text-brand-secondary font-semibold"
                        : "bg-brand-base text-brand-inverse border border-brand-border hover:text-brand-primary"
                    }`}
                    id={`day-tab-btn-${day.dayNumber}`}
                  >
                    Day {day.dayNumber}
                  </button>
                ))}
              </div>

              {/* Active Day Content */}
              {itinerary.days.map((day) => {
                if (day.dayNumber !== activeDayTab) return null;
                return (
                  <div key={day.dayNumber} className="space-y-5 animate-fade-in font-sans">
                    <div>
                      <span className="text-[10px] font-bold text-brand-raised uppercase tracking-wide">
                        Day Focus:
                      </span>
                      <h4 className="text-base font-extrabold text-brand-primary">
                        Day {day.dayNumber} ➔ {day.theme}
                      </h4>
                      <p className="text-xs text-brand-inverse mt-1.5 leading-relaxed">
                        {day.description}
                      </p>
                    </div>

                    {/* Sights and Activities */}
                    <div>
                      <span className="block text-[10px] font-bold text-brand-raised uppercase tracking-wider mb-2">
                        Sightseeing & Activities:
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {day.activities.map((act, i) => (
                          <li key={i} className="bg-brand-base border border-brand-border p-3 rounded-xl flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-brand-raised shrink-0" />
                            <span className="text-xs text-brand-primary font-medium">{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Dining and Tips bottom grids */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-brand-border">
                      <div className="bg-brand-surface-card-hover border border-brand-border p-3.5 rounded-2xl">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-brand-raised uppercase mb-1">
                          <Utensils className="w-3.5 h-3.5 text-brand-raised" />
                          <span>Culinary Highlight</span>
                        </span>
                        <p className="text-xs text-brand-primary leading-relaxed">
                          {day.recommendedMeal}
                        </p>
                      </div>

                      <div className="bg-brand-surface-card-selected border border-brand-raised/20 p-3.5 rounded-2xl">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-brand-raised uppercase mb-1">
                          <HelpCircle className="w-3.5 h-3.5 text-brand-raised" />
                          <span>Local Driver Guideline</span>
                        </span>
                        <p className="text-xs text-brand-primary leading-relaxed">
                          {day.travelTip}
                        </p>
                      </div>
                    </div>

                  </div>
                );
              })}

              {/* Save & print itinerary controls */}
              <div className="border-t border-brand-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveItineraryBooking}
                    className="flex items-center gap-2 bg-brand-raised text-brand-secondary px-5 py-2.5 rounded-xl text-xs font-extrabold hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                    id="save-ai-itinerary-btn"
                  >
                    <BookmarkPlus className="w-4 h-4" />
                    <span>Save to Trip Dashboard</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 bg-brand-base hover:bg-brand-surface-card-hover border border-brand-border text-brand-primary px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                    id="print-ai-itinerary-btn"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Itinerary</span>
                  </button>
                </div>

                <span className="text-[10px] text-brand-inverse font-medium">
                  Created on {itinerary.createdAt} | Fully customizable
                </span>
              </div>

            </div>
          )}

          {/* RENDER CHAT INTERFACE WITH LOCAL EXPERT */}
          <div className="bg-brand-surface-card border border-brand-border rounded-3xl p-5 shadow-brand-1 flex flex-col h-[400px]">
            <h3 className="text-sm font-bold text-brand-primary uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-brand-raised animate-pulse" />
              <span>Keralayaatra Local Expert Live Assistant</span>
            </h3>

            {/* Suggestions buttons block */}
            <div className="flex items-center gap-1 overflow-x-auto py-2 shrink-0 scrollbar-none">
              {CHAT_SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug)}
                  className="text-[10px] bg-brand-base hover:bg-brand-surface-card-hover border border-brand-border text-brand-primary px-3 py-1.5 rounded-xl shrink-0 transition cursor-pointer"
                  id={`chat-sug-btn-${idx}`}
                >
                  {sug.substring(0, 35)}...
                </button>
              ))}
            </div>

            {/* Chat message display area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-brand-base/50 rounded-2xl border border-brand-border mb-4 font-sans text-xs">
              {chatMessages.map((msg) => {
                const isAI = msg.role === "assistant";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${isAI ? "self-start items-start" : "self-end items-end ml-auto"}`}
                  >
                    <span className="text-[9px] text-brand-inverse mb-1">
                      {isAI ? "Local Guide" : "You"} • {msg.timestamp}
                    </span>
                    <div
                      className={`p-3 rounded-2xl leading-relaxed ${
                        isAI
                          ? "bg-brand-surface-card border border-brand-border text-brand-primary rounded-tl-none"
                          : "bg-brand-raised text-brand-secondary font-medium rounded-tr-none"
                      }`}
                    >
                      {/* Formatted newlines rendering */}
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
                  </div>
                );
              })}
              {chatLoading && (
                <div className="self-start bg-brand-surface-card border border-brand-border rounded-2xl rounded-tl-none p-3 text-[10px] text-brand-inverse animate-pulse">
                  Local Expert is typing local food advice...
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input message form block */}
            <div className="flex gap-2 shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(chatInput)}
                placeholder="Ask local advice (e.g. 'Is Fort Kochi safe for solo walking late at night?')"
                className="flex-1 bg-brand-base text-brand-primary border border-brand-border rounded-xl px-4 py-2 text-xs focus:outline-none"
                id="chat-text-input"
              />
              <button
                onClick={() => handleSendMessage(chatInput)}
                disabled={chatLoading}
                className="bg-brand-raised text-brand-secondary p-2.5 rounded-xl hover:scale-105 transition cursor-pointer flex items-center justify-center"
                id="chat-send-msg-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
