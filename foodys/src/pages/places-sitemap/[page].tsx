import type { GetServerSideProps } from "next";
import { type ISitemapField, getServerSideSitemapLegacy } from "next-sitemap";
import { db } from "~/server/db";
import { env } from "~/env.mjs";
import { URLS_PER_SITEMAP } from "~/constants/sitemap";

export const getServerSideProps: GetServerSideProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { page: string }
> = async (ctx) => {
  const pageRaw = ctx.params?.page;
  if (pageRaw === undefined) {
    return { notFound: true };
  }
  const page = parseInt(pageRaw, 10);
  if (isNaN(page)) {
    return { notFound: true };
  }
  if (page < 0) {
    return { notFound: true };
  }

  const places = await db.gPlace.findMany({
    where: {
      NOT: [{ place_id: null }],
    },
    select: {
      place_id: true,
      updated_at: true,
    },
    skip: page * URLS_PER_SITEMAP,
    take: URLS_PER_SITEMAP,
  });

  if (places.length === 0) {
    return { notFound: true };
  }

  const ids: string[] = [];
  for (const place of places) {
    if (place.place_id === null) {
      continue;
    }
    ids.push(place.place_id);
  }

  const urls = await db.placeUrl.findMany({
    where: {
      g_place_id: { in: ids },
    },
    select: {
      g_place_id: true,
      url: true,
    },
  });

  const idToUrl = new Map<string, string>();
  urls.forEach((url) => {
    if (url.g_place_id) {
      idToUrl.set(url.g_place_id, url.url);
    }
  });

  const fields: ISitemapField[] = [];
  for (const place of places) {
    if (place.place_id === null) {
      continue;
    }
    const url = idToUrl.get(place.place_id);
    if (url === undefined) {
      continue;
    }
    const loc = env.NEXT_PUBLIC_SITE_URL + url;
    const lastmod = place.updated_at.toISOString();
    const alternateRefs = [
      {
        href: env.NEXT_PUBLIC_SITE_URL + url,
        hreflang: "fr",
      },
      {
        href: env.NEXT_PUBLIC_SITE_URL + "/en" + url,
        hreflang: "en",
      },
    ];
    fields.push({
      loc,
      lastmod,
      alternateRefs,
    });
  }

  return getServerSideSitemapLegacy(ctx, fields);
};

// Default export to prevent next.js errors
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function PlacesSitemapIndexPage() {}
