const path = require('path')
const { promisify } = require('util')
const { readFile, writeFile } = require('fs')
const { spawn } = require('child_process')

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

const DEFAULT_PATTERN = '{src,lib,test,tests,__tests__,bin}/**/*.js'

function execAsync (command) {
  return new Promise(function (resolve, reject) {
    const [cmd, ...args] = command.split(/\s/)
    const process = spawn(cmd, args)

    process.stdout.on('data', function (data) {
      console.log(data.toString())
    })
    process.stderr.on('data', function (data) {
      console.error(data.toString())
    })

    process.on('close', resolve)
    process.on('error', reject)
  })
}

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

function merge (...objects) {
  return objects.reduce(function (sum, value) {
    for (let key in value) {
      const property = value[key]

      if (
        typeof property === 'object' &&
        property !== null &&
        !Array.isArray(property)
      ) {
        sum[key] = merge(sum[key] || {}, property)
      } else {
        sum[key] = property
      }
    }

    return sum
  }, {})
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

module.exports = async function (pattern) {
  const defaults = getDefaults(pattern)

  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const packageJsonString = await getPackageJsonString(packageJsonPath)
  const packageJson = parsePackageJson(packageJsonString, packageJsonPath)

  // the order here is important so that existing package json properties are not overwritten.
  const updatedPackageJson = merge(defaults, packageJson)

  await writeFileAsync(
    packageJsonPath,
    JSON.stringify(updatedPackageJson, null, 2)
  )
  console.log(
    `Updated ${packageJsonPath} with prettier-standard, lint-staged, and husky.`
  )

  console.log('Installing prettier-standard, lint-staged, and husky.')
  await execAsync('npm install prettier-standard lint-staged husky --save-dev')
  console.log('Installation complete.')
}
