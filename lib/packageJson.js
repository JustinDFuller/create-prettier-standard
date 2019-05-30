const path = require('path')
const { promisify } = require('util')
const { readFile, writeFile } = require('fs')

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

const DEFAULT_PATTERN = '{src,lib,test,tests,__tests__,bin}/**/*.js'

/**
 * @param {string} pattern The glob pattern for prettier-standard
 * @returns {Object} the default options to be used if none already exist in package json
 */
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

/**
 * @returns {Object} functions that are used to interact with the package.json in the current dir.
 */
function packageJson () {
  const packageJsonPath = path.join(process.cwd(), 'package.json')

  /**
   * @param {Object} updatedPackageJson The updated package json object.
   * returns {undefined} Updates the package json.
   */
  async function updatePackageJson (updatedPackageJson) {
    await writeFileAsync(
      packageJsonPath,
      JSON.stringify(updatedPackageJson, null, 2)
    )
    console.log(
      `Updated ${packageJsonPath} with prettier-standard, lint-staged, and husky.`
    )
  }

  /**
   * @param {string} packageJsonString Package json in string form.
   * @returns {Object} Package json object.
   */
  function parsePackageJson (packageJsonString) {
    try {
      return JSON.parse(packageJsonString)
    } catch (e) {
      throw new Error(`Invalid JSON in package.json file at ${packageJsonPath}`)
    }
  }

  /**
   * @returns {Object} package json object.
   */
  async function getPackageJson () {
    const packageJsonString = await getPackageJsonString(packageJsonPath)
    return parsePackageJson(packageJsonString)
  }

  /**
   * @returns {string} package json file contents.
   */
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
