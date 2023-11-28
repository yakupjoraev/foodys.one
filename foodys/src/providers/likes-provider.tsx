import React, { useContext } from "react";
import { useEffect, useState } from "react";

const FAVORITES_KEY = "likes";

const DEFAULT_LIKES: string[] = [];

// eslint-disable-next-line @typescript-eslint/no-empty-function
const NOOP: (id: string) => void = (_id: string) => {};

const DEFAULT_USE_LIKES_OUTPUT: UseFavoritesOutput = [
  DEFAULT_LIKES,
  NOOP,
  NOOP,
];

export type UseFavoritesOutput = [
  string[],
  (id: string) => void,
  (id: string) => void
];

export type FavoritesProviderProps = React.PropsWithChildren;

export const FavoritesContext = React.createContext<UseFavoritesOutput>(
  DEFAULT_USE_LIKES_OUTPUT
);

export function useClientLikes(): UseFavoritesOutput {
  const [output, setOutput] = useState(DEFAULT_USE_LIKES_OUTPUT);

  const valuesFromContext = useContext(FavoritesContext);

  useEffect(() => {
    setOutput(valuesFromContext);
  }, [valuesFromContext]);

  return output;
}

export function useClientLikesSnapshot() {
  const [ids, setIds] = useState<string[]>(DEFAULT_LIKES);
  useEffect(() => {
    const nextIds = readAllLikes();
    setIds(nextIds);
  }, []);
  return ids;
}

export function LikesProvider(props: FavoritesProviderProps) {
  const [ids, setIds] = useState<string[]>(DEFAULT_LIKES);

  useEffect(() => {
    const nextIds = readAllLikes();
    setIds(nextIds);
  }, []);

  const append = (id: string) => {
    appendLike(id);
    const nextIds = readAllLikes();
    setIds(nextIds);
  };

  const remove = (id: string) => {
    removeLike(id);
    const nextIds = readAllLikes();
    setIds(nextIds);
  };

  return (
    <FavoritesContext.Provider value={[ids, append, remove]}>
      {props.children}
    </FavoritesContext.Provider>
  );
}

export function readAllLikes() {
  if (typeof window === "undefined") {
    return DEFAULT_LIKES;
  }

  const raw = localStorage.getItem(FAVORITES_KEY);
  if (raw === null) {
    return DEFAULT_LIKES;
  }

  const ids = JSON.parse(raw) as string[];

  return ids;
}

function writeLikes(ids: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

function appendLike(id: string) {
  const currentIds = readAllLikes();
  if (currentIds.includes(id)) {
    return;
  }

  writeLikes([...currentIds, id]);
}

function removeLike(id: string) {
  const currentIds = readAllLikes();
  const index = currentIds.indexOf(id);
  if (index === -1) {
    return;
  }
  writeLikes([
    ...currentIds.slice(0, index),
    ...currentIds.slice(index + 1),
  ]);
}
