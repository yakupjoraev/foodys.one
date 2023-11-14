import React, { useContext } from "react";
import { useEffect, useState } from "react";

const BLOCKED_REVIEWS_KEY = "blocked_reviews";

const DEFAULT_BLOCKED_REVIEWS: string[] = [];

// eslint-disable-next-line @typescript-eslint/no-empty-function
const NOOP: (id: string) => void = (_id: string) => {};

const DEFAULT_USE_FAVORITES_OUTPUT: UseBlockedReviewsOutput = [
  DEFAULT_BLOCKED_REVIEWS,
  NOOP,
  NOOP,
];

export type UseBlockedReviewsOutput = [
  string[],
  (id: string) => void,
  (id: string) => void
];

export type BlockedReviewsProviderProps = React.PropsWithChildren;

export const BlockedReviewsContext =
  React.createContext<UseBlockedReviewsOutput>(DEFAULT_USE_FAVORITES_OUTPUT);

export function useClientBlockedReviews(): UseBlockedReviewsOutput {
  const [output, setOutput] = useState(DEFAULT_USE_FAVORITES_OUTPUT);

  const valuesFromContext = useContext(BlockedReviewsContext);

  useEffect(() => {
    setOutput(valuesFromContext);
  }, [valuesFromContext]);

  return output;
}

export function BlockedReviewsProvider(props: BlockedReviewsProviderProps) {
  const [ids, setIds] = useState<string[]>(DEFAULT_BLOCKED_REVIEWS);

  useEffect(() => {
    const nextIds = readAllBlockedReviews();
    setIds(nextIds);
  }, []);

  const append = (id: string) => {
    appendBlockedReviews(id);
    const nextIds = readAllBlockedReviews();
    setIds(nextIds);
  };

  const remove = (id: string) => {
    removeBlockedReview(id);
    const nextIds = readAllBlockedReviews();
    setIds(nextIds);
  };

  return (
    <BlockedReviewsContext.Provider value={[ids, append, remove]}>
      {props.children}
    </BlockedReviewsContext.Provider>
  );
}

export function readAllBlockedReviews() {
  if (typeof window === "undefined") {
    return DEFAULT_BLOCKED_REVIEWS;
  }

  const raw = localStorage.getItem(BLOCKED_REVIEWS_KEY);
  if (raw === null) {
    return DEFAULT_BLOCKED_REVIEWS;
  }

  const ids = JSON.parse(raw) as string[];

  return ids;
}

function writeBlockedReviews(ids: string[]) {
  localStorage.setItem(BLOCKED_REVIEWS_KEY, JSON.stringify(ids));
}

function appendBlockedReviews(id: string) {
  const currentIds = readAllBlockedReviews();
  if (currentIds.includes(id)) {
    return;
  }

  writeBlockedReviews([...currentIds, id]);
}

function removeBlockedReview(id: string) {
  const currentIds = readAllBlockedReviews();
  const index = currentIds.indexOf(id);
  if (index === -1) {
    return;
  }
  writeBlockedReviews([
    ...currentIds.slice(0, index),
    ...currentIds.slice(index + 1),
  ]);
}
