import type { GetServerSideProps } from "next";
import { getServerSideSitemapIndexLegacy } from "next-sitemap";
import { db } from "~/server/db";
import { env } from "~/env.mjs";
import { URLS_PER_SITEMAP } from "~/constants/sitemap";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const amountOfPlaces = await db.gPlace.count();
  const amountOfSitemapFiles = Math.ceil(amountOfPlaces / URLS_PER_SITEMAP);

  const fields = new Array<string>(amountOfSitemapFiles);
  for (let i = 0; i < amountOfSitemapFiles; i++) {
    const sitemapUrl =
      env.NEXT_PUBLIC_SITE_URL + "/places-sitemap-" + i.toString() + ".xml";
    fields[i] = sitemapUrl;
  }

  return getServerSideSitemapIndexLegacy(ctx, fields);
};

// Default export to prevent next.js errors
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function PlacesSitemapPage() {}
