import { StayItem } from "../types";

export const STAY_ITEMS: StayItem[] = [
  {
    id: "stay_1",
    name: "The Cardamom Treehouse",
    type: "Homestay",
    location: "Munnar Hills",
    pricePerNight: 4200,
    image: "https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&q=80&w=800",
    description: "Nestled within an active 8-acre organic cardamom and pepper plantation, this family-run wooden treehouse offers sweeping views of the misty valleys and hot homemade Kerala breakfast.",
    rating: 4.9,
    reviewCount: 142,
    amenities: ["Free Wi-Fi", "Homemade Breakfast", "Mountain View Trek", "Campfire Spot", "Eco-friendly"],
    experiences: ["Spice plantation tour", "Birdwatching guided walk", "Kerala culinary cooking class with the host family"]
  },
  {
    id: "stay_2",
    name: "Vembanad Lake Breeze Kettuvallam",
    type: "Houseboat",
    location: "Alleppey Backwaters",
    pricePerNight: 11500,
    image: "https://images.unsplash.com/photo-1593693411515-c202e93d81be?auto=format&fit=crop&q=80&w=800",
    description: "A traditional hand-woven wooden houseboat (Kettuvallam) converted into a modern luxury suite with solar power, air-conditioned bedrooms, and a private chef serving backwater delicacies.",
    rating: 4.8,
    reviewCount: 96,
    amenities: ["All Meals Included", "AC Bedrooms", "Sun Deck", "Private Chef", "Safety Equipment"],
    experiences: ["Sunset lake cruise", "Traditional cane fishing", "Village walk & local Toddy shop tasting trip"]
  },
  {
    id: "stay_3",
    name: "Seaside Cliff Heritage Bungalow",
    type: "Heritage Bungalow",
    location: "Varkala Cliff",
    pricePerNight: 5800,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
    description: "An authentic 120-year-old traditional Nalukettu (courtyard house) restored beautifully on the quieter red cliffs of Varkala, offering direct ocean access and an mineral spring.",
    rating: 4.7,
    reviewCount: 84,
    amenities: ["Ocean View Front", "AC Rooms", "Ayurvedic Spa On-site", "Yoga Shala", "Swimming Pool"],
    experiences: ["Sunrise beach yoga session", "Guided Ayurvedic Panchakarma consultation", "Surfing introductory class"]
  },
  {
    id: "stay_4",
    name: "Periyar Vista Eco Resort",
    type: "Eco Resort",
    location: "Thekkady",
    pricePerNight: 7500,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800",
    description: "Elegantly constructed using local bamboo, clay, and recycled wood, this eco-resort rests on the borders of the Periyar Tiger Reserve, letting you sleep to the sounds of nature.",
    rating: 4.9,
    reviewCount: 118,
    amenities: ["Infinity Pool", "Organic Restaurant", "Jungle Trekking Guide", "Private Balcony", "AC Rooms"],
    experiences: ["Periyar forest night walk", "Organic tea estate bicycle tour", "Bamboo rafting on Lake Periyar"]
  }
];
