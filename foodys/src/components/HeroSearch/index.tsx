import { useRouter } from "next/router";
import { FormEvent, useId } from "react";

export function HeroSearch() {
  const router = useRouter();
  const queryId = useId();

  const handleQueryFormSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const queryInput = ev.currentTarget.elements.namedItem("query");
    if (!queryInput) {
      return;
    }

    if (queryInput instanceof HTMLInputElement) {
      const value = queryInput.value;
      if (value) {
        router.push(`/places?query=${encodeURIComponent(value)}`);
      }
    }
  };

  return (
    <form className="hero__form" onSubmit={handleQueryFormSubmit}>
      <div className="hero__form-label">Find a restaurant or a delivery:</div>
      <div className="hero__form-search">
        <input
          className="hero__form-search-input"
          id={queryId}
          type="search"
          name="query"
          placeholder="City, cuisine or restaurant name"
        />
        <img
          className="hero__form-search-icon"
          src="/img/icons/glass.svg"
          alt="glass"
        />
      </div>
      <button type="submit" className="hero__form-search-btn">
        Search
      </button>
    </form>
  );
}
