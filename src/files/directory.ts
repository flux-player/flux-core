import {join} from "path"
import {readDir, stat, hasAnyExtension} from "../extensions/file";

/**
 * Walks the given directory, and it's subdirectories and find
 * @param directory The directory to check
 * @param extensions The extension to match
 *
 * @param fileList **recursive calls variable*8
 */
export const walk = async (directory: string, extensions: string[] = [], fileList: string[] = []) => {
    const files = await readDir(directory);

    for (const file of files) {
        const details = await stat(join(directory, file));
        if (details.isDirectory()) fileList = await walk(join(directory, file), extensions, fileList);
        else {
            if (extensions === null || hasAnyExtension(file, extensions)) {
                fileList.push(join(directory, file));
            }
        }
    }

    return fileList;
};