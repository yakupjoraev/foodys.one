import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useTranslation from "next-translate/useTranslation";

export type UseServicePhoneOutput = [string | null, boolean, () => void];

interface OspClickResponse {
  surtaxPhone: {
    surtaxPhoneNumber: string;
    surtaxPhoneCode: string | null;
  };
}

const OSP_CLICK_ENDPOINT = "/api/osp-click";
const EXPIRES = 300000; // 5 minutes

export function useServicePhone(placeId?: string): UseServicePhoneOutput {
  const { t } = useTranslation("common");
  const [servicePhone, setServicePhone] = useState<string | null>(null);
  const [servicePhoneLoading, setServicePhoneLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (servicePhone === null) {
      return;
    }

    const timerId = setTimeout(() => {
      setServicePhone(null);
    }, EXPIRES);

    return () => {
      clearTimeout(timerId);
    };
  }, [servicePhone]);

  const fetchServicePhone = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (placeId === undefined) {
      return;
    }
    if (servicePhone) {
      return;
    }
    if (servicePhoneLoading) {
      return;
    }

    const toastId = toast.loading(t("toastLoading"), {
      style: {
        minWidth: "150px",
      },
    });
    setServicePhoneLoading(true);
    sendOspClick(placeId)
      .then((response) => {
        setServicePhone(response.surtaxPhone.surtaxPhoneNumber);
        toast.dismiss(toastId);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to fetch phone", { id: toastId });
      })
      .finally(() => {
        setServicePhoneLoading(false);
      });
  }, [placeId, servicePhone, servicePhoneLoading, t]);

  return [servicePhone, servicePhoneLoading, fetchServicePhone];
}

async function sendOspClick(gPlaceId: string): Promise<OspClickResponse> {
  const apiResponse = await fetch(OSP_CLICK_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      g_place_id: gPlaceId,
    }),
  });
  if (!apiResponse.ok) {
    throw new Error(
      `failed to send response: ${apiResponse.status} ${apiResponse.statusText}`
    );
  }
  const responseBody: unknown = await apiResponse.json();

  return responseBody as OspClickResponse;
}
