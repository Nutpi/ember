import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ember — 双人书信日记",
    short_name: "Ember",
    description: "一个温暖的双人信件应用",
    start_url: "/",
    display: "standalone",
    background_color: "#1C1917",
    theme_color: "#F97316",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
