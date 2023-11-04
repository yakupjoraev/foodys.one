import crypto from "crypto";

export function createGReviewHash(
  author: string,
  text: string,
  time: number,
  placeId: string
) {
  const syntheticId = crypto
    .createHash("sha1")
    .update(author + text + time.toString() + placeId)
    .digest("hex");

  return syntheticId;
}
