import type { NextApiRequest, NextApiResponse } from "next";
import httpProxy from "http-proxy";
import { env } from "~/env.mjs";

export const config = {
  api: {
    // Enable `externalResolver` option in Next.js
    externalResolver: true,
    bodyParser: false,
  },
};

// !!! DANGER REQUEST

export default function (req: NextApiRequest, res: NextApiResponse) {
  const { photo_reference } = req.query;

  if (typeof photo_reference !== "string") {
    return res.status(404).json({ error: "not found" });
  }

  const target = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photo_reference=${encodeURIComponent(
    photo_reference
  )}&key=${encodeURIComponent(env.GOOGLE_MAPS_API_KEY)}`;

  res.redirect(target);
}
