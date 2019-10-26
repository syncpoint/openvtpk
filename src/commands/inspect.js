const { Command } = require('@oclif/command')
const inspect = require('../shared/inspect')
const params = require('../shared/params')

class InspectCommand extends Command {

    async run() {
        const { args } = this.parse(InspectCommand)
        this.log(`inspecting VTPK at ${args.sourceFolder}`)
        const i = await inspect(args.sourceFolder)
        if (!i.compliance.isCompliant) {
            this.warn(`The VTPK package does not comply with the required folder structure`)
            this.exit(1)
        }
        console.dir(i)
        this.log(`done`)
    }
}

InspectCommand.args = [
    params.args.sourceFolder
]

InspectCommand.description = `Inspects the expanded VTPK folder for compliance and returns detailed information about zoom levels`

module.exports = InspectCommand