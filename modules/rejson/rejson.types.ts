/**
 * The get command additional parameters
 * @param indent Sets the indentation string for nested levels
 * @param newline Sets the string that's printed at the end of each line
 * @param space Sets the string that's put between a key and a value 
 * @param noescape Will disable the sending of \uXXXX escapes for non-ascii characters
 */
export type ReJSONGetParameters = {
    indent?: string,
    newline?: string,
    space?: string,
    noescape?: boolean,
}