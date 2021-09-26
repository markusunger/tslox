import { TSLox } from './TSLox';

// initialize TSLox and pass arguments to its main method (except for the [ts-]node invocation itself)
new TSLox().main(...process.argv.slice(2));
