import React from "react";
import { Compass, Car, Map, Home, Sparkles, ClipboardList, PhoneCall } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bookingCount: number;
}

export default function Header({ activeTab, setActiveTab, bookingCount }: HeaderProps) {
  const navItems = [
    { id: "home", label: "Overview", icon: Compass },
    { id: "taxi", label: "Taxi Planner", icon: Car },
    { id: "tours", label: "Tours", icon: Map },
    { id: "stays", label: "Homestays & Resorts", icon: Home },
    { id: "ai", label: "AI Trip Planner", icon: Sparkles, accent: true },
    { id: "bookings", label: "My Bookings", icon: ClipboardList, badge: bookingCount },
  ];

  return (
    <header className="sticky top-0 z-50 bg-brand-base/95 backdrop-blur-md border-b border-brand-border px-4 py-3 lg:px-8 shadow-brand-1">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveTab("home")}
          className="flex items-center gap-3 group focus:outline-none"
          id="logo-btn"
        >
          <div className="bg-brand-raised text-brand-secondary p-2.5 rounded-xl group-hover:rotate-6 transition-transform">
            <Compass className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <span className="block text-xl font-bold tracking-tight text-brand-primary group-hover:text-brand-raised transition-colors" data-brand-text="business-name" data-brand-default="Keralayaatra">
              Keralayaatra
            </span>
            <span className="block text-xs font-medium text-brand-inverse" data-brand-text="contact-name" data-brand-default="Your Trusted Local Partner">
              Your Trusted Local Partner
            </span>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap justify-center items-center gap-1.5 bg-brand-surface-card p-1 rounded-2xl border border-brand-border">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? item.accent
                      ? "bg-brand-raised text-brand-secondary shadow-brand-3 font-semibold"
                      : "bg-brand-border text-brand-primary"
                    : "text-brand-inverse hover:text-brand-primary hover:bg-brand-surface-card-hover"
                }`}
                id={`nav-${item.id}`}
              >
                <Icon className={`w-4 h-4 ${isActive && item.accent ? "animate-pulse" : ""}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="flex items-center justify-center bg-brand-raised text-brand-secondary text-[10px] font-bold w-4.5 h-4.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Contact Info */}
        <div className="hidden lg:flex items-center gap-3.5 text-right">
          <div className="bg-brand-surface-card p-2 rounded-xl border border-brand-border text-brand-raised">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[11px] font-medium text-brand-inverse tracking-wide uppercase">
              24/7 Local Support
            </span>
            <a
              href="tel:+919876543210"
              className="text-sm font-bold text-brand-primary hover:text-brand-raised transition-colors"
            >
              +91 98460 12345
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
