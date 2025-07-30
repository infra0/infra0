import { Command } from 'commander';

export const addProjectPathFlag = (program: Command) => {
    program.option('-p, --projectPath <path>', 'The path to the project');
}