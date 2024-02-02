import z from "zod";
import type { NextApiRequest, NextApiResponse } from "next";
import { sendOspClick } from "~/utils/optico";
import { createPlaceResourceByGoogleId } from "~/server/api/utils/g-place";

const clientRequestSchema = z.object({
  g_place_id: z.string(),
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== "POST") {
    return res.status(405).json({
      error: { message: `method ${method} not allowed` },
    });
  }

  const clientRequestParsingResult = clientRequestSchema.safeParse(req.body);

  if (!clientRequestParsingResult.success) {
    const { errors } = clientRequestParsingResult.error;

    return res.status(400).json({
      error: { message: "invalid request", errors },
    });
  }
  const clientRequest = clientRequestParsingResult.data;

  const userAgent = req.headers["user-agent"];

  createPlaceResourceByGoogleId(clientRequest.g_place_id)
    .then((place) => {
      if (place === null) {
        res.status(404).json({ message: "place not found" });
        return;
      }
      if (!place.international_phone_number) {
        res.status(404).json({ message: "place does not have phone" });
        return;
      }
      if (!place.address_components) {
        res.status(404).json({ message: "failed to detect country" });
        return;
      }
      const countryComponent = place.address_components.find(({ types }) =>
        types.includes("country")
      );
      if (countryComponent === undefined) {
        res.status(404).json({ message: "failed to detect country" });
        return;
      }
      if (countryComponent.short_name !== "FR") {
        res.status(404).json({ message: "unsupported country" });
        return;
      }

      return sendOspClick({
        phone: place.international_phone_number,
        userAgent,
      }).then((response) => {
        res.status(200).json({
          surtaxPhone: {
            surtaxPhoneNumber: response.surtaxPhone.surtaxPhoneNumber,
            surtaxPhonecode: response.surtaxPhone.surtaxPhoneCode,
          },
        });
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        message: "internal server error",
      });
    });
}
