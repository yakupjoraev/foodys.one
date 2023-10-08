import { signIn } from "next-auth/react";
import { useState } from "react";
import {
  RegisterError,
  RegisterModal,
  RegisterRequest,
} from "~/components/RegisterModal";

export interface RegisterModalContainerProps {
  open: boolean;
  onClose: () => void;
  onNavAuth: () => void;
}

export function RegisterModalContainer(props: RegisterModalContainerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<RegisterError | undefined>(undefined);

  const handleRegister = (opts: RegisterRequest) => {
    setLoading(true);
    fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email: opts.email,
        password: opts.password,
        firstName: opts.firstName,
        lastName: opts.lastName,
        nickname: opts.nickname || undefined,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(() => {
        return signIn("credentials", {
          redirect: false,
          login: opts.email,
          password: opts.password,
        });
      })
      .then((res) => {
        if (!res) {
          setError({ type: "unknown" });
          return;
        }
        if (res.ok) {
          props.onClose();
          return;
        }
        if (res.status === 409) {
          setError({ type: "user_exists" });
          return;
        }
        setError({ type: "unknown" });
      })
      .catch((error) => {
        console.error(error);
        const message =
          typeof error.message === "string" ? error.message : undefined;
        setError({ type: "unknown", message });
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
