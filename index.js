const path = require('path')
const { promisify } = require('util')
const { readFile, writeFile } = require('fs')
const { exec } = require('child_process')

const execAsync = promisify(exec)
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

async function getPackageJsonString (packageJsonPath) {
  try {
    return await readFileAsync(packageJsonPath, 'utf8')
  } catch (e) {
    throw new Error(`No package.json file found at ${packageJsonPath}`)
  }
}

function parsePackageJson(packageJsonString, packageJsonPath) {
  try {
    return JSON.parse(packageJsonString)
  } catch (e) {
    throw new Error(`Invalid JSON in package.json file at ${packageJsonPath}`)
  }
}

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
    },
    scripts: {
      format: `prettier-standard "${pattern}"`
    }
  }

  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const packageJsonString = await getPackageJsonString(packageJsonPath)
  const packageJson = parsePackageJson(packageJsonString, packageJsonPath)

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

  if (packageJson.scripts === undefined) {
    packageJson.scripts = defaults.scripts
  } else if (packageJson.scripts.format === undefined) {
    packageJson.scripts.format = defaults.scripts.format
  }

  await writeFileAsync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  console.log(
    `Updated ${packageJsonPath} with prettier-standard, lint-staged, and husky.`
  )

  console.log('Installing prettier-standard, lint-staged, and husky.')
  const npmInstall = await execAsync(
    'npm install prettier-standard lint-staged husky --save-dev'
  )
  console.log(npmInstall)
  console.log('Installation complete.')
}
