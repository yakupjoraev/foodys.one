import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  ChangePasswordModal,
  type ChangePasswordError,
  type ChangePasswordRequest,
} from "~/components/ChangePasswordModal";
import { api } from "~/utils/api";

export interface ChangePasswordModalContainerProps {
  open: boolean;
  token: string;
  onClose: () => void;
  onPasswordChanged: () => void;
}

export function ChangePasswordModalContainer(
  props: ChangePasswordModalContainerProps
) {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ChangePasswordError | undefined>(
    undefined
  );

  const resetPassword = api.auth.resetPassword.useMutation();

  const handleChangePasswordRequest = (request: ChangePasswordRequest) => {
    setLoading(true);

    resetPassword
      .mutateAsync(request)
      .then((response) => {
        if (response.code === "SUCCESS") {
          props.onPasswordChanged();
        } else if (response.code === "TOKEN_NOT_FOUND") {
          setError({ code: "TOKEN_NOT_FOUND" });
        } else if (response.code === "WEAK_PASSWORD") {
          setError({ code: "WEAK_PASSWORD" });
        } else {
          setError({ code: "GENERAL" });
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(t("toastFailedToResetPassword"));
      });

    setLoading(false);
  };

  return (
    <ChangePasswordModal
      open={props.open}
      loading={loading}
      error={error}
      token={props.token}
      onClose={props.onClose}
      onChangePassword={handleChangePasswordRequest}
    />
  );
}
