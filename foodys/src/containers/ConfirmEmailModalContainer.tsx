import useTranslation from "next-translate/useTranslation";
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
  const { t } = useTranslation("common");
  const sendConfirmEmailLink = api.auth.sendConfirmEmailLink.useMutation();

  const hanldeResendEmail = () => {
    const toastId = toast.loading(t("toastLoading"), {
      style: {
        minWidth: "150px",
      },
    });

    sendConfirmEmailLink
      .mutateAsync({ email: props.email })
      .then((response) => {
        switch (response.code) {
          case "SUCCESS": {
            toast.success(t("toastEmailSent"), { id: toastId });
            break;
          }
          case "USER_NOT_FOUND": {
            toast.error(t("toastUserNotFound"), { id: toastId });
            break;
          }
          case "EMAIL_CONFIRMED": {
            toast(t("toastEmailVerified"), { id: toastId });
            break;
          }
          default: {
            toast.error(t("toastFailedToSendEmail"), { id: toastId });
          }
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(t("toastFailedToSendEmail"), { id: toastId });
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
