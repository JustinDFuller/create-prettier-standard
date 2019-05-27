#!/usr/bin/env node

const createPrettierStandard = require('../')

const [,, glob] = process.argv

createPrettierStandard(glob).catch(e => console.error(e.message))
