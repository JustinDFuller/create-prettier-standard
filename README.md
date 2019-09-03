# create-prettier-standard

[![Greenkeeper badge](https://badges.greenkeeper.io/JustinDFuller/create-prettier-standard.svg)](https://greenkeeper.io/)

A quick way to add prettier-standard to your npm app.

Use this command to add prettier-standard to your app:

```
npm init prettier-standard
```

Optionally you can pass in a custom glob

```
npm init prettier-standard -- {src,test}/**/*.js
```

This will replace the default glob.

## What does it do

This will add a `format` command to your npm scripts which will look like `"format": "prettier-standard 'src/**/*.js'"`.

It will add a `husky` hook for `pre-commit` which will run `lint-staged`. `lint-staged` will run `prettier-standard` against any changed files.

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "linters": {
      "{src,lib,test,tests,__tests__,bin}/**/*.js": [
        "prettier-standard",
        "git add"
      ]
    }
  },
  "scripts": {
    "format": "prettier-standard \"{src,lib,test,tests,__tests__,bin}/**/*.js\""
  },
  "devDependencies": {
    "husky": "^2.3.0",
    "lint-staged": "^8.1.7",
    "prettier-standard": "^9.1.1"
  }
}
```

If you already have a format, husky, or lint-staged script it will try to add these settings without overriding anything.

## Usage as a node module

This package can be used as a CLI or a node module. To use it as a node module you can import it just like any other.
```js
const { createPrettierStandard } = require('create-prettier-standard')

async function someFunction () {
  await createPrettierStandard('GLOB_HERE')
}
```
