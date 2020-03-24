/**
 * Represents a single column in a collection's structure
 */
export class Column {
    constructor(key: string, value: string) {
        this.key = key;
        this.type = value;
    }

    /**
     * Unique key for the column
     */
    key: string;

    /**
     * Type of data stored in column
     */
    type: string
}