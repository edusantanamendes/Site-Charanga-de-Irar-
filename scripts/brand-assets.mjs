import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";

const logoPath = "frontend/public/brand/logo-charanga-original.jpeg";
const original = await fs.readFile(logoPath);
const { data, info } = await sharp(original)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const histogram = new Map();
for (let i = 0; i < data.length; i += info.channels) {
  const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
  if (b > r * 1.7 && b > g * 1.7 && b < 180 && r < 55 && g < 55) {
    const color = [r, g, b]
      .map((v) => Math.round(v / 4) * 4)
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("");
    histogram.set(color, (histogram.get(color) || 0) + 1);
  }
}
const dominant = [...histogram].sort((a, b) => b[1] - a[1])[0][0];
// Apenas os pixels originais do monograma CH são mostrados pelo SVG.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><title>CH — Charanga de Irará</title><rect width="192" height="192" rx="32" fill="white"/><svg x="10" y="47" width="172" height="98" viewBox="232 130 172 98" overflow="hidden"><image width="640" height="640" href="data:image/jpeg;base64,${original.toString("base64")}"/></svg></svg>`;
await fs.writeFile("frontend/public/favicon.svg", favicon);
await fs.writeFile(
  "frontend/public/brand/manifest.json",
  JSON.stringify(
    {
      source: "Logo Charanga.jpeg",
      file: "logo-charanga-original.jpeg",
      width: info.width,
      height: info.height,
      sha256: createHash("sha256").update(original).digest("hex"),
      sampledBlue: `#${dominant.toUpperCase()}`,
      favicon:
        "Recorte do monograma CH com pixels originais, incorporados em SVG.",
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Marca preservada: ${info.width} × ${info.height}. Azul dominante: #${dominant.toUpperCase()}. Favicon CH gerado.`,
);
