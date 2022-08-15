import { decryptValue } from "./encenv/crypto";
import { loadSync } from "./encenv/file";

export function config(privateKey: string) {
  if (!privateKey) {
    console.warn('no encenv private key provided')
    return
  }

  const j = loadSync()
  if (!j) {
    console.warn('.encenv file missing')
    return
  }
  
  for (const [key, val] of Object.entries(j.variables)) {
    process.env[key] = decryptValue(val, privateKey)
  }
}