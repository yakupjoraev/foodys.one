import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  ContactUsModal,
  type ContactUsFormData,
} from "~/components/ContactUsModal";

export interface ContactUsModalContainerProps {
  open: boolean;
  onClose: () => void;
}

export function ContactUsModalContainer(props: ContactUsModalContainerProps) {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(false);

  const handleContactUsFormSubmit = (request: ContactUsFormData) => {
    setLoading(true);
    fetch("/api/contact-us", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then(async (response) => {
        const ok = response.ok;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const responseBody = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return { body: responseBody, ok };
      })
      .then((bodyAndStatus) => {
        if (!bodyAndStatus.ok) {
          console.error("failed to submit Contact Us form", bodyAndStatus.body);
          toast.error(t("toastFailedToSendMessage"));
        } else {
          toast.success(t("toastMessageSent"));
          props.onClose();
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(t("toastFailedToSendMessage"));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ContactUsModal
      open={props.open}
      loading={loading}
      onClose={props.onClose}
      onSubmit={handleContactUsFormSubmit}
    />
  );
}
