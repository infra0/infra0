import { Command } from 'commander';
import { addInitAction } from '../actions/init';
import { addInfoFlag } from '../flags/info';
import infoStatic from '../static/info.json'
import { addProjectPathFlag } from '../flags/projectPath';
import { addForceFlag } from '../flags/force';

export const init = (program: Command) => {
    const initCommand = program.command('init')
        .description('Initialize a new project');

    addProjectPathFlag(initCommand);

    addInfoFlag(initCommand, infoStatic.init);

    addForceFlag(initCommand);

    addInitAction(initCommand);

    return initCommand;
}