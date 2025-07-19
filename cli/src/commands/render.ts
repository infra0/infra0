import { Command } from 'commander';
import { addRenderAction } from '../actions/render';

export const render = (program: Command) => {
    const renderCommand = program.command('render')
        .description('Render the project');

    addRenderAction(renderCommand); 

    return renderCommand;
}