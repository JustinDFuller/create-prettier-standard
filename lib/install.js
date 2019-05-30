const { spawn } = require('child_process')

const command = 'npm install prettier-standard lint-staged husky --save-dev'
const [cmd, ...args] = command.split(/\s/)

/**
 * @param {Object} data buffer.
 * @returns {undefined} logs buffer to console
 */
function consoleLog (data) {
  console.log(data.toString())
}

/**
 * @param {Object} data buffer.
 * @returns {undefined} logs buffer to console.
 */
function consoleError (data) {
  console.error(data.toString())
}

/**
 * @returns {Promise} A promise that resolves when the command is completed.
 */
function npmInstall () {
  console.log(`> ${command}`)

  return new Promise(function (resolve, reject) {
    const process = spawn(cmd, args)

    process.stdout.on('data', consoleLog)
    process.stderr.on('data', consoleError)

    process.on('close', resolve)
    process.on('error', reject)
  })
}

module.exports = {
  npmInstall
}
