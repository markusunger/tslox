/**
 * Checks if the character is an alphabetical one
 * (= characters allowed for the beginning of an identifier or keyword)
 */
export function isAlpha(char: string) {
    return /[a-zA-Z_]/.test(char);
}
