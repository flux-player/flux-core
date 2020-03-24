import Structure from "./structure";
import {env} from "../config/configuration"
import {getAppDataDirectory} from "../files/directory";

export default abstract class Collection {
    /**
     * Collection constructor
     */
    constructor() {
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

        this._filename = btoa(this.name);
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

    load() {

    }

    persist() {

    }

    private _isLoaded = false;
    private _autoPersist = false;
    private _storageDirectory = "";
    /**
     * The name of the collection
     */
    private _name: string;

    /**
     * The structure of the collection (kinda like the schema in a database)
     */
    private _structure: Structure;
}