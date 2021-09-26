/**
 * Checks if the character is an alphanumerical one
 * (= every character allowed from the second position of an identifier onward)
 */
export function isAlphaNumeric(char: string) {
    return /\w/.test(char);
}
