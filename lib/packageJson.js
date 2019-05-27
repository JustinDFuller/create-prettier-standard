const { promisify } = require('util')
const { readFile, writeFile } = require('fs')

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

const DEFAULT_PATTERN = '{src,lib,test,tests,__tests__,bin}/**/*.js'

async function getPackageJsonString (packageJsonPath) {
  try {
    return await readFileAsync(packageJsonPath, 'utf8')
  } catch (e) {
    throw new Error(`No package.json file found at ${packageJsonPath}`)
  }
}

function parsePackageJson (packageJsonString, packageJsonPath) {
  try {
    return JSON.parse(packageJsonString)
  } catch (e) {
    throw new Error(`Invalid JSON in package.json file at ${packageJsonPath}`)
  }
}

function getDefaults (pattern = DEFAULT_PATTERN) {
  return {
    husky: {
      hooks: {
        'pre-commit': 'lint-staged'
      }
    },
    'lint-staged': {
      linters: {
        [pattern]: ['prettier-standard', 'git add']
      }
    },
    scripts: {
      format: `prettier-standard "${pattern}"`
    }
  }
}

function updatePackageJson (updatedPackageJson, packageJsonPath) {
  return writeFileAsync(
    packageJsonPath,
    JSON.stringify(updatedPackageJson, null, 2)
  )
}

module.exports = {
  getPackageJsonString,
  updatePackageJson,
  parsePackageJson,
  getDefaults
}
