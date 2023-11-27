import useTranslation from "next-translate/useTranslation";
import toast from "react-hot-toast";
import { HeroChat, HeroChatFormData } from "~/components/HeroChat";

export function HeroChatContainer() {
  const { t } = useTranslation("common");

  const handleSubmit = (
    formData: HeroChatFormData,
    cb: (success: boolean) => void
  ) => {
    fetch("/api/contact-us", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formData),
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
          cb(false);
        } else {
          toast.success(t("toastMessageSent"));
          cb(true);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(t("toastFailedToSendMessage"));
        cb(false);
      });
  };

  return <HeroChat onSubmit={handleSubmit} />;
}
