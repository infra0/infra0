import { Command } from 'commander';
import { addInitAction } from '../actions/init';
import { addInfoFlag } from '../flags/info';
import infoStatic from '../static/info.json'

export const init = (program: Command) => {
    const initCommand = program.command('init')
        .description('Initialize a new project');

    addInitAction(initCommand); 

    addInfoFlag(initCommand, infoStatic.init);

    return initCommand;
}