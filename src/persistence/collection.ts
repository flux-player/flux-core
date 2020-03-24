import Structure from "./structure";
import dotenv from "dotenv"

export default abstract class Collection {
    name: string;

    structure: Structure;

    constructor() {
        this.setDefaultConfiguration();
    }

    setDefaultConfiguration() {
        this._autoPersist = process.env.PERSIST_MODE === 'auto';
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
}