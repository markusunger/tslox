import { TokenType } from './TokenType';

export interface Literal {
    value: string | number | boolean | null;
}

/**
 * A lexical token
 */
export class Token {
    type: TokenType;
    lexeme: string;
    literal?: Record<any, any>;
    line: number;

    constructor(type: TokenType, lexeme: string, literal: Literal | undefined, line: number) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }
}
