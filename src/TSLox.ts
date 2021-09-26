import * as fs from 'fs/promises';
import * as readline from 'readline';

import { Scanner } from './scanner';
import { TSLoxErrorReporter } from './ErrorReporter';

/**
 * Main TSLox interface responsible for running code provided either through
 * a source file name or by user input in a REPL environment
 */
export class TSLox {
    hadError: boolean;
    errorReporter: TSLoxErrorReporter;

    constructor() {
        this.hadError = false;
        this.errorReporter = new TSLoxErrorReporter();
    }

    /**
     * Determines execution mode by parsing input arguments passed through from the
     * command line invocation
     *
     * @param {string[]} ...args
     */
    main(...args: string[]) {
        if (args.length > 1) {
            console.log('Usage: npm run tslox [script]');
            process.exitCode = 64;
        } else if (args.length === 1) {
            this.runFile(args[0]);
        } else {
            this.runPrompt();
        }
    }

    /**
     * Executes code by doing the following steps:
     *   1. Scanning/Lexical Analysis
     *      .
     *      .
     *      .
     *
     * @param  {string} source
     */
    private run(source: string) {
        const scanner = new Scanner(source, this.errorReporter);
        const tokens = scanner.scanTokens();

        tokens.forEach((token) => console.log(token));
    }

    /**
     * Reads source code from a given input file and executes it
     *
     * @param  {string} path
     */
    private async runFile(path: string) {
        const file = await fs.readFile(path, 'utf8');
        this.run(file);

        // In case of any errors, return appropriate exit code
        if (this.hadError) process.exit(65);
    }

    /**
     * Executes code line by line as read from a REPL interface
     */
    private async runPrompt() {
        const io = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        // asynchronous helper to read input from the command line
        const prompt = (text: string): Promise<string> => {
            return new Promise((resolve) => {
                io.question(text, resolve);
            });
        };

        while (true) {
            const input = await prompt('> ');
            this.run(input);
            // reset error flag to continue REPL session
            this.hadError = false;
            this.errorReporter.reset();
        }
    }
}
