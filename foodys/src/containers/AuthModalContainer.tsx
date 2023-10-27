import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { AuthError, AuthModal, AuthRequest } from "~/components/AuthModal";

export interface AuthModalContainerProps {
  open: boolean;
  onClose: () => void;
  onNavRegister: () => void;
}

export function AuthModalContainer(props: AuthModalContainerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | undefined>(undefined);

  useEffect(() => {
    setError(undefined);
  }, [props.open]);

  const handleAuth = (opts: AuthRequest) => {
    setLoading(true);
    signIn("credentials", {
      redirect: false,
      login: opts.login,
      password: opts.password,
    })
      .then((res) => {
        if (!res) {
          setError({ type: "unknown" });
          return;
        } else if (res.ok) {
          props.onClose();
        } else if (res.status === 401) {
          setError({ type: "credentials" });
        } else {
          setError({ type: "unknown", message: res?.error ?? undefined });
        }
      })
      .catch((error) => {
        const message =
          typeof error.message === "string" ? error.message : undefined;
        setError({
          type: "unknown",
          message,
        });
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AuthModal
      open={props.open}
      loading={loading}
      error={error}
      onClose={props.onClose}
      onAuth={handleAuth}
      onNavRegister={props.onNavRegister}
    />
  );
}
