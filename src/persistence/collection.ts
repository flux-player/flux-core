import {join} from "path"
import Structure from "./structure";
import {env} from "../config/configuration";
import {readFile} from "../extensions/file";
import {getAppDataDirectory} from "../files/directory";
import {stripIllegalCharacters, bufferToString} from "../utilities/text";


export default abstract class Collection {
    /**
     * Collection constructor
     */
    protected constructor() {
        // Set the defaults
        this.setDefaultConfiguration();
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get structure(): Structure {
        return this._structure;
    }

    set structure(value: Structure) {
        this._structure = value;
    }

    init() {
        if (!this._name) throw new Error("A collection should have a name");
        if (!this._structure) throw new Error("No structure has been defined for this collection");

        this._filename = join(this._storageDirectory, stripIllegalCharacters(Buffer.from(this.name).toString('base64')));
    }

    setDefaultConfiguration() {
        this._autoPersist = env('PERSIST_MODE') === 'auto';
        this._storageDirectory = env('PERSIST_DIRECTORY') ?? getAppDataDirectory('FluxCollections');
    }

    /**
     * Run a query against the collection
     * @param query
     */
    query(query: Object) {

    }

    async load(exists = true) {
        if (!this._filename) throw new Error("No filename has been specified. Did you initialize the collection");
        if(!exists) return this.save();

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
    save() {
        
    }

    persist() {

    }

    /**
     * Whether the collection has been loaded from the disk
     */
    private _isLoaded = false;

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
     * The name of the collection
     */
    protected _name: string = "";

    /**
     * The structure of the collection (kinda like the schema in a database)
     */
    protected _structure: Structure = new Structure([]);

    protected _data: [] = [];
}