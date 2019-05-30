#!/usr/bin/env node

const { createPrettierStandard } = require('../lib')

const [, , glob] = process.argv

async function main () {
  try {
    await createPrettierStandard(glob)
  } catch (e) {
    console.error(e.message)
  }
}

main()
