// ============================================================================
// GIANNI GABUTTI — CENTRAL SITE & ASSET CONFIGURATION
// ----------------------------------------------------------------------------
// This is the single place to configure:
//   1. Company contact details (address, phone, email, hours)
//   2. The company logo
//   3. The hero video (optional) / hero still image
//   4. Every image used anywhere on the website
//
// HOW TO REPLACE A PLACEHOLDER WITH A REAL ASSET:
//   - Put your file in /app/frontend/public/assets/ (create subfolders freely,
//     e.g. /assets/products/bruma-01.jpg)
//   - Replace the `null` value below with the public path, e.g.
//     hero: { video: "/assets/hero/hero.mp4", poster: "/assets/hero/poster.jpg" }
//   - No component changes are needed: every slot keeps its layout, ratio
//     and crop automatically.
//
// Any value left as `null` renders an elegant labelled placeholder
// ("You can upload your image here" / "You can upload your video here").
// ============================================================================

export const SITE = {
  name: "GIANNI GABUTTI",
  subline: "SAN MARTINO · ITALIA",
  // Contact details — replace null values with the real company data.
  contact: {
    address: null,   // e.g. "Via Example 1, 42018 San Martino in Rio (RE), Italy"
    phone: null,     // e.g. "+39 0000 000000"
    email: null,     // e.g. "info@giannigabutti.it"
    hours: null,     // e.g. "Mon–Fri 9:00–18:00"
  },
};

// Interior photography supplied by the client (temporary set used site-wide
// until the full product / project shoot is delivered).
export const PHOTOS = {
  livingRoom: "/assets/photos/living-room.jpg", // ring pendant, open living space
  wallWash:   "/assets/photos/wall-wash.jpg",   // linear wall-washers over artwork
  floorLamp:  "/assets/photos/floor-lamp.jpg",  // floor lamp + sideboard
};

export const ASSETS = {
  // Brand logo — "light" sits on light backgrounds (header),
  // "dark" on dark backgrounds (footer, mobile menu).
  logo: {
    light: "/assets/brand/logo-light.png",
    dark: "/assets/brand/logo-dark.png",
  },

  // Homepage hero. Video (if set) takes priority, then the still image.
  hero: {
    video: null,  // e.g. "/assets/hero/hero.mp4"
    poster: null, // e.g. "/assets/hero/poster.jpg"
    image: PHOTOS.livingRoom,
  },

  // Homepage editorial imagery
  home: {
    introPortrait: PHOTOS.floorLamp,     // 3:4 portrait — company / workshop
    philosophyLandscape: PHOTOS.wallWash, // 16:9 landscape — light in architecture
  },

  // Product imagery, keyed by product slug.
  // "main" is the catalogue + detail hero shot (3:4 portrait),
  // "gallery" holds additional shots for the detail page.
  products: {
    bruma:  { main: PHOTOS.livingRoom, gallery: [PHOTOS.wallWash, PHOTOS.floorLamp] },
    solivo: { main: PHOTOS.floorLamp,  gallery: [PHOTOS.livingRoom, PHOTOS.wallWash] },
    tensa:  { main: PHOTOS.wallWash,   gallery: [PHOTOS.floorLamp, PHOTOS.livingRoom] },
    faldo:  { main: PHOTOS.livingRoom, gallery: [PHOTOS.floorLamp, PHOTOS.wallWash] },
    rivo:   { main: PHOTOS.floorLamp,  gallery: [PHOTOS.wallWash, PHOTOS.livingRoom] },
    lama:   { main: PHOTOS.wallWash,   gallery: [PHOTOS.livingRoom, PHOTOS.floorLamp] },
  },

  // Project imagery, keyed by project slug (16:9 landscape).
  projects: {
    "residenza-demo":   { cover: PHOTOS.livingRoom, gallery: [PHOTOS.wallWash, PHOTOS.floorLamp] },
    "ospitalita-demo":  { cover: PHOTOS.floorLamp,  gallery: [PHOTOS.livingRoom, PHOTOS.wallWash] },
    "retail-demo":      { cover: PHOTOS.wallWash,   gallery: [PHOTOS.floorLamp, PHOTOS.livingRoom] },
    "outdoor-demo":     { cover: PHOTOS.livingRoom, gallery: [PHOTOS.floorLamp, PHOTOS.wallWash] },
  },

  // About page
  about: {
    portrait: PHOTOS.floorLamp,   // 3:4 — company / atelier
    landscape: PHOTOS.livingRoom, // 16:9 — craftsmanship / production
  },

  // Services page
  services: {
    banner: PHOTOS.wallWash, // 21:9 wide editorial banner
  },

  // Contact page map area is rendered as a dedicated placeholder by default.
  contact: {
    map: null, // e.g. an embedded map image, or keep null
  },
};

export function productImage(slug) {
  return ASSETS.products[slug] || { main: null, gallery: [null, null] };
}

export function projectImage(slug) {
  return ASSETS.projects[slug] || { cover: null, gallery: [null, null] };
}
