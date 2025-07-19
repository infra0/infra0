import { Command } from 'commander';
import { info as infoAction } from '../actions/info';

export const addInfoFlag = (program: Command, info: string) => {
    program.option('-i, --info', info);
}