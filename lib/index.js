const { packageJson, getDefaults } = require('./packageJson')
const { npmInstall } = require('./install')
const { merge } = require('./object')

/**
 * @param {string} pattern A glob pattern that matches the desired files.
 * @returns {undefined} Updates package JSON and runs NPM install.
 */
async function createPrettierStandard (pattern) {
  const { getPackageJson, writePackageJson } = packageJson()

  // the order here is important so that existing package json properties are not overwritten.
  const updatedPackageJson = merge(getDefaults(pattern), await getPackageJson())

  await writePackageJson(updatedPackageJson)
  // Make sure package json can be updated for doing npm install.
  await npmInstall()
}

module.exports = {
  createPrettierStandard
}
