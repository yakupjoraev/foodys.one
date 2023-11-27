import toast from "react-hot-toast";
import { HeroChat, HeroChatFormData } from "~/components/HeroChat";

export function HeroChatContainer() {
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
          toast.error("Failed to send message!");
          cb(false);
        } else {
          toast.success("Message sent.");
          cb(true);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to send message");
        cb(false);
      });
  };

  return <HeroChat onSubmit={handleSubmit} />;
}
