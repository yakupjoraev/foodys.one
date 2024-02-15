import { type MetadataRoute } from "next";
import { env } from "~/env.mjs";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/new", "/favorites"],
    },
    sitemap: [
      env.NEXT_PUBLIC_SITE_URL + "/sitemap.xml",
      env.NEXT_PUBLIC_SITE_URL + "/places-sitemap.xml",
    ],
  };
}
