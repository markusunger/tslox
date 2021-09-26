# TSLox

A tree-walk interpreter for the Lox language, written in TypeScript

[CraftingInterpreters.com](https://www.craftinginterpreters.com)

## What?

Following the first section of the aforementioned book, this repository implements a [tree-walk interpreter](https://craftinginterpreters.com/a-tree-walk-interpreter.html) of the [Lox language](https://craftinginterpreters.com/the-lox-language.html).

## Why?

The example code in the book is written in Java. I was too lazy to set up and learn the basics of Java, so I decided to implement the interpreter using the language I'm currently most comfortable with: TypeScript.

## How?

-   Use `npm run tslox` or `npm run tslox:dev` for a REPL  
    (The former compiles through `tsc` and executes the resulting JS, the latter directly compiles/executes with `ts-node`)
-   Use `npm run tslox <source-file>` or `npm run tslox:dev <source-file>` for executing code from a source file

Currently, this implementation will lexically analyze the code input through the REPL and output the tokens that it scanned. That's all. Eventually, it will create a proper syntax tree, parse it and execute the program.
