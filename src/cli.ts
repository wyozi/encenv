#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import { decryptValue, encryptValue, generateKeys } from "./encenv/crypto";
import { EncryptedEnvJson, load, save } from "./encenv/file";
const program = new Command();

program
  .name("encenv")
  .description("encrypted .env")
  .option("-f, --file <file>", "encrypted env file")
  .version("0.0.1");

program
  .command("init")
  .description(
    "Create an encrypted env file from scratch or from an existing .env"
  )
  .action(async (options) => {
    const keys = await generateKeys();
    const json: EncryptedEnvJson = {
      publicKey: keys.publicKey,
      variables: {},
    };
    await save(json, options.file);
    console.log("Empty .encenv generated");
    console.log(`${chalk.blue("[PRIVATE KEY]")} ${keys.privateKey}`);
  });

program
  .command("set")
  .description("Set an encrypted variable")
  .argument("<key>")
  .argument("<value>")
  .action(async (key, value, options) => {
    const json = await load(options.file);
    json!.variables[key] = encryptValue(value, json!.publicKey!);
    await save(json!);
  });

program
  .command("load")
  .description("Load variables from file and set in env")
  .argument("[private-key]")
  .action(async (privateKeyArg, options) => {
    const privateKey = privateKeyArg || process.env.ENCENV_KEY;

    const json = await load(options.file);
    for (const [key, val] of Object.entries(json!.variables)) {
      process.env[key] = decryptValue(val, privateKey);
    }
  });

program
  .command("dump")
  .description("Print variables")
  .argument("[private-key]")
  .action(async (privateKeyArg, options) => {
    const privateKey = privateKeyArg || process.env.ENCENV_KEY;

    const json = await load(options.file);
    for (const [key, val] of Object.entries(json!.variables)) {
      console.log(key, "=", decryptValue(val, privateKey));
    }
  });

program.parse();
