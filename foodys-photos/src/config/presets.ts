import { Sharp } from "sharp";

export type PresetId = "cover_168x168" | "cover_336x336" | "cover_672x672";

export type Presets = Record<PresetId, (sharp: Sharp) => Sharp>;

export function isPresetId(val: string): val is PresetId {
  switch (val) {
    case "cover_168x168":
    case "cover_336x336":
    case "cover_672x672": {
      return true;
    }
    default: {
      return false;
    }
  }
}

export const presets: Presets = {
  cover_168x168: (sharp) => sharp.resize({ width: 168, height: 168 }),
  cover_336x336: (sharp) => sharp.resize({ width: 336, height: 336 }),
  cover_672x672: (sharp) => sharp.resize({ width: 672, height: 672 }),
};
