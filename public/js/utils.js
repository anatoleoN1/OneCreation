function randomNoise(x, z) {
  const seed = Math.sin(x * 374761393 + z * 668265263) * 43758.5453;
  return seed - Math.floor(seed);
}

function key(x,y,z) {
  return `${x},${y},${z}`;
}
