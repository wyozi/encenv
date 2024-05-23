import { decryptValue } from "./encenv/crypto";
import { loadSync } from "./encenv/file";

export function config(
  privateKey: string,
  opts?: {
    fileName?: string;
  }
) {
  if (!privateKey) {
    console.warn("no encenv private key provided");
    return;
  }

  const j = loadSync(opts?.fileName);
  if (!j) {
    console.warn(".encenv file missing");
    return;
  }

  for (const [key, val] of Object.entries(j.variables)) {
    process.env[key] = decryptValue(val, privateKey);
  }
}
