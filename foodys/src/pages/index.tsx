import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useId, useState } from "react";
import { AuthModalContainer } from "~/containers/AuthModalContainer";
import { RegisterModalContainer } from "~/containers/RegisterModalContainer";

export default function Home() {
  const queryId = useId();
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const [registerModalOpened, setRegisterModalOpened] = useState(false);
  const [authModalOpened, setAuthModalOpened] = useState(false);

  const handleSearchFormSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const currentTarget = ev.currentTarget;

    const queryInput = currentTarget.elements.namedItem("query");
    if (queryInput && queryInput instanceof HTMLInputElement) {
      const query = queryInput.value;
      query && router.push(`/places?query=${encodeURIComponent(query)}`);
      return;
    }
  };

  const handleRegisterModalClose = () => {
    setRegisterModalOpened(false);
  };

  const handleRegisterBtnClick = () => {
    setRegisterModalOpened(true);
  };

  const handleAuthModalClose = () => {
    setAuthModalOpened(false);
  };

  const handleAuthBtnClick = () => {
    setAuthModalOpened(true);
  };

  const handleSignOutBtnClick = () => {
    signOut();
  };

  return (
    <>
      <Head>
        <title>Foodys</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="page">
        <header className="header">
          <a className="logo" href="/">
            foodys.one
          </a>
          <div className="header__extra">
            {!!sessionData && (
              <div className="header__username">
                {sessionData.user.name || "???"}
              </div>
            )}
            {!!sessionData && (
              <button
                className="logout-btn btn"
                type="button"
                onClick={handleSignOutBtnClick}
              >
                Sign Out
              </button>
            )}
            {!sessionData && (
              <button
                className="login-btn btn"
                type="button"
                onClick={handleAuthBtnClick}
              >
                Sign In
              </button>
            )}
            {!sessionData && (
              <button
                className="register-btn btn"
                type="button"
                onClick={handleRegisterBtnClick}
              >
                Register
              </button>
            )}
          </div>
        </header>
        <div className="page__content main">
          <form className="main-form" onSubmit={handleSearchFormSubmit}>
            <div className="main-form__control">
              <label className="main-form__label" htmlFor={queryId}>
                Find a restaurant or a delivery:
              </label>
              <input
                className="main-form__search-input"
                id={queryId}
                type="text"
                name="query"
                placeholder="City, cousine or restaurant name"
              />
            </div>
            <button className="main-form__search-btn btn">Search</button>
          </form>
        </div>
      </div>
      <RegisterModalContainer
        open={registerModalOpened}
        onClose={handleRegisterModalClose}
      />
      <AuthModalContainer
        open={authModalOpened}
        onClose={handleAuthModalClose}
      />
    </>
  );
}
