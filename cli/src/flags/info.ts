import { Command } from 'commander';

export const addInfoFlag = (program: Command, info: string) => {
    program.option('-i, --info', info);
}