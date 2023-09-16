import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useId } from "react";

export default function Home() {
  const queryId = useId();
  const router = useRouter();

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
            <button className="btn" type="button" onClick={() => router.push("/main")}>
              Main
            </button>
            <button className="btn" type="button" onClick={() => router.push("/about")}>
              About
            </button>
            <button className="login-btn btn hidden" type="button">
              Sign In
            </button>
            <button className="logout-btn btn hidden" type="button">
              Sign Out
            </button>
            <button className="register-btn btn hidden" type="button">
              Register
            </button>
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
    </>
  );
}
