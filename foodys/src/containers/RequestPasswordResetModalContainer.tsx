import { useState } from "react";
import toast from "react-hot-toast";
import {
  type RequestPasswordResetError,
  RequetPasswordResetModal,
} from "~/components/RequestPasswordResetModal";
import { api } from "~/utils/api";

export interface RequestPasswordResetModalContainerProps {
  open: boolean;
  onClose: () => void;
  onRequestSent: (email: string) => void;
  onNavAuth: () => void;
}

export function RequestPasswordResetModalContainer(
  props: RequestPasswordResetModalContainerProps
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<RequestPasswordResetError | undefined>();

  const requestPasswordReset = api.auth.requestPasswordReset.useMutation();

  const handleRequestPasswordReset = (email: string) => {
    setLoading(true);

    requestPasswordReset
      .mutateAsync({
        email,
      })
      .then((response) => {
        if (response.code === "SUCCESS") {
          props.onRequestSent(email);
        } else if (response.code === "USER_NOT_FOUND") {
          setError({ code: "USER_NOT_FOUND" });
        } else {
          toast.error("Failed to reset password!");
        }
      })
      .catch(() => {
        toast.error("Failed to reset password!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <RequetPasswordResetModal
      open={props.open}
      loading={loading}
      error={error}
      onClose={props.onClose}
      onRequestPasswordReset={handleRequestPasswordReset}
      onNavAuth={props.onNavAuth}
    />
  );
}
