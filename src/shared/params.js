'use strict'

const { flags } = require('@oclif/command')

const commandArguments = {
    sourceFolder: {
        name: 'sourceFolder',
        required: true,
        description: 'the root folder of the expanded VTPK container'
    }
}

const commandFlags = {
    levels: flags.string({
        char: 'l',
        description:
            `Restricts the scope of the command to the given zoom levels.
    Provide zoom levels my using the min..max notation.

    I.e. to process the levels 7 to 11 use -l=7..11.
    If you use -l=..6 the levels 0 to 6 wil be processed.

    By setting the flag to -l=14.. all levels from (including) 14 up to
    the maximum level available will be processed.

    The default value for this flag is -l=0..
    `,
        default: '0..'
    })
}

module.exports = {
    args: commandArguments,
    flags: commandFlags
}