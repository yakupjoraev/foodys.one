import { createHash } from "crypto";

export function checkSignature(
  signature: string,
  data: string,
  secret: string
) {
  const dataSignature = createHash("sha256")
    .update(data + secret)
    .digest("hex");
  return signature === dataSignature;
}
