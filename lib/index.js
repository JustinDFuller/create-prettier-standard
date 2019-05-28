
const {
  packageJson,
  getDefaults
} = require('./packageJson')
const { execAsync } = require('./process')
const { merge } = require('./object')

const cmd = 'npm install prettier-standard lint-staged husky --save-dev'

/**
 * @param {string} pattern A glob pattern that matches the desired files.
 * @returns {undefined} Updates package JSON and runs NPM install.
 */
module.exports = async function (pattern) {
  const defaults = getDefaults(pattern)
  const { getPackageJson, updatePackageJson } = packageJson()

  // the order here is important so that existing package json properties are not overwritten.
  const updatedPackageJson = merge(defaults, await getPackageJson())

  await updatePackageJson(updatedPackageJson)

  console.log(`> ${cmd}`)
  await execAsync(cmd)
  console.log('Installation complete.')
}
