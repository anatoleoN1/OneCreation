// utils.js

// Bruit pseudo-aléatoire basé sur x et z
export function randomNoise(x, z) {
  const seed = Math.sin(x * 374761393 + z * 668265263) * 43758.5453;
  return seed - Math.floor(seed);
}

// Génère une clé unique pour identifier un bloc
export function key(x, y, z) {
  return `${x},${y},${z}`;
}
