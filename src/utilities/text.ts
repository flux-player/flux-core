import {randomBytes} from "crypto"

/**
 * Generate a random string with the specified length
 *
 * @param length
 */
export const randomString = (length: number): string => {
    return randomBytes(length).toString('hex');
};

/**
 * Removes path-illegal characters from a filename
 *
 * @param filename
 */
export const stripIllegalCharacters = (filename: string): string => filename.replace(/[/\\?%*:|"<>]/g, '-');