import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CLEAR_TIMEOUT = 60000;

export interface SharedCoords {
  latitude: number | null;
  longitude: number | null;
}

type CoordsListener = (coords: SharedCoords) => void;

const DEFAULT_COORDS: SharedCoords = {
  latitude: null,
  longitude: null,
};

const SharedGeolocationContext = createContext<SharedGeolocation | null>(null);

class SharedGeolocation {
  private _provider: Geolocation;
  private _listeners: CoordsListener[] = [];
  private _watchId = 0;
  private _clearId = 0;
  private _latestCoords: SharedCoords | null = null;

  constructor(provider: Geolocation) {
    this._provider = provider;
  }

  addListener(listener: CoordsListener) {
    this._listeners = [...this._listeners, listener];
    this._watch();
  }

  removeListener(listener: CoordsListener) {
    const index = this._listeners.indexOf(listener);
    if (index === -1) {
      this._watch();
      return;
    }
    this._listeners = [
      ...this._listeners.slice(0, index),
      ...this._listeners.slice(index + 1),
    ];
    this._watch();
  }

  getLatestCoords() {
    return this._latestCoords;
  }

  private _watch() {
    if (this._listeners.length) {
      if (this._watchId === 0) {
        this._watchId = this._provider.watchPosition((position) => {
          const { latitude, longitude } = position.coords;
          const sharedCoords: SharedCoords = {
            latitude,
            longitude,
          };
          this._latestCoords = sharedCoords;
          this._listeners.forEach((listener) => void listener(sharedCoords));
        });
      }
      if (this._clearId !== 0) {
        window.clearTimeout(this._clearId);
        this._clearId = 0;
      }
    } else {
      if (this._clearId !== 0) {
        this._clearId = window.setTimeout(
          () => void this._clear(),
          CLEAR_TIMEOUT
        );
      }
    }
  }

  private _clear() {
    this._clearId = 0;
    if (this._listeners.length === 0 && this._watchId !== 0) {
      this._provider.clearWatch(this._watchId);
      this._watchId = 0;
    }
  }
}

export function SharedGeolocationProvider(props: PropsWithChildren) {
  const [sharedGeolocation, setSharedGeolocation] =
    useState<SharedGeolocation | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined") {
      return;
    }
    if (!navigator.geolocation) {
      return;
    }

    const sharedGeolocation = new SharedGeolocation(navigator.geolocation);

    setSharedGeolocation(sharedGeolocation);
  }, []);

  return (
    <SharedGeolocationContext.Provider value={sharedGeolocation}>
      {props.children}
    </SharedGeolocationContext.Provider>
  );
}

export function useSharedGeolocation() {
  const [coords, setCoords] = useState<SharedCoords>(DEFAULT_COORDS);

  const sharedGeolocation = useContext(SharedGeolocationContext);

  useEffect(() => {
    if (sharedGeolocation === null) {
      setCoords(DEFAULT_COORDS);
      return;
    }
    const latestCoords = sharedGeolocation.getLatestCoords();
    setCoords(latestCoords ?? DEFAULT_COORDS);
    sharedGeolocation.addListener(setCoords);
    return () => {
      sharedGeolocation.removeListener(setCoords);
    };
  }, [sharedGeolocation, setCoords]);

  if (sharedGeolocation === null) {
    return DEFAULT_COORDS;
  }

  return coords;
}
