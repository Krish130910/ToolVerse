export interface SignatureFont {
  id: string;
  name: string;
  family: string;
  sampleName?: string;
  category: "classic" | "modern" | "calligraphy" | "casual" | "artistic";
}

export const SIGNATURE_FONTS: SignatureFont[] = [
  { id: "dancing-script", name: "Dancing Script", family: "'Dancing Script', cursive", category: "casual" },
  { id: "great-vibes", name: "Great Vibes", family: "'Great Vibes', cursive", category: "calligraphy" },
  { id: "pacifico", name: "Pacifico", family: "'Pacifico', cursive", category: "modern" },
  { id: "sacramento", name: "Sacramento", family: "'Sacramento', cursive", category: "calligraphy" },
  { id: "caveat", name: "Caveat", family: "'Caveat', cursive", category: "casual" },
  { id: "alex-brush", name: "Alex Brush", family: "'Alex Brush', cursive", category: "calligraphy" },
  { id: "allura", name: "Allura", family: "'Allura', cursive", category: "calligraphy" },
  { id: "satisfy", name: "Satisfy", family: "'Satisfy', cursive", category: "modern" },
  { id: "windsong", name: "WindSong", family: "'WindSong', cursive", category: "artistic" },
  { id: "tangerine", name: "Tangerine", family: "'Tangerine', cursive", category: "classic" },
  { id: "marck-script", name: "Marck Script", family: "'Marck Script', cursive", category: "casual" },
  { id: "yellowtail", name: "Yellowtail", family: "'Yellowtail', cursive", category: "modern" },
  { id: "homemade-apple", name: "Homemade Apple", family: "'Homemade Apple', cursive", category: "artistic" },
  { id: "mr-dafoe", name: "Mr Dafoe", family: "'Mr Dafoe', cursive", category: "modern" },
  { id: "cedarville-cursive", name: "Cedarville Cursive", family: "'Cedarville Cursive', cursive", category: "casual" },
  { id: "reenie-beanie", name: "Reenie Beanie", family: "'Reenie Beanie', cursive", category: "artistic" },
  { id: "pinyon-script", name: "Pinyon Script", family: "'Pinyon Script', cursive", category: "classic" },
  { id: "monsieur-la-doulaise", name: "Monsieur La Doulaise", family: "'Monsieur La Doulaise', cursive", category: "classic" },
  { id: "italianno", name: "Italianno", family: "'Italianno', cursive", category: "calligraphy" },
  { id: "kristi", name: "Kristi", family: "'Kristi', cursive", category: "artistic" },
  { id: "rouge-script", name: "Rouge Script", family: "'Rouge Script', cursive", category: "calligraphy" },
  { id: "parisienne", name: "Parisienne", family: "'Parisienne', cursive", category: "classic" },
  { id: "kaushan-script", name: "Kaushan Script", family: "'Kaushan Script', cursive", category: "modern" },
  { id: "cookie", name: "Cookie", family: "'Cookie', cursive", category: "casual" },
];

/**
  Generate Google Fonts URL for dynamic loading in document head
 */
export const getGoogleFontsUrl = (): string => {
  const fontFamilies = [
    "Dancing+Script:wght@400;700",
    "Great+Vibes",
    "Pacifico",
    "Sacramento",
    "Caveat:wght@400;700",
    "Alex+Brush",
    "Allura",
    "Satisfy",
    "WindSong:wght@400;500",
    "Tangerine:wght@400;700",
    "Marck+Script",
    "Yellowtail",
    "Homemade+Apple",
    "Mr+Dafoe",
    "Cedarville+Cursive",
    "Reenie+Beanie",
    "Pinyon+Script",
    "Monsieur+La+Doulaise",
    "Italianno",
    "Kristi",
    "Rouge+Script",
    "Parisienne",
    "Kaushan+Script",
    "Cookie",
  ].join("&family=");

  return `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`;
};
