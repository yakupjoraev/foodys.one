const i18n = require("./i18n.json");

const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

if (!NEXT_PUBLIC_SITE_URL) {
  throw new Error("env required: NEXT_PUBLIC_SITE_URL");
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: false,
  exclude: ["/places-sitemap", "/places", "/favorites", "/new"],
  robotsTxtOptions: {
    additionalSitemaps: [NEXT_PUBLIC_SITE_URL + "/places-sitemap.xml"],
  },
  alternateRefs: [
    {
      href: NEXT_PUBLIC_SITE_URL,
      hreflang: "fr",
    },
    {
      href: NEXT_PUBLIC_SITE_URL + "/en",
      hreflang: "en",
    },
  ],
};
