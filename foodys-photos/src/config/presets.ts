import { Sharp } from "sharp";

export type PresetId = "cover_168x168";

export type Presets = Record<PresetId, (sharp: Sharp, type: "jpeg") => Sharp>;

export function isPresetId(val: string): val is PresetId {
  switch (val) {
    case "cover_168x168": {
      return true;
    }
    default: {
      return false;
    }
  }
}

export const presets: Presets = {
  cover_168x168: (sharp) => sharp.resize({ width: 168, height: 168 }),
};
