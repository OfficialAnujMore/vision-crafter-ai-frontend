const loadedFonts = new Set<string>();

const SYSTEM_FONTS = new Set([
  "Arial",
  "Arial Black",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Comic Sans MS",
  "Impact",
  "Trebuchet MS",
  "Tahoma",
  "Lucida Console",
]);

export const GOOGLE_FONTS: string[] = [
  "Abel",
  "Abril Fatface",
  "Alfa Slab One",
  "Amatic SC",
  "Archivo",
  "Arimo",
  "Arvo",
  "Bangers",
  "Barlow",
  "Bebas Neue",
  "Bitter",
  "Bungee",
  "Cabin",
  "Catamaran",
  "Caveat",
  "Cinzel",
  "Comfortaa",
  "Cormorant Garamond",
  "Crete Round",
  "Crimson Text",
  "DM Sans",
  "Dancing Script",
  "Domine",
  "Dosis",
  "EB Garamond",
  "Exo 2",
  "Fira Sans",
  "Fjalla One",
  "Fredoka",
  "Gloria Hallelujah",
  "Great Vibes",
  "Gruppo",
  "Heebo",
  "IBM Plex Mono",
  "IBM Plex Sans",
  "Inconsolata",
  "Indie Flower",
  "Inter",
  "JetBrains Mono",
  "Josefin Sans",
  "Jost",
  "Kalam",
  "Kanit",
  "Karla",
  "Lato",
  "Lexend",
  "Libre Baskerville",
  "Libre Franklin",
  "Lobster",
  "Lora",
  "Manrope",
  "Maven Pro",
  "Merriweather",
  "Montserrat",
  "Mulish",
  "Noto Sans",
  "Noto Serif",
  "Nunito",
  "Nunito Sans",
  "Oswald",
  "Outfit",
  "Overpass",
  "Oxygen",
  "PT Sans",
  "PT Serif",
  "Pacifico",
  "Patrick Hand",
  "Permanent Marker",
  "Philosopher",
  "Playfair Display",
  "Plus Jakarta Sans",
  "Poppins",
  "Prompt",
  "Questrial",
  "Quicksand",
  "Rajdhani",
  "Raleway",
  "Red Hat Display",
  "Righteous",
  "Roboto",
  "Roboto Condensed",
  "Roboto Slab",
  "Rubik",
  "Sacramento",
  "Sarabun",
  "Satisfy",
  "Shadows Into Light",
  "Signika",
  "Source Code Pro",
  "Source Sans 3",
  "Space Grotesk",
  "Space Mono",
  "Teko",
  "Titillium Web",
  "Ubuntu",
  "Urbanist",
  "Varela Round",
  "Vollkorn",
  "Work Sans",
  "Yanone Kaffeesatz",
  "Zilla Slab",
];

const SYSTEM_FONT_LIST: string[] = [
  "Arial",
  "Arial Black",
  "Comic Sans MS",
  "Courier New",
  "Georgia",
  "Helvetica",
  "Impact",
  "Lucida Console",
  "Tahoma",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
];

export const ALL_FONTS: string[] = [...SYSTEM_FONT_LIST, ...GOOGLE_FONTS];

export const loadGoogleFont = async (fontFamily: string): Promise<void> => {
  if (loadedFonts.has(fontFamily) || SYSTEM_FONTS.has(fontFamily)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;700&display=swap`;
  document.head.appendChild(link);

  try {
    await document.fonts.load(`16px "${fontFamily}"`);
  } catch {
    // Font may still work, proceed silently
  }

  loadedFonts.add(fontFamily);
};

export const isFontLoaded = (fontFamily: string): boolean => {
  return loadedFonts.has(fontFamily) || SYSTEM_FONTS.has(fontFamily);
};
