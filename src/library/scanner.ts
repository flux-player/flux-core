import { env, walk, readFileAsArrayBuffer } from "@flux/utils";
import { Song } from "..";
import { read } from "../audio/metadata/id3";
import { createSongFromTags } from "../utils/audio";

export class MediaScanner {
    /**
     * The directories to scan media files in
     */
    watchlist: Array<string>;

    /**
     * Create a new instance of the MediaScanner class
     * @param watchlist The directories to scan media files in
     */
    constructor(watchlist: Array<string> = []) {
        this.watchlist = watchlist;

        if (env("FLUX_SCAN_MODE", "manual") !== "auto") return;

        // Watch the watchlist for changes and add the new items to the library
        this.watch();
    }

    public async scan(): Promise<Array<Song>> {
        if (!this.watchlist.length) [];

        // Temporary store
        let filelist: string[] = [];

        // Iterate over out watch list
        for (let i = 0; i < this.watchlist.length; i++) {
            let directory = this.watchlist[i];

            // Walk the directories and get all files matching the specified pattern
            let files = await walk(directory, [".mp3"]);

            // Push the master list
            filelist.push(...files);
        }

        return this.bulkReadMediaDetails(filelist);
    }

    /**
     * Read the details for the specified tracks
     *
     * @param filelist The list of files to read
     */
    private async bulkReadMediaDetails(filelist: string[]): Promise<Song[]> {
        let songs: Song[] = [];

        filelist.forEach(async (file) => {
            let details = await read(await readFileAsArrayBuffer(file));

            songs.push(createSongFromTags(details, file));
        });

        return songs;
    }

    /**
     * Watches directories in the watchlist for changes and if there are any new media files, add them to the
     * media library
     */
    private watch() {
        throw new Error("Method not implemented.");
    }
}
