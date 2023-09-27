import { type Sharp } from "sharp";

export type Preset = Record<string, Sharp>;

export const presets = {
  cover_168x168: (sharp: Sharp) =>
    sharp.resize({
      width: 168,
      height: 168,
    }),
};
