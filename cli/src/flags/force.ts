import { Command } from 'commander';

export const addForceFlag = (program: Command) => {
    program.option('-f, --force', 'Force the action to run');
}