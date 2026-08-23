/**
 * Generiše rasterizovane ikone (PNG) iz vektorskog monograma za platforme
 * koje ne podržavaju SVG kao app/home-screen ikonu (najvažnije: iOS Safari
 * apple-touch-icon, i deo Android/Chromium implementacija web manifesta).
 *
 * Pokretanje: node tools/logo/gen-app-icons.js
 */
const path = require("path");
const sharp = require("sharp");

const PAPIR = { r: 0xf2, g: 0xf1, b: 0xeb, alpha: 1 };
const SRC = path.join(__dirname, "../../public/logo/alekom-mark.svg");
const OUT = path.join(__dirname, "../../public/icons");

async function make(size, file, { padding = 0.16 } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const mark = await sharp(SRC, { density: 2400 })
    .resize(inner, inner, { fit: "contain" })
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: PAPIR },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(path.join(OUT, file));

  console.log("wrote", file);
}

(async () => {
  // apple-touch-icon: iOS ne poštuje providnost, zato pun papir fon
  await make(180, "apple-touch-icon.png", { padding: 0.14 });
  // manifest ikone tipa "any"
  await make(192, "icon-192.png", { padding: 0.14 });
  await make(512, "icon-512.png", { padding: 0.14 });
  // maskable: OS primenjuje sopstvenu masku, monogram ostaje u bezbednoj zoni
  await make(512, "icon-maskable-512.png", { padding: 0.28 });
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
