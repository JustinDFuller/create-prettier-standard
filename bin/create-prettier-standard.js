#!/usr/bin/env node

const createPrettierStandard = require('../lib')

const [, , glob] = process.argv

createPrettierStandard(glob).catch(e => console.error(e.message))
