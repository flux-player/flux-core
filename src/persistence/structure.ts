import {Column} from "./column";

/**
 * Defines the structure of a collection
 */
export default interface Structure {

    /**
     * The columns making up the collection structure
     */
    columns: Column[]
}