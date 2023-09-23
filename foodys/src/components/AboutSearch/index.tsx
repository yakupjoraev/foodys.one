import { useRouter } from "next/router";
import { FormEvent, useId } from "react";

export function AboutSearch() {
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
    <form className="about__find" onSubmit={handleQueryFormSubmit}>
      <div className="about__find-inner">
        <div className="about__find-picture">
          <img
            className="about__find-pic"
            src="/img/about/about__find-burger.png"
            alt="burger"
          />
        </div>
        <div className="about__find-searching">
          <p className="about__find-label">Find a restaurant or a delivery:</p>
          <div className="about__find-search">
            <input
              className="about__find-seacrh-input"
              id={queryId}
              name="query"
              type="search"
              placeholder="City, cuisine or restaurant name"
            />
            <img
              className="about__find-search-icon"
              src="/img/icons/glass.svg"
              alt="glass"
            />
          </div>
          <button type="submit" className="about__find-btn">
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
