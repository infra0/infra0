#!/usr/bin/env node
import commander from 'commander';
import { name, version } from '../package.json';
import {init, render} from "./commands"
import dotenv from 'dotenv';
const NODE_ENV = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${NODE_ENV}` });

const program = new commander.Command();

program.name(name);
program.version(version);

init(program);
render(program);

program.parse();