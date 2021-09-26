/**
 * Checks if the character is a numerical one (= 0 up to 9)
 */
export function isDigit(char: string) {
    return /\d/.test(char);
}
