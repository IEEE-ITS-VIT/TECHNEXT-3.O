import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TechNext '28 | National Industrial Expo · VIT Vellore",
    short_name: "TechNext '28",
    description: "TechNext '28, the national industrial expo and innovation showcase at VIT Vellore.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#002147",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
