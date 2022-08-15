## encenv

Painless encrypted environment variable storage and management, similar to [Rails custom credentials](https://edgeguides.rubyonrails.org/security.html#custom-credentials).

Encenv stores encrypted secrets (with an accompanying public key) in a file you can freely check in to version control. Variables can be freely set by anyone using the public key, but a private key is required for decryption.

### Install

`npm i encenv`

### Get started

**Initialize encrypted .encenv file for storing variables**

`npx encenv init`

(this command prints a private key; store it in production env as e.g. `ENCENV_KEY`)

**Add secrets**

`npx encenv set MY_API_KEY foobarfoobarfoobar123`

**Decrypt in production**

```ts
require('encenv').config(process.env.ENCENV_KEY)
```