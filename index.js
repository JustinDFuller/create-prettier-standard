const { promisify } = require('util')
const { readFile, writeFile } = require('fs')
const path = require('path')

const readFileAsync = promisify(readfile)
const writeFileAsync = promisify(writeFile)

module.exports = async function (pattern = 'src/**/*.js') {
  const defaults = {
    husky: {
      hooks: {
        'pre-commit': 'lint-staged'
      }
    },
    'lint-staged': {
      linters: {
        [pattern]: ['prettier-standard', 'git add']
      }
    }
  }

  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const packageJsonString = await readFileAsync(packageJsonPath, 'utf8')
  const packageJson = JSON.parse(packageJsonString)

  if (packageJson.husky === undefined) {
    packageJson.husky = defaults.husky
  } else if (packageJson.husky.hooks === undefined) {
    packageJson.husky.hooks = defaults.husky.hooks
  } else if (packageJson.husky.hooks['pre-commit'] === undefined) {
    packageJson.husky.hooks['pre-commit'] = defaults.husky.hooks['pre-commit']
  }

  if (packageJson['lint-staged'] === undefined) {
    packageJson['lint-staged'] = defaults['lint-staged']
  } else if (packageJson['lint-staged'].linters === undefined) {
    packageJson['lint-staged'].linters = defaults['lint-staged'].linters
  } else if (packageJson['lint-staged'].linters[pattern] === undefined) {
    packageJson['lint-staged'].linters[pattern] =
      defaults['lint-staged'].linters[pattern]
  }

  return writeFileAsync(packageJsonPath, JSON.stringify(packageJson, null, 2))
}
