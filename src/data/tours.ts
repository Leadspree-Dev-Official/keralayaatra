import { TourPackage } from "../types";

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: "tour_1",
    name: "Classic Mist & Backwaters Escape",
    durationDays: 4,
    priceFrom: 12500,
    heroImage: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800",
    description: "Our signature tour pairing the tranquil tea-clad hills of Munnar with a traditional overnight houseboat cruise in the scenic canals of Alleppey.",
    categories: ["Hills", "Backwaters", "Honeymoon", "Best Seller"],
    highlights: [
      "Scenic climb through Cheeyappara & Valara Waterfalls",
      "Private spice garden walk & organic tea garden tasting",
      "Overnight luxury Houseboat cruise with local Kerala Chef",
      "Leisurely exploration of colonial Fort Kochi's history"
    ],
    itinerary: [
      {
        day: 1,
        title: "Cochin Arrival & Scenic Drive to Munnar Hills",
        description: "Receive a warm welcome at Cochin Airport. Meet your dedicated Keralayaatra chauffeur and wind your way up to Munnar, enjoying stops at breathtaking mountain waterfalls and tea farms."
      },
      {
        day: 2,
        title: "Eravikulam National Park Safari & Top Station",
        description: "Witness the rare Nilgiri Tahr mountain goat, tour the heritage Tata Tea Museum, and take in the panoramic beauty from Top Station, the highest point in the Western Ghats."
      },
      {
        day: 3,
        title: "Drive to Alleppey Backwaters & Luxury Houseboat Check-in",
        description: "Descend the hills and head to Alleppey. Board your traditional private houseboat. Glide through pristine palm-fringed lagoons while savoring freshly cooked regional specialities."
      },
      {
        day: 4,
        title: "Colonial Fort Kochi Heritage Tour & Departure",
        description: "Enjoy a sun-drenched breakfast on the water. Check out and explore historic Fort Kochi's Jewish Town, Chinese Fishing Nets, and Spice markets before your evening airport drop-off."
      }
    ],
    inclusions: [
      "AC private car with dedicated local chauffeur (inclusive of fuel, toll, parking)",
      "Standard/Premium homestay accommodation in Munnar (1 night)",
      "Full board meals on private Alleppey Houseboat (1 night)",
      "Sightseeing and activities as listed in the daily itinerary"
    ],
    exclusions: [
      "Eravikulam entry tickets (approx. ₹200 for Indians, ₹800 for foreigners)",
      "Personal shopping, tips, laundry, and alcoholic beverages",
      "Flight or Train tickets to/from Cochin (COK)"
    ]
  },
  {
    id: "tour_2",
    name: "Southern Beaches & Cliffside Splendour",
    durationDays: 5,
    priceFrom: 14800,
    heroImage: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=800",
    description: "Revel in the iconic coastal vistas of Kerala. Soak in the therapeutic mineral cliffs of Varkala Beach and the peaceful crescent beaches of Kovalam.",
    categories: ["Beaches", "Relaxed", "Adventure"],
    highlights: [
      "Sunset views from the world-famous red laterite Cliffs of Varkala",
      "Surf lessons or sunbathing on the golden shores of Kovalam",
      "Traditional therapeutic Ayurvedic full-body massage",
      "Tranquil boating on Poovar Island's unique mangrove forest canals"
    ],
    itinerary: [
      {
        day: 1,
        title: "Trivandrum Arrival & Cliffside Varkala Sunset",
        description: "Arrive in Trivandrum. Your chauffeur transports you to Varkala. Check into your cliff-top hotel and spend the evening watching the sun slide into the Arabian Sea from the high red cliffs."
      },
      {
        day: 2,
        title: "Varkala Beach Exploration & Jatayu Earth's Center",
        description: "Visit the legendary Janardhana Swamy temple. In the afternoon, take a short drive to the colossal Jatayu Earth Center, home to the world's largest bird sculpture set on a scenic mountain ridge."
      },
      {
        day: 3,
        title: "Transfer to Kovalam & Traditional Ayurvedic Massage",
        description: "Drive along the scenic coast to Kovalam. Check in and rejuvenate with a deep, soothing 60-minute Abhyanga Ayurvedic full-body massage performed by professional local therapists."
      },
      {
        day: 4,
        title: "Poovar Island Mangrove Cruise & Kovalam Lighthouse",
        description: "Boat through Poovar's pristine estuaries, where the river, lake, sea, and beach meet. Ascend the spiral staircase of the iconic Kovalam Lighthouse for sweeping views of the crescent shoreline."
      },
      {
        day: 5,
        title: "Sree Padmanabhaswamy Temple & Departure",
        description: "Tour Trivandrum's heritage architecture, visit the richest temple in the world (Sree Padmanabhaswamy Temple), and conclude your journey with a transfer to Trivandrum Airport."
      }
    ],
    inclusions: [
      "Private AC Sedan with local driver-guide throughout the trip",
      "Beachfront boutique stay with complimentary breakfast (4 nights)",
      "60-minute authentic Ayurvedic massage per guest",
      "Private boat cruise in Poovar backwaters and mangroves"
    ],
    exclusions: [
      "Jatayu cable car ride and park entry tickets (approx. ₹500)",
      "Lunch and Dinner meals to let you explore local beach cafes",
      "Camera fees and temple offering costs"
    ]
  },
  {
    id: "tour_3",
    name: "Wild Spice Trail & Highland Treasures",
    durationDays: 6,
    priceFrom: 18900,
    heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800",
    description: "An active nature exploration focusing on the rich fauna and rare flora of Munnar and the exciting tiger reserve backwoods of Thekkady (Periyar).",
    categories: ["Wildlife", "Hills", "Active", "Family"],
    highlights: [
      "Boat safari on Lake Periyar to spot wild elephants and bisons",
      "Guided forest trek and bamboo rafting in Periyar Tiger Reserve",
      "Sensory spice plantation tour (cloves, cardamom, cinnamon)",
      "Martial arts demonstration (Kalaripayattu) and Kathakali show"
    ],
    itinerary: [
      {
        day: 1,
        title: "Cochin to Munnar tea plantations",
        description: "Depart Cochin for Munnar. Explore local viewpoints and settle into a organic mountain homestay amidst spice gardens."
      },
      {
        day: 2,
        title: "Munnar Deep Wilderness Trek",
        description: "Take a moderate guided morning hike through tea garden borders and natural rainforests, spotting high-altitude birds and learning about local flora."
      },
      {
        day: 3,
        title: "Scenic Ride through Lock Heart Gap to Thekkady",
        description: "Drive through the breathtaking Lock Heart Gap to Thekkady. Check into a spice plantation cottage and experience a sensory guided walk tasting organic fresh spices."
      },
      {
        day: 4,
        title: "Periyar Lake Boat Safari & Martial Arts Spectacle",
        description: "Take an early morning boat cruise on Periyar Lake inside the wildlife sanctuary. In the evening, witness Kalaripayattu, the oldest martial art in the world."
      },
      {
        day: 5,
        title: "Bamboo Rafting & Jungle Border Walk",
        description: "Participate in a thrilling half-day combination of jungle trekking and traditional bamboo rafting through the Periyar Tiger Reserve forest canopy."
      },
      {
        day: 6,
        title: "Transfer back to Cochin & Departure",
        description: "Drive back down the winding ghat roads, stopping for lunch at a local rubber estate before your departure drop-off."
      }
    ],
    inclusions: [
      "Private AC SUV (Ertiga) with fuel, driver, tolls, and inter-state permits",
      "Eco-resort / Plantation cottage stay with breakfast (5 nights)",
      "Periyar boating tickets booked in advance",
      "Kalaripayattu and Kathakali theatrical show entry tickets"
    ],
    exclusions: [
      "Forest Trekking + Bamboo Rafting activity fee (approx. ₹1800 per guest)",
      "Lunches and dinners not explicitly specified"
    ]
  }
];
