import Structure from "./structure";

export default abstract class Collection {
    name: string;

    structure: Structure;

    /**
     * Run a query against the collection
     * @param query
     */
    query(query: Object) {

    }

    private _isLoaded = false;
}