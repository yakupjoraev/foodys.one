import toast from "react-hot-toast";
import { ConfirmEmailModal } from "~/components/ConfirmEmailModal";
import { api } from "~/utils/api";

export interface ConfirmAccountModalContainerProps {
  open: boolean;
  email: string;
  onClose: () => void;
  onNavAuth: () => void;
}

export function ConfirmAccountModalContainer(
  props: ConfirmAccountModalContainerProps
) {
  const sendConfirmEmailLink = api.auth.sendConfirmEmailLink.useMutation();

  const hanldeResendEmail = () => {
    const toastId = toast.loading("Wait, please...", {
      style: {
        minWidth: "150px",
      },
    });

    sendConfirmEmailLink
      .mutateAsync({ email: props.email })
      .then((response) => {
        switch (response.code) {
          case "SUCCESS": {
            toast.success("Email sent", { id: toastId });
            break;
          }
          case "USER_NOT_FOUND": {
            toast.error("User not found!", { id: toastId });
            break;
          }
          case "EMAIL_CONFIRMED": {
            toast("E-mail is already verified", { id: toastId });
            break;
          }
          default: {
            toast.error("Failed to send email", { id: toastId });
          }
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to send email", { id: toastId });
      });
  };

  return (
    <ConfirmEmailModal
      open={props.open}
      onClose={props.onClose}
      onResendEmail={hanldeResendEmail}
      onNavAuth={props.onNavAuth}
    />
  );
}
