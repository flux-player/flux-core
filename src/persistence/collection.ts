import {join} from "path"
import Structure from "./structure";
import {env} from "../config/configuration";
import {matchArray} from "searchjs"
import {getAppDataDirectory} from "../files/directory";
import {getCollectionAsJSON} from "../utilities/collections";
import {bufferToString, stripIllegalCharacters} from "../utilities/text";
import {ensureFilePathExists, readFile, writeFile} from "../extensions/file";


export default abstract class Collection {
    /**
     * Boolean value indicating whether the collection automagically persists
     */
    protected _autoPersist = false;
    /**
     * Where to store the collection
     */
    protected _storageDirectory = "";
    /**
     * There actual name of the file that will be written to disk
     */
    protected _filename = "";
    /**
     * Whether the collection has been loaded from the disk
     */
    private _isLoaded = false;

    /**
     * Collection constructor
     */
    protected constructor() {
        // Set the defaults
        this.setDefaultConfiguration();
    }

    /**
     * The data in the collection
     */
    private _data: [] = [];

    // Getter for collection data
    get data(): [] {
        return this._data;
    }

    // Setter for collection data
    set data(value: []) {
        this._data = value;
    }

    /**
     * The name of the collection
     */
    protected _name: string = "";

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    /**
     * The structure of the collection (kinda like the schema in a database)
     */
    protected _structure: Structure = new Structure([]);

    // Getter for collection structure
    get structure(): Structure {
        return this._structure;
    }

    // Setter for structure
    set structure(value: Structure) {
        this._structure = value;
    }

    /**
     * Initializes a collection. Set the concrete collection filename and validate if structure and name are defined
     */
    init() {
        if (!this._name) throw new Error("A collection should have a name");
        if (!this._structure) throw new Error("No structure has been defined for this collection");

        this._filename = join(this._storageDirectory, `${stripIllegalCharacters(Buffer.from(this.name).toString('base64'))}.json`);
    }

    /**
     * Sets the default configuration for the collection
     */
    setDefaultConfiguration() {
        this._autoPersist = env('PERSIST_MODE') === 'auto';
        this._storageDirectory = env('PERSIST_DIRECTORY') ?? getAppDataDirectory('FluxCollections');
    }

    /**
     * Run a query against the collection
     * @param query
     */
    query(query: Object) {
        matchArray(this.data, query);
    }

    /**
     * Loads up the collection from the disk
     *
     * @param exists
     */
    async load(exists = true) {
        if (!this._filename) throw new Error("No filename has been specified. Did you initialize the collection");
        if (!exists) return await this.save();

        try {
            // Read the collection's data
            const data = await readFile(this._filename);

            // Parse JSON string to an object
            let object = JSON.parse(bufferToString(data));
        } catch (error) {
            this.load(false);
        }
    }

    /**
     * Initial persist of the collection
     */
    async save() {
        // Get this collection's representation as a JSON string
        let output = getCollectionAsJSON(this);

        // Ensure the directory we're writing to exists
        await ensureFilePathExists(this._storageDirectory);

        // Write a file
        await writeFile(this._filename, output);
    }

    persist() {

    }
}