import {Column} from "./column";

/**
 * Defines the structure of a collection
 */
export default class Structure {
    get columns(): Column[] {
        return this._columns;
    }

    set columns(value: Column[]) {
        this._columns = value;
    }

    /**
     * The columns making up the collection structure
     */
    private _columns: Column[] = [];
}