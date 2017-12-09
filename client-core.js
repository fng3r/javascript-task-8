'use strict';

module.exports.execute = execute;
module.exports.isStar = true;

const commands = require('./commands/commands');
const CommandsExecutor = require('./commands/commands-executor');

const argparse = require('argparse');
const Forge = require('forge-di').default;

const forge = new Forge();
forge.bind('commands').to.type(commands.ListCommand);
forge.bind('commands').to.type(commands.SendCommand);
forge.bind('commands').to.type(commands.EditCommand);
forge.bind('commands').to.type(commands.DeleteCommand);
forge.bind('parser').to.function(createParser);

const executor = forge.create(CommandsExecutor);
const parser = forge.get('parser');

function execute() {
    const args = parser.parseArgs(process.argv.slice(2));
    const query = createQueryFrom(args);
    const { id, text, verbose } = args;
    const params = {
        query,
        path: id,
        body: { text },
        verbose
    };
    const command = args.command;

    return executor.execute(command, params).catch(err => `${err.name}: ${err.message}`);
}

function createQueryFrom(args) {
    return ['from', 'to']
        .filter(property => args[property])
        .reduce((query, property) => {
            query[property] = args[property];

            return query;
        }, {});
}

function createParser() {
    const argparser = new argparse.ArgumentParser();

    argparser.addArgument('command', {
        help: 'command name',
        choices: executor.getAvailableCommandNames()
    });

    argparser.addArgument('--from', { help: 'message sender' });
    argparser.addArgument('--to', { help: 'message recipient' });
    argparser.addArgument('--text', { help: 'message text', defaultValue: '' });
    argparser.addArgument('--id', { help: 'message id', defaultValue: '' });
    argparser.addArgument('-v', {
        help: 'show message details',
        action: 'storeTrue',
        dest: 'verbose'
    });

    return argparser;
}
