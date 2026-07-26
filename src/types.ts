export interface TaxiVehicle {
  id: string;
  name: string;
  type: "hatchback" | "sedan" | "suv" | "premium_suv" | "tempo";
  capacity: number;
  luggage: number;
  image: string;
  description: string;
  baseRatePerKm: number;
  minDailyKms: number;
}

export interface TaxiEstimate {
  billableKms: number;
  ratePerKm: number;
  baseFare: number;
  driverAllowance: number;
  tollPermitEstimation: number;
  total: number;
}

export interface TourPackage {
  id: string;
  name: string;
  durationDays: number;
  priceFrom: number;
  heroImage: string;
  description: string;
  categories: string[];
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  inclusions: string[];
  exclusions: string[];
}

export interface StayItem {
  id: string;
  name: string;
  type: "Homestay" | "Eco Resort" | "Heritage Bungalow" | "Houseboat";
  location: string;
  pricePerNight: number;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
  experiences: string[];
}

export interface SavedItinerary {
  id: string;
  title: string;
  summary: string;
  totalEstimatedCost: string;
  duration: number;
  destinations: string[];
  days: {
    dayNumber: number;
    theme: string;
    description: string;
    activities: string[];
    recommendedMeal: string;
    travelTip: string;
  }[];
  createdAt: string;
}

export interface BookingRequest {
  id: string;
  bookingType: "taxi" | "tour" | "stay" | "itinerary";
  title: string;
  date: string;
  details: Record<string, any>;
  cost: number | string;
  status: "confirmed" | "pending";
  bookingRef: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
