import { signIn } from "next-auth/react";
import { useState } from "react";
import {
  RegisterError,
  RegisterModal,
  RegisterRequest,
} from "~/components/RegisterModal";
import { api } from "~/utils/api";

export interface RegisterModalContainerProps {
  open: boolean;
  onClose: () => void;
  onNavAuth: () => void;
  onNavConfirmAccount: (email: string) => void;
}

export function RegisterModalContainer(props: RegisterModalContainerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<RegisterError | undefined>(undefined);

  const createAccount = api.auth.createAccount.useMutation();

  const handleRegister = (opts: RegisterRequest) => {
    setLoading(true);

    createAccount
      .mutateAsync(opts)
      .then((result) => {
        console.log("R", result);
        if (result.code === "SUCCESS") {
          props.onNavConfirmAccount(opts.email);
        } else if (result.code === "USER_EXISTS") {
          setError({ type: "user_exists" });
        } else {
          setError({ type: "unknown" });
        }
      })
      .catch((error) => {
        console.error(error);
        setError({ type: "unknown" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <RegisterModal
      open={props.open}
      loading={loading}
      error={error}
      onClose={props.onClose}
      onRegister={handleRegister}
      onNavAuth={props.onNavAuth}
    />
  );
}
