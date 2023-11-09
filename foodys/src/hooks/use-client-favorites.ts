import { useEffect, useState } from "react";

const FAVORITES_KEY = "favorites";

const DEFAULT_FAVORITES: string[] = [];

export function useClientFavorites(): [
  string[],
  (id: string) => void,
  (id: string) => void
] {
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

  return [ids, append, remove];
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
