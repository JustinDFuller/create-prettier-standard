const path = require('path')

const {
  getPackageJsonString,
  updatePackageJson,
  parsePackageJson,
  getDefaults
} = require('./packageJson')
const { execAsync } = require('./process')
const { merge } = require('./object')

module.exports = async function (pattern) {
  const defaults = getDefaults(pattern)

  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const packageJsonString = await getPackageJsonString(packageJsonPath)
  const packageJson = parsePackageJson(packageJsonString, packageJsonPath)

  // the order here is important so that existing package json properties are not overwritten.
  const updatedPackageJson = merge(defaults, packageJson)

  await updatePackageJson(updatedPackageJson, packageJsonPath)
  console.log(
    `Updated ${packageJsonPath} with prettier-standard, lint-staged, and husky.`
  )

  console.log('Installing prettier-standard, lint-staged, and husky.')
  await execAsync('npm install prettier-standard lint-staged husky --save-dev')
  console.log('Installation complete.')
}
