/**
 * Represents a single column in a collection's structure
 */
export class Column {
    /**
     * Unique key for the column
     */
    key: string;
    /**
     * Type of data stored in column
     */
    type: string;
    /**
     * Boolean value indicating if the column requires
     */
    required: boolean;

    constructor(key: string, value: string, required: boolean) {
        this.key = key;
        this.type = value;
        this.required = required;
    }
}