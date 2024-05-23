import Ajv, { JSONSchemaType } from "ajv";
import { promises as fsPromises, readFileSync } from "fs";

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

export async function load(
  fileName = ".encenv"
): Promise<EncryptedEnvJson | null> {
  const raw = await fsPromises.readFile(fileName, "utf-8");
  const json = JSON.parse(raw);
  if (validate(json)) {
    return json;
  } else {
    throw validate.errors;
  }
}

export function loadSync(fileName = ".encenv"): EncryptedEnvJson | null {
  const raw = readFileSync(fileName, "utf-8");
  const json = JSON.parse(raw);
  if (validate(json)) {
    return json;
  } else {
    throw validate.errors;
  }
}

export async function save(data: EncryptedEnvJson, fileName = ".encenv") {
  await fsPromises.writeFile(fileName, JSON.stringify(data, undefined, 2));
}
