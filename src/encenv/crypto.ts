import crypto from "crypto";
import { promisify } from 'util'

const generateKeyPairAsync = promisify(crypto.generateKeyPair)

export async function generateKeys() {
  const pair = await generateKeyPairAsync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "der",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "der"
    },
  });
  return {
    publicKey: pair.publicKey.toString('base64'),
    privateKey: pair.privateKey.toString('base64')
  }
}

function derToPem(der: string, type: 'PUBLIC' | 'PRIVATE') {
  return `-----BEGIN ${type} KEY-----\n${der.match(/.{0,64}/g)!.join('\n')}-----END ${type} KEY-----\n`
}

export async function encryptValue(value: string, publicKey: string) {
  return crypto.publicEncrypt(derToPem(publicKey, 'PUBLIC'), Buffer.from(value)).toString('base64')
}

export async function decryptValue(value: string, privateKey: string) {
  return crypto.privateDecrypt(derToPem(privateKey, 'PRIVATE'), Buffer.from(value, 'base64')).toString('utf-8')
}