const { spawn } = require('child_process')

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

module.exports = {
  execAsync
}
