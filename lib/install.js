const { spawn } = require('child_process')

const NPM_INSTALL_COMMAND =
  'npm install prettier-standard lint-staged husky --save-dev'
const [cmd, ...args] = NPM_INSTALL_COMMAND.split(/\s/)

/**
 * @param {Object} data buffer.
 * @returns {undefined} logs buffer to console.
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
  console.log(`> ${NPM_INSTALL_COMMAND}`)

  return new Promise(function (resolve, reject) {
    const process = spawn(cmd, args)

    process.stdout.on('data', consoleLog)
    process.stderr.on('data', consoleError)

    process.on('close', function handleProcessClose () {
      console.log('Installation complete.')
      resolve()
    })
    process.on('error', function handleProcessError (error) {
      console.error('Installation failed', error)
      reject(error)
    })
  })
}

module.exports = {
  npmInstall
}
