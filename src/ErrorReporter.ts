/**
 * A (very simple) generic error for TSLox
 */
export class TSLoxError {
    line: number;
    where: string;
    message: string;

    constructor(line: number, message: string, where: string) {
        this.line = line;
        this.message = message;
        this.where = where;
    }
}

/**
 * A reporter and manager for a collection of TSLoxErrors
 */
export class TSLoxErrorReporter {
    errors: TSLoxError[];

    constructor() {
        this.errors = [];
    }

    /**
     * create a new error
     */
    create(line: number, message: string, where: string = '') {
        this.errors.push(new TSLoxError(line, message, where));
    }

    /**
     * report all logged errors
     */
    report() {
        this.errors.forEach(({ line, where, message }) => {
            console.log(`[line ${line}]: Error ${where}: ${message}`);
        });
    }

    /**
     * Delete all errors and start with an empty collection again
     */
    reset() {
        this.errors = [];
    }
}
