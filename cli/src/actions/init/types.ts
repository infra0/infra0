import { BaseCommandOptions } from "../../types";

export interface InitCommandOptions extends BaseCommandOptions {
    projectPath: string;
    force?: boolean;
}