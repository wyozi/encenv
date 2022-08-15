import Ajv, { JSONSchemaType } from "ajv";
import { readFileSync, promises as fsPromises } from 'fs'

const ajv = new Ajv();

export interface EncryptedEnvJson {
  publicKey: string;
  variables: Record<string, string>;
}

const schema: JSONSchemaType<EncryptedEnvJson> = {
  type: "object",
  properties: {
    publicKey: { type: "string" },
    variables: {
      type: "object",
      required: [],
      additionalProperties: { type: "string" },
    },
  },
  required: ["publicKey", "variables"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

export async function load(): Promise<EncryptedEnvJson | null> {
  const raw = await fsPromises.readFile('.encenv', 'utf-8')
  const json = JSON.parse(raw)
  if (validate(json)) {
    return json
  } else {
    throw validate.errors
  }
}

export function loadSync(): EncryptedEnvJson | null {
  const raw = readFileSync('.encenv', 'utf-8')
  const json = JSON.parse(raw)
  if (validate(json)) {
    return json
  } else {
    throw validate.errors
  }
}

export async function save(data: EncryptedEnvJson) {
  await fsPromises.writeFile('.encenv', JSON.stringify(data, undefined, 2))
}