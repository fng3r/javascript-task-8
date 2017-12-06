'use strict';

class CommandsExecutor {
    constructor(commands) {
        this._commands = commands;
    }

    getAvailableCommandNames() {
        return this._commands.map(command => command.name);
    }

    execute(commandName, params) {
        const command = this._getCommand(commandName);

        return command.execute(params);
    }

    _getCommand(commandName) {
        return this._commands.find(command => command.name === commandName);
    }
}

module.exports = CommandsExecutor;
