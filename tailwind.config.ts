import type { Config } from "tailwindcss";

/**
 * Design tokens za Tapetariju Alekom.
 * Paleta je spoj pravaca A i B: tamna osnova sumraka, svetlo platno za
 * čitanje, bakar isključivo kao tanak akcenat.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sumrak: "#1C2F2A",
        ugljen: "#12151A",
        platno: "#E7E6E0",
        papir: "#F2F1EB",
        bakar: "#BE7242",
        /* za belu tipografiju na bakarnoj podlozi treba tamniji ton */
        "bakar-dugme": "#9C5323",
        "bakar-dugme-hover": "#8A461A",
        /* bakar kao tekst na svetlom mora biti tamniji od akcentnog */
        "bakar-tekst": "#944D1F",
        "bakar-svetli": "#D08B5C",
        orah: "#2B241F",
        lisce: "#869896",
        ink: "#1A1C1A",
        "ink-2": "#4E554E",
        "ink-3": "#5E655D",
        "mist-1": "rgba(231, 230, 224, 0.92)",
        "mist-2": "rgba(231, 230, 224, 0.68)",
        "mist-3": "rgba(231, 230, 224, 0.46)",
        "linija-svetla": "#D8D4CB",
        "linija-tamna": "rgba(231, 230, 224, 0.14)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // fluidna skala, 320 px -> 1920 px
        eyebrow: ["0.75rem", { lineHeight: "1.3", letterSpacing: "0.16em" }],
        "h1": ["clamp(2.35rem, 6.2vw, 4.6rem)", { lineHeight: "1.04", letterSpacing: "-0.022em" }],
        "h2": ["clamp(1.75rem, 3.8vw, 2.85rem)", { lineHeight: "1.1", letterSpacing: "-0.018em" }],
        "h3": ["clamp(1.2rem, 2vw, 1.5rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        lede: ["clamp(1.02rem, 1.5vw, 1.2rem)", { lineHeight: "1.6" }],
        body: ["clamp(0.95rem, 1.1vw, 1.02rem)", { lineHeight: "1.65" }],
        malo: ["0.84rem", { lineHeight: "1.5" }],
      },
      spacing: {
        sekcija: "clamp(4.5rem, 9vw, 8.5rem)",
        "sekcija-tesna": "clamp(3.25rem, 6vw, 5.5rem)",
      },
      maxWidth: {
        sadrzaj: "76rem",
        tekst: "38rem",
      },
      borderRadius: {
        // radijusi su mali i namerni; bez preterano zaobljenih kartica
        slika: "10px",
        pilula: "999px",
      },
      transitionTimingFunction: {
        meko: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translate3d(0, 10px, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        marquee: {
          from: { transform: "translate3d(0, 0, 0)" },
          to: { transform: "translate3d(-50%, 0, 0)" },
        },
        sav: {
          from: { strokeDashoffset: "120" },
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        marquee: "marquee 42s linear infinite",
        sav: "sav 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both",
      },
    },
  },
  plugins: [],
};

export default config;
