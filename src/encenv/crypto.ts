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

export function encryptValue(value: string, publicKey: string) {
  const symmetricKey = crypto.randomBytes(32)
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv('aes256', symmetricKey, iv)
  let ciphered = cipher.update(value, 'utf-8', 'base64')
  ciphered += cipher.final('base64')

  const keyCipher = crypto.publicEncrypt(derToPem(publicKey, 'PUBLIC'), symmetricKey).toString('base64')
  return `${keyCipher}:${iv.toString('base64')}:${ciphered}`
}

export function decryptValue(value: string, privateKey: string) {
  const [keyCipher, iv, cipherText] = value.split(':', 3)
  const symmetricKey = crypto.privateDecrypt(derToPem(privateKey, 'PRIVATE'), Buffer.from(keyCipher, 'base64'))

  const decipher = crypto.createDecipheriv('aes256', symmetricKey, Buffer.from(iv, 'base64'))
  let deciphered = decipher.update(cipherText, 'base64', 'utf-8')
  deciphered += decipher.final('utf-8')

  return deciphered
}