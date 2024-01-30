import z from "zod";
import { env } from "~/env.mjs";

const OSP_CLICK_ENDPOINT = "http://www.optico.fr/ospClick";
const OSP_CLICK_EXPIRES = 300; // 5 minutes

const ospClickResponseSuccessSchema = z.object({
  status: z.literal("OK"),
  surtaxPhone: z.object({
    surtaxPhoneNumber: z.string(),
    surtaxPhoneCode: z.union([z.string(), z.null()]),
  }),
  clientData: z.any(),
});

interface OspClickParams {
  phone: string;
  userAgent?: string;
}

export class OspError extends Error {}

export class OspNetworkError extends OspError {}

export class OspServerError extends OspError {}

function normalizePhone(phone: string) {
  if (phone.startsWith("+")) {
    phone = phone.slice(1);
  }
  phone = phone.replace(/\s/g, "");
  return phone;
}

function urlEncode(data: Record<string, string | number | undefined>) {
  const chunks = [];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) {
      continue;
    }
    const keyEncoded = encodeURIComponent(key);
    const valueEncoded = encodeURIComponent(value);
    chunks.push(keyEncoded + "=" + valueEncoded);
  }
  return chunks.join("&");
}

export async function sendOspClick(params: OspClickParams) {
  const opticoRequest = {
    api_key: env.OPTICO_API_KEY,
    phone: normalizePhone(params.phone),
    user_agent: params.userAgent,
    expiration: OSP_CLICK_EXPIRES,
  };

  let apiResponse: Response;
  try {
    apiResponse = await fetch(OSP_CLICK_ENDPOINT, {
      method: "POST",
      body: urlEncode(opticoRequest),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });
  } catch (_error) {
    throw new OspNetworkError("failed to send ospClick");
  }

  if (!apiResponse.ok) {
    throw new OspServerError(
      `unexpected response status: ${apiResponse.status.toString()} ${
        apiResponse.statusText
      } `
    );
  }

  let apiResponseBody: unknown;
  try {
    apiResponseBody = await apiResponse.json();
  } catch (_error) {
    throw new OspServerError("failed to fetch ospClick body");
  }

  if (
    typeof apiResponseBody === "object" &&
    apiResponseBody !== null &&
    "status" in apiResponseBody &&
    apiResponseBody?.status !== "OK"
  ) {
    throw new OspServerError("unexpected ospClick response body");
  }

  const ospClickResponseParsingResult =
    ospClickResponseSuccessSchema.safeParse(apiResponseBody);

  if (!ospClickResponseParsingResult.success) {
    throw new OspServerError("unexpected ospClick response body");
  }
  const ospClickResponse = ospClickResponseParsingResult.data;

  return {
    surtaxPhone: ospClickResponse.surtaxPhone,
  };
}
