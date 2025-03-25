export const models = [
  {
    name: "Stable Diffusion 1.0",
    api: "http://localhost:8080/api/tools/model1",
  },
  {
    name: "Stable Diffusion 3.5",
    api: "http://localhost:8080/api/tools/model2",
  },
];

export const styles = [
  { name: "Default", thumbnail: "assets/images/blue.jpg" },
  { name: "Cartoon", thumbnail: "assets/images/cartoon.jpg" },
  { name: "Realistic", thumbnail: "assets/images/realistic.png" },
  { name: "Fantasy", thumbnail: "assets/images/fantasy.jpg" },
  { name: "Cyberpunk", thumbnail: "assets/images/cyberpunk.png" },
  { name: "Abstract", thumbnail: "assets/images/abstract.jpg" },
  { name: "Origami", thumbnail: "assets/images/origami-dragon.jpg" },
  { name: "Pixel Art", thumbnail: "assets/images/pixel-art.jpg" },
  { name: "Anime", thumbnail: "assets/images/anime.jpg" },
  { name: "Chibi", thumbnail: "assets/images/chibi.png" },
  { name: "3D", thumbnail: "assets/images/3d.jpg" },
  { name: "Watercolor", thumbnail: "assets/images/watercolor.jpg" },
  { name: "Oil Painting", thumbnail: "assets/images/oilpainting.jpg" },
  { name: "Sketch", thumbnail: "assets/images/sketch.jpg" },
  { name: "Glitch Art", thumbnail: "assets/images/glitch-art.jpg" },
  { name: "Steampunk", thumbnail: "assets/images/steampunk.jpg" },
  { name: "Sci-Fi", thumbnail: "assets/images/sci-fi.jpg" },
  { name: "Vaporwave", thumbnail: "assets/images/vaporwave.jpg" },
  { name: "Comic", thumbnail: "assets/images/comicbook.png" },
  { name: "Psychedelic", thumbnail: "assets/images/Psychedelic.png" },
  { name: "Mythological", thumbnail: "assets/images/Mythological.jpg" },
  { name: "Minimalist", thumbnail: "assets/images/Minimalist.jpg" },
];

export const negativePrompts = {
  Default: "distorted",
  Cartoon: "realistic, photo, ultra detail",
  Realistic: "unnatural colors, bad skin texture, plastic-like, uncanny valley, cartoon, anime, painting, abstract",
  Fantasy: "washed out colors, low contrast, lack of depth, bad anatomy",
  Cyberpunk: "muted colors, boring composition, lack of neon glow, bad reflections",
  Abstract: "realistic, structured, organized",
  Origami: "distorted, too detailed",
  "Pixel Art": "realistic, soft details, high resolution",
  Anime: "low detail, blurry lines, messy shading, bad anatomy, off-model, extra limbs",
  "3D": "flat, pixelated, hand-drawn",
  Watercolor: "sharp details, high contrast, digital rendering",
  "Oil Painting": "photorealistic, sharp details, digital effects",
  Sketch: "colorful, ultra detail, high resolution, realistic textures",
  "Glitch Art": "smooth, clean lines, high detail, natural colors",
  Steampunk: "modern, futuristic, minimalistic, soft details",
  "Sci-Fi": "old, outdated, low-tech, blurry details",
  Vaporwave: "sharp contrast, high realism, non-pastel colors",
  "Comic Book": "photo-realistic, soft edges, pastel colors",
  Psychedelic: "muted colors, lack of surreal elements, low contrast",
  Mythological: "modern, sci-fi, cyberpunk, futuristic, digital look",
  Minimalist: "high detail, complex background, realistic textures",
};
