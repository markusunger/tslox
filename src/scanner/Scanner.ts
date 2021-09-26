import { TSLoxErrorReporter } from '../ErrorReporter';

import { Literal, Token } from './Token';
import { TokenType } from './TokenType';
import { Keywords } from './Keywords';
import { isAlpha, isAlphaNumeric, isDigit } from './utils';

/**
 * A scanner for lexical analysis of TSLox source code
 */
export class Scanner {
    source: string;
    errorReporter: TSLoxErrorReporter;

    tokens: Token[];

    start = 0;
    current = 0;
    line = 1;

    constructor(source: string, errorReporter: TSLoxErrorReporter) {
        this.source = source;
        this.tokens = [];
        this.errorReporter = errorReporter;
    }
    /**
     * Scans and stores tokens until the end of the source code has been reached
     *
     * @returns Token[]
     */
    scanTokens(): Token[] {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        // add final EOF token
        this.tokens.push(new Token(TokenType.EOF, '', undefined, this.line));

        return this.tokens;
    }

    /**
     * Looks at next character and determines upcoming token, advances cursor to
     * the end of the current token and stores current token
     */
    private scanToken() {
        const char = this.advance();
        switch (char) {
            case '(':
                this.addToken(TokenType.LEFT_PAREN);
                break;
            case ')':
                this.addToken(TokenType.RIGHT_PAREN);
                break;
            case '{':
                this.addToken(TokenType.LEFT_BRACE);
                break;
            case '}':
                this.addToken(TokenType.RIGHT_BRACE);
                break;
            case ',':
                this.addToken(TokenType.COMMA);
                break;
            case '.':
                this.addToken(TokenType.DOT);
                break;
            case '-':
                this.addToken(TokenType.MINUS);
                break;
            case '+':
                this.addToken(TokenType.PLUS);
                break;
            case ';':
                this.addToken(TokenType.SEMICOLON);
                break;
            case '*':
                if (this.match('/')) {
                    // comment block closed
                } else {
                    this.addToken(TokenType.STAR);
                }
                break;
            case '!':
                this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
                break;
            case '=':
                this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
                break;
            case '<':
                this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
                break;
            case '>':
                this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                break;
            case '/':
                if (this.match('/')) {
                    // handle comments by reading until end of line and discarding reads
                    // (at least until we want to treat comments differently)
                    while (this.peek() !== '\n' && !this.isAtEnd()) {
                        this.advance();
                    }
                } else if (this.match('*')) {
                    // handle block style comments à la C by peeking until spotting the
                    // closing comment symbols, handle them through the scanner
                    while (this.peek() !== '*' && this.peek(2) !== '/' && !this.isAtEnd()) {
                        const char = this.advance();
                        if (char === '\n') this.line += 1;
                    }
                } else {
                    this.addToken(TokenType.SLASH);
                }
                break;
            case ' ':
            case '\r':
            case '\t':
                // ignore whitespaces
                break;
            case '\n':
                this.line += 1;
                break;
            case '"':
                this.string();
                break;
            default:
                if (isDigit(char)) {
                    this.number();
                } else if (isAlpha(char)) {
                    this.identifier();
                } else {
                    this.errorReporter.create(this.line, '', 'Unexpected character.');
                }
        }
    }

    /**
     * Checks if cursor is at the end of the source code
     *
     * @returns boolean
     */
    private isAtEnd(): boolean {
        return this.current >= this.source.length;
    }

    /**
     * Returns the character at the cursor position and advances the cursor
     *
     * @returns string
     */
    private advance(): string {
        const char = this.source.charAt(this.current);
        this.current += 1;
        return char;
    }

    /**
     * Adds a new token to the collection of tokens
     *
     * @param  {TokenType} type
     * @param  {Literal} literal?
     * @returns void
     */
    private addToken(type: TokenType, literal?: Literal): void {
        const text = this.source.slice(this.start, this.current);
        this.tokens.push(new Token(type, text, literal, this.line));
    }

    /**
     * Checks whether the next character matches the provided argument, if so
     * it advances the cursor
     *
     * @param  {string} expected
     */
    private match(expected: string) {
        // no two-character lexeme possible when eof has already been reached
        if (this.isAtEnd()) return false;

        if (this.source.charAt(this.current) !== expected) return false;

        this.current += 1;
        return true;
    }

    /**
     * Peeks at a position of X characters ahead, where X is the provided argument
     *
     * @param  {number=1} ff
     */
    private peek(ff: number = 1) {
        if (this.isAtEnd()) return '\0';
        return this.source.charAt(this.current + ff - 1) || '\0';
    }

    /**
     * Scans for the complete string and saves its token (including the value) to the collection of tokens
     */
    private string() {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            if (this.peek() === '\n') this.line += 1;
            this.advance();
        }

        if (this.isAtEnd()) {
            this.errorReporter.create(this.line, 'Unterminated string.');
            return;
        }

        // closing character (") reached
        this.advance();
        // trim quotes and add token with value
        this.addToken(TokenType.STRING, {
            value: this.source.slice(this.start + 1, this.current - 1),
        });
    }

    /**
     * Scans for the complete floating point number and saves its token (including the value) to the collection of tokens
     */
    private number() {
        while (isDigit(this.peek())) this.advance();

        // check for fractional part once digits end and skip it, if found
        if (this.peek() === '.' && isDigit(this.peek(2))) {
            this.advance();
            while (isDigit(this.peek())) this.advance();
        }

        this.addToken(TokenType.NUMBER, {
            value: parseFloat(this.source.slice(this.start, this.current + 1)),
        });
    }

    /**
     * Scans for the whole identifier, determines if it is a reserved keyword, and stores the correct token for it
     */
    private identifier() {
        while (isAlphaNumeric(this.peek())) this.advance();

        const text = this.source.slice(this.start, this.current);
        const tokenType = Keywords[text] || TokenType.IDENTIFIER;
        this.addToken(tokenType);
    }
}
