// ============================================================
// properties.js — MKA Dream Home Property
// Central data file. ALL property information lives here.
//
// HOW TO ADD A NEW PROPERTY:
// 1. Copy one of the objects below
// 2. Paste it at the end of the array (before the closing ])
// 3. Update the id (must be unique), and all other fields
// 4. Add the new card to index.html with the matching id
// That's it. The detail page handles itself automatically.
// ============================================================

const properties = [

  // ── Property 1 ────────────────────────────────────────────
  {
    id: 1,
    title: "APEX GARDENS Estate",
    type: "residential",
    badge: "Residential",
    status: "available",        // "available" or "sold"
    price: "₦25,000,000",
    location: "Apa Aledo, Ososa, Ijebu-Ode — Off Itokin Ikorodu Road, Ogun State",
    shortDesc: "A serene, well-planned estate perfect for residential development and long-term investment.",
    fullDesc: "Apex Gardens Estate is a premium residential development located in the fast-growing Ososa corridor of Ogun State. The estate offers a peaceful, well-structured environment ideal for families and investors looking for long-term capital appreciation. With registered survey and good road access, this is one of the safest land investments in the region.",
    images: ["profile.JPG", "profile2.JPG", "profile3.JPG", "profile5.JPG", "profile6.JPG"],
    video: "profile4.MP4",
    features: [
      "📐 Plot Size: 300sqm & 600sqm available",
      "📜 Title: Registered Survey",
      "🚧 Good Road Network",
      "⚡ Electricity Available",
      "💧 Drainage System",
      "💳 Flexible Payment Plan"
    ],
    benefits: [
      "High appreciation area",
      "Secure and serene environment",
      "Perfect for residential & investment purposes",
      "Fast developing location",
      "Close to major roads and markets"
    ],
    paymentPlans: [
      { label: "Outright Payment",  amount: "₦25,000,000" },
      { label: "6 Months Plan",     amount: "₦27,000,000" },
      { label: "12 Months Plan",    amount: "₦30,000,000" }
    ],
    whatsappMsg: "Hi%2C%20I%27m%20interested%20in%20APEX%20GARDENS%20Estate.%20Please%20share%20more%20details."
  },

  // ── Property 2 ────────────────────────────────────────────
  {
    id: 2,
    title: "Commercial Hub Parcel",
    type: "commercial",
    badge: "Commercial",
    status: "available",
    price: "₦80,000,000",
    location: "Victoria Island, Lagos",
    
    shortDesc: "Strategically located for high commercial potential — ideal for shops, offices, or mixed-use.",
    fullDesc: "This prime commercial parcel sits in the heart of Victoria Island, Lagos's premier business district. Surrounded by banks, embassies and corporate headquarters, this land offers unmatched commercial visibility and footfall. Suitable for retail, office towers, hospitality or mixed-use development.",
    images: ["profile2.JPG", "profile.JPG", "profile3.JPG"],
    video: null,
    features: [
      "📐 Plot Size: 1,200sqm",
      "📜 Title: Certificate of Occupancy (C of O)",
      "🏙️ Prime Business District",
      "🚗 High Traffic Location",
      "⚡ Full Infrastructure",
      "💳 Negotiable Payment Terms"
    ],
    benefits: [
      "Located in Lagos top commercial zone",
      "High rental yield potential",
      "Excellent resale value",
      "Close to major banks and embassies",
      "Suitable for all commercial purposes"
    ],
    paymentPlans: [
      { label: "Outright Payment", amount: "₦80,000,000" },
      { label: "6 Months Plan",    amount: "₦86,000,000" }
    ],
    whatsappMsg: "Hi%2C%20I%27m%20interested%20in%20the%20Commercial%20Hub%20Parcel%20at%20Victoria%20Island.%20Please%20share%20more%20details."
  },

  // ── Property 3 ────────────────────────────────────────────
  {
    id: 3,
    title: "Spacious Agricultural Land",
    type: "agricultural",
    badge: "Agricultural",
    status: "available",
    price: "₦15,000,000",
    location: "Ibadan, Oyo State",
    shortDesc: "Ideal for farming or large-scale agribusiness with fertile soil and water access nearby.",
    fullDesc: "This expansive agricultural land in Ibadan offers fertile, loamy soil perfect for crop farming, poultry, fish farming or large-scale agribusiness. With a nearby water source and easy road access, it is one of the most productive pieces of farmland available in Oyo State at this price point.",
    images: ["profile3.JPG", "profile5.JPG", "profile.JPG"],
    video: null,
    features: [
      "📐 Land Size: 5 Acres",
      "📜 Title: Deed of Assignment",
      "💧 Water Source Nearby",
      "🌱 Fertile Loamy Soil",
      "🚗 Good Road Access",
      "💳 Payment Plan Available"
    ],
    benefits: [
      "Highly fertile land for multiple crops",
      "Ideal for agribusiness investment",
      "Water source nearby for irrigation",
      "Easy access road for trucks",
      "Growing demand for farmland in region"
    ],
    paymentPlans: [
      { label: "Outright Payment", amount: "₦15,000,000" },
      { label: "6 Months Plan",    amount: "₦16,500,000" },
      { label: "12 Months Plan",   amount: "₦18,000,000" }
    ],
    whatsappMsg: "Hi%2C%20I%27m%20interested%20in%20the%20Spacious%20Agricultural%20Land%20in%20Ibadan.%20Please%20share%20more%20details."
  },

  // ── Property 4 ────────────────────────────────────────────
  {
    id: 4,
    title: "Suburban Residential Plot",
    type: "residential",
    badge: "Residential",
    status: "available",
    price: "₦30,000,000",
    location: "Egan, Igando, Lagos",
    shortDesc: "Quiet, family-friendly neighbourhood with nearby utilities and good schools.",
    fullDesc: "Situated in the calm residential corridor of Egan, Igando, this plot offers the perfect setting for a family home. The neighbourhood is well-developed with schools, hospitals, markets and good road networks making it one of the most liveable communities on Lagos mainland.",
    images: ["profile5.JPG", "profile.JPG", "profile6.JPG"],
    video: "profile4.MP4",
    features: [
      "📐 Plot Size: 500sqm",
      "📜 Title: Registered Survey",
      "🏫 Schools Nearby",
      "🏥 Hospital Nearby",
      "⚡ Electricity Available",
      "💳 6-Month Payment Plan"
    ],
    benefits: [
      "Quiet and secure neighbourhood",
      "Close to schools and hospitals",
      "Well developed community",
      "Easy access to Lagos mainland",
      "Strong long-term rental demand"
    ],
    paymentPlans: [
      { label: "Outright Payment", amount: "₦30,000,000" },
      { label: "6 Months Plan",    amount: "₦33,000,000" }
    ],
    whatsappMsg: "Hi%2C%20I%27m%20interested%20in%20the%20Suburban%20Residential%20Plot%20at%20Egan%20Igando.%20Please%20share%20more%20details."
  },

  // ── Property 5 ────────────────────────────────────────────
  {
    id: 5,
    title: "Fertile Agricultural Land",
    type: "agricultural",
    badge: "Agricultural",
    status: "available",
    price: "₦15,000,000",
    location: "Ibadan, Oyo State",
    shortDesc: "Ideal for farming or large-scale agribusiness with fertile soil and water access nearby.",
    fullDesc: "A second premium agricultural parcel in Ibadan, this land is ready for immediate farming activities. The soil profile has been assessed and confirmed suitable for cassava, maize, vegetables and other cash crops. An excellent entry point for investors looking to diversify into agriculture.",
    images: ["profile5.JPG", "profile3.JPG", "profile.JPG"],
    video: null,
    features: [
      "📐 Land Size: 3 Acres",
      "📜 Title: Deed of Assignment",
      "🌱 Confirmed Fertile Soil",
      "💧 Seasonal Water Access",
      "🚗 Motorable Road Access",
      "💳 Payment Plan Available"
    ],
    benefits: [
      "Confirmed fertile soil profile",
      "Suitable for cash crop farming",
      "Good access road for equipment",
      "Affordable entry price",
      "High demand for produce in region"
    ],
    paymentPlans: [
      { label: "Outright Payment", amount: "₦15,000,000" },
      { label: "6 Months Plan",    amount: "₦16,500,000" },
      { label: "12 Months Plan",   amount: "₦18,000,000" }
    ],
    whatsappMsg: "Hi%2C%20I%27m%20interested%20in%20the%20Fertile%20Agricultural%20Land%20in%20Ibadan.%20Please%20share%20more%20details."
  },

  // ── Property 6 ────────────────────────────────────────────
  {
    id: 6,
    title: "Oceans Breeze Estate",
    type: "residential",
    badge: "Residential",
    status: "available",
    price: "₦4,500,000",
    location: "Ibadan, Oyo State",
    shortDesc: "Peaceful coastal living awaits. A serene environment with great investment potential.",
    fullDesc: "Oceans Breeze Estate is an affordable residential development offering a peaceful, community-focused environment. At this price point it represents one of the best entry-level land investments currently available. The estate is well-planned with a clear title and payment plans to suit every budget.",
    images: ["profile6.JPG", "profile.JPG", "profile2.JPG"],
    video: null,
    features: [
      "📐 Plot Size: 300sqm",
      "📜 Title: Registered Survey",
      "🌿 Serene Environment",
      "🚧 Estate Road Network",
      "⚡ Electricity Planned",
      "💳 Flexible Payment Plan"
    ],
    benefits: [
      "Most affordable listing in portfolio",
      "Clean title with no disputes",
      "Peaceful residential environment",
      "Great for first-time land buyers",
      "Strong potential for value growth"
    ],
    paymentPlans: [
      { label: "Outright Payment", amount: "₦4,500,000" },
      { label: "3 Months Plan",    amount: "₦4,900,000" },
      { label: "6 Months Plan",    amount: "₦5,200,000" }
    ],
    whatsappMsg: "Hi%2C%20I%27m%20interested%20in%20Oceans%20Breeze%20Estate.%20Please%20share%20more%20details."
  }

];
// ── End of properties array ────────────────────────────────
// To add property 7, copy any block above, paste here,
// change the id to 7, update all fields, save the file.