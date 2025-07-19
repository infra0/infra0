import { Command } from 'commander';

export const addInitAction = (program: Command) => {
    program.action(() => {
        console.log("Initializing new project")
    });
}