const path = require('path')
const { promisify } = require('util')
const { readFile, writeFile } = require('fs')

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

const DEFAULT_PATTERN = '{src,lib,test,tests,__tests__,bin}/**/*.js'


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

function packageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json')

  async function updatePackageJson (updatedPackageJson) {
    await writeFileAsync(
      packageJsonPath,
      JSON.stringify(updatedPackageJson, null, 2)
    )
    console.log(
      `Updated ${packageJsonPath} with prettier-standard, lint-staged, and husky.`
    )
  }

  function parsePackageJson (packageJsonString) {
    try {
      return JSON.parse(packageJsonString)
    } catch (e) {
     throw new Error(`Invalid JSON in package.json file at ${packageJsonPath}`)
    }
  }

  async function getPackageJson () {
    const packageJsonString = await getPackageJsonString(packageJsonPath)
    return parsePackageJson(packageJsonString)
  }

  async function getPackageJsonString () {
    try {
      return await readFileAsync(packageJsonPath, 'utf8')
    } catch (e) {
      throw new Error(`No package.json file found at ${packageJsonPath}`)
    }
  }

  return {
    updatePackageJson,
    getPackageJson
  }
}

module.exports = {
  packageJson,
  getDefaults
}
