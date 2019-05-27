# create-prettier-standard
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
