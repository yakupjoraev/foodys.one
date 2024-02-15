import React, { useContext } from "react";
import { useEffect, useState } from "react";

const FAVORITES_KEY = "favorites";

const DEFAULT_FAVORITES: string[] = [];

// eslint-disable-next-line @typescript-eslint/no-empty-function
const NOOP: (id: string) => void = (_id: string) => {};

const DEFAULT_USE_FAVORITES_OUTPUT: UseFavoritesOutput = [
  DEFAULT_FAVORITES,
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
  DEFAULT_USE_FAVORITES_OUTPUT
);

export function useClientFavorites(): UseFavoritesOutput {
  const [output, setOutput] = useState(DEFAULT_USE_FAVORITES_OUTPUT);

  const valuesFromContext = useContext(FavoritesContext);

  useEffect(() => {
    setOutput(valuesFromContext);
  }, [valuesFromContext]);

  return output;
}

export function useClientFavoritesSnapshot(): [boolean, string[]] {
  const [loading, setLoading] = useState(true);
  const [ids, setIds] = useState<string[]>(DEFAULT_FAVORITES);
  useEffect(() => {
    const nextIds = readAllFavorites();
    setIds(nextIds);
    setLoading(false);
  }, []);
  return [loading, ids];
}

export function FavoritesProvider(props: FavoritesProviderProps) {
  const [ids, setIds] = useState<string[]>(DEFAULT_FAVORITES);

  useEffect(() => {
    const nextIds = readAllFavorites();
    setIds(nextIds);
  }, []);

  const append = (id: string) => {
    appendFavorite(id);
    const nextIds = readAllFavorites();
    setIds(nextIds);
  };

  const remove = (id: string) => {
    removeFavorite(id);
    const nextIds = readAllFavorites();
    setIds(nextIds);
  };

  return (
    <FavoritesContext.Provider value={[ids, append, remove]}>
      {props.children}
    </FavoritesContext.Provider>
  );
}

export function readAllFavorites() {
  if (typeof window === "undefined") {
    return DEFAULT_FAVORITES;
  }

  const raw = localStorage.getItem(FAVORITES_KEY);
  if (raw === null) {
    return DEFAULT_FAVORITES;
  }

  const ids = JSON.parse(raw) as string[];

  return ids;
}

function writeFavorites(ids: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

function appendFavorite(id: string) {
  const currentIds = readAllFavorites();
  if (currentIds.includes(id)) {
    return;
  }

  writeFavorites([...currentIds, id]);
}

function removeFavorite(id: string) {
  const currentIds = readAllFavorites();
  const index = currentIds.indexOf(id);
  if (index === -1) {
    return;
  }
  writeFavorites([
    ...currentIds.slice(0, index),
    ...currentIds.slice(index + 1),
  ]);
}
