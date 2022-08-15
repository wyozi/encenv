#!/usr/bin/env node

import { Command } from "commander";
import chalk from 'chalk'
import { EncryptedEnvJson, load, save } from "./encenv/file";
import { decryptValue, encryptValue, generateKeys } from "./encenv/crypto";
const program = new Command();

program
  .name("encenv")
  .description("encrypted .env")
  .version("0.0.1");

program.command('init')
  .description('Create an encrypted env file from scratch or from an existing .env')
  .action(async (options) => {
    const keys = await generateKeys()
    const json: EncryptedEnvJson = {
      publicKey: keys.publicKey,
      variables: {}
    }
    await save(json)
    console.log('Empty .encenv generated')
    console.log(`${chalk.blue('[PRIVATE KEY]')} ${keys.privateKey}`)
  });

program.command('set')
  .description('Create an encrypted env file from scratch or from an existing .env')
  .argument('<string>', 'key to set')
  .argument('<string>', 'plaintext value')
  .action(async (key, value, options) => {
    const json = await load()
    json!.variables[key] = encryptValue(value, json!.publicKey!)
    await save(json!)
  });

program.command('dump')
  .description('Create an encrypted env file from scratch or from an existing .env')
  .argument('<string>', 'private key')
  .action(async (privateKey, options) => {
    const json = await load()
    for (const [key, val] of Object.entries(json!.variables)) {
      console.log(key, '=', decryptValue(val, privateKey))
    }
  });

program.parse();

