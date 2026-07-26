import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
// Using the recommended server-side approach and required header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("GEMINI_API_KEY is not defined. AI Planner will run in demo/fallback mode.");
}

// 1. API: Custom AI Trip Planner
app.post("/api/gemini/plan", async (req, res) => {
  try {
    const { duration, travelStyle, budget, destinations, interests, passengers } = req.body;

    if (!ai) {
      // Return fallback high-quality mockup if API key is missing
      return res.json(getFallbackItinerary(destinations || ["Munnar", "Alleppey"], duration || 4, travelStyle || "Balanced"));
    }

    const prompt = `Create a custom, realistic day-by-day Kerala travel itinerary for a ${duration}-day trip.
Style: ${travelStyle || "Balanced"}
Budget Tier: ${budget || "Mid-range"}
Destination(s): ${Array.isArray(destinations) ? destinations.join(", ") : destinations || "Kerala highlights"}
Core Interests: ${Array.isArray(interests) ? interests.join(", ") : interests || "Nature, Sightseeing"}
Group size: ${passengers || 2} travellers.

Focus heavily on genuine Kerala geography, travel timings (e.g. Cochin to Munnar takes ~4 hours, Munnar to Thekkady takes ~3 hours, Houseboats are in Alleppey/Kumarakom), and include local culinary recommendations (like Toddy shop foods, Appam and Stew, Karimeen, Malabar Biryani). Make it inspiring, highly practical, and memorable.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are Keralayaatra's chief trip curator and a local Kerala destination expert. You design highly precise, beautifully organized, culturally rich itineraries. You must strictly output JSON matching the specified schema. Ensure all activities, routes, and timings are geographically accurate.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "summary", "totalEstimatedCost", "days"],
          properties: {
            title: {
              type: Type.STRING,
              description: "An attractive title for the itinerary (e.g., 'Mist & Backwaters: A Majestic 5-Day Kerala Escape')",
            },
            summary: {
              type: Type.STRING,
              description: "A 2-3 sentence engaging overview of the trip experience, vibe, and travel comfort.",
            },
            totalEstimatedCost: {
              type: Type.STRING,
              description: "Rough realistic estimation of taxi + stay + activity cost in INR (e.g. '₹24,500 - ₹32,000')",
            },
            days: {
              type: Type.ARRAY,
              description: "Day-by-day plan of the journey.",
              items: {
                type: Type.OBJECT,
                required: ["dayNumber", "theme", "description", "activities", "recommendedMeal", "travelTip"],
                properties: {
                  dayNumber: {
                    type: Type.INTEGER,
                    description: "Numerical day (e.g., 1, 2, 3)",
                  },
                  theme: {
                    type: Type.STRING,
                    description: "Main theme/focus of the day (e.g., 'Arriving in Cochin & Driving to Munnar Hills')",
                  },
                  description: {
                    type: Type.STRING,
                    description: "An engaging paragraph detailing the route, sightseeing, and overall experience.",
                  },
                  activities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3 to 4 specific activities or sights visited (e.g., 'Visit Valara & Cheeyappara waterfalls', 'Stroll through Tata Tea Museum')",
                  },
                  recommendedMeal: {
                    type: Type.STRING,
                    description: "A specific local dish and recommendation for lunch/dinner (e.g. 'Traditional Kerala Sadya on a banana leaf at Cochin, or hot Kappa & Fish Curry')",
                  },
                  travelTip: {
                    type: Type.STRING,
                    description: "A helpful practical local tip (e.g., 'Start early from Cochin to avoid bottleneck traffic at Aluva', 'Carry light woollens for chilly Munnar evenings')",
                  },
                },
              },
            },
          },
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No text returned from Gemini");
    }

    const parsedItinerary = JSON.parse(resultText);
    res.json(parsedItinerary);
  } catch (error: any) {
    console.error("Gemini Plan Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate travel itinerary" });
  }
});

// 2. API: Interactive Local Guide Chat
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!ai) {
      return res.json({
        reply: "Hi there! I am currently running in offline demo mode. To experience my full real-time intelligence, please add a valid `GEMINI_API_KEY` to your environment variables or `.env` file. In the meantime, feel free to browse our pre-curated tours and customize your taxi route in the tabs above.",
      });
    }

    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: `You are the 'Keralayaatra Local Expert Guide' – an exceptionally friendly, passionate, and knowledgeable travel companion for visitors exploring Kerala, India.
Key traits:
- Speak with warm South Indian hospitality.
- Recommend authentic experiences (e.g. Kathakali shows in Fort Kochi, spice plantations in Thekkady, floating houseboats in Alleppey, tea tasting in Munnar).
- Suggest genuine local food items: Appam with stew, Karimeen Pollichathu, Malabar Parotta with chicken/beef fry, Puttu and Kadala curry, banana chips, and fresh toddy.
- Provide useful geographic and timing insights: Kerala is stretched along the coast; moving hill-to-coast takes several hours of driving.
- Offer safety, taxi, and homestay advice in Kerala.
- Keep your answers inspiring, highly engaging, and structured with concise, easy-to-read bullet points where appropriate. Use INR (₹) for prices.`,
      },
      history: formattedHistory,
    });

    const response = await chat.sendMessage({ message: message });
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to chat with AI Guide" });
  }
});

// Taxi calculation helper route (strictly backend)
app.post("/api/taxi/estimate", (req, res) => {
  const { routeDistance, vehicleType, days = 1, packageType = "round" } = req.body;
  // Calculate pricing based on realistic Kerala taxi union guidelines:
  // Hatchback: ₹14/km, Sedan: ₹16/km, SUV (Ertiga): ₹20/km, Premium SUV (Innova Crysta): ₹24/km, Tempo Traveller: ₹28/km
  // Driver allowance: ₹500/day
  // Minimum km per day: 200 km for outstation
  const rates: Record<string, number> = {
    hatchback: 14,
    sedan: 16,
    suv: 20,
    premium_suv: 24,
    tempo: 28,
  };

  const perKmRate = rates[vehicleType] || 16;
  const driverAllowancePerDay = 500;
  
  // Calculate total kilometers
  const minKms = days * 200;
  const actualKms = packageType === "round" ? routeDistance * 2 : routeDistance;
  const billableKms = Math.max(actualKms, minKms);

  const baseFare = billableKms * perKmRate;
  const driverAllowance = days * driverAllowancePerDay;
  const tollPermitEstimation = packageType === "one_way" && routeDistance > 150 ? 800 : 400;
  const total = baseFare + driverAllowance + tollPermitEstimation;

  res.json({
    billableKms,
    ratePerKm: perKmRate,
    baseFare,
    driverAllowance,
    tollPermitEstimation,
    total,
  });
});

// Fallback high-quality itinerary when API key is not present
function getFallbackItinerary(destinations: string[], duration: number, style: string) {
  const primaryDest = destinations[0] || "Munnar";
  const secondaryDest = destinations[1] || "Alleppey";

  return {
    title: `Classic Kerala: Scenic ${primaryDest} & ${secondaryDest} Explorer`,
    summary: `Enjoy a perfectly paced ${duration}-day immersive journey highlighting the misty hill gardens of ${primaryDest} and the tranquil houseboats of ${secondaryDest}. Highly recommended for nature enthusiasts and family getaways.`,
    totalEstimatedCost: "₹18,500 - ₹24,000",
    days: Array.from({ length: duration }).map((_, idx) => {
      const dayNum = idx + 1;
      if (dayNum === 1) {
        return {
          dayNumber: 1,
          theme: `Arrive in Cochin & Transfer to ${primaryDest}`,
          description: `Land at Cochin International Airport (COK). Meet your dedicated Keralayaatra chauffeur and embark on a scenic uphill drive winding past cascading waterfalls and rubber plantations to ${primaryDest}.`,
          activities: [
            "Airport reception and welcome beverage",
            "Stopover at Cheeyappara & Valara Waterfalls",
            "Check-in at a scenic local homestay or eco-resort",
            "Leisure evening stroll through cardamom-scented pathways",
          ],
          recommendedMeal: "Warm Malabar Parotta with traditional veg kurma or spicy Kozhikode chicken curry.",
          travelTip: "Start your road journey before 2:00 PM to capture the sunset amidst the tea gardens on your climb.",
        };
      } else if (dayNum === duration) {
        return {
          dayNumber: dayNum,
          theme: `Cochin Heritage Walk & Departure`,
          description: `Conclude your magical holiday. Drive down to Fort Kochi to explore history, witness Chinese fishing nets, and grab souvenirs before heading back to the airport for your onward flight.`,
          activities: [
            "Explore colonial Fort Kochi and St. Francis Church",
            "Photo session at the Chinese Fishing Nets",
            "Spice shopping at the local Mattancherry market",
            "Airport drop-off timed perfectly with your flight",
          ],
          recommendedMeal: "Freshly fried pearl spot fish (Karimeen Pollichathu) at a local seaside cafe.",
          travelTip: "Keep your flight ticket and IDs handy as security check-in at Cochin airport can sometimes have peak queues.",
        };
      } else if (dayNum === 2) {
        return {
          dayNumber: 2,
          theme: `Tea Gardens, Eravikulam & Viewpoints in ${primaryDest}`,
          description: `Spend a full day exploring the high ranges. Walk through manicured green tea hills, spot the rare Nilgiri Tahr mountain goat at Eravikulam National Park, and breathe in panoramic mountain fresh air.`,
          activities: [
            "Morning safari in Eravikulam National Park",
            "Visit the Tea Museum to learn the art of orthodox tea making",
            "Boating at Mattupetty Dam and Echo Point acoustic fun",
            "Sunset view from Top Station over the Western Ghats",
          ],
          recommendedMeal: "Traditional Kerala Lunch (Sadya) served on a banana leaf with Avial, Thoran, and Payasam.",
          travelTip: "Pre-book Eravikulam entry tickets online to bypass long queues at the forest checkpoint.",
        };
      } else {
        return {
          dayNumber: dayNum,
          theme: `Houseboat Cruise in ${secondaryDest} Backwaters`,
          description: `Drive down to the venice of the east, ${secondaryDest}. Board your private luxury Keralayaatra houseboat. Glide past coconut groves, paddy fields, and local villages while your onboard chef prepares fresh meals.`,
          activities: [
            "Check-in on a traditional Kettuvallam (houseboat) at 12:00 Noon",
            "Welcome drink of tender coconut juice",
            "Relaxed cruise along the Vembanad Lake and Punnamada backwater canals",
            "Evening canoe ride through narrow rustic waterways",
          ],
          recommendedMeal: "Freshly prepared backwater Tapioca (Kappa) with spicy Red Fish Curry cooked in clay pots.",
          travelTip: "Cruising stops at 5:30 PM due to local fishermen casting nets; enjoy a quiet evening onboard watching the calm water.",
        };
      }
    }),
  };
}

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Keralayaatra server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
