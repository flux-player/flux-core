import { join } from "path";
import Structure from "./structure";
import { matchArray } from "searchjs";
import { env } from "../config/configuration";
import { getAppDataDirectory } from "../files/directory";
import { getCollectionAsJSON } from "../utilities/collections";
import { ensureFilePathExists, readFile, writeFile } from "../extensions/file";
import { bufferToString, stripIllegalCharacters, randomString } from "../utilities/text";

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
  private _data: any[] = [];

  // Getter for collection data
  get data(): any[] {
    return this._data;
  }

  // Setter for collection data
  set data(value: any[]) {
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
  protected init() {
    if (!this._name) throw new Error("A collection should have a name");
    if (!this._structure)
      throw new Error("No structure has been defined for this collection");

    this._filename = join(
      this._storageDirectory,
      `${stripIllegalCharacters(
        Buffer.from(this.name).toString("base64")
      )}.json`
    );
  }

  /**
   * Sets the default configuration for the collection
   */
  private setDefaultConfiguration() {
    this._autoPersist = env("PERSIST_MODE") === "auto";
    this._storageDirectory =
      env("PERSIST_DIRECTORY") ?? getAppDataDirectory("FluxCollections");
  }

  /**
   * Push a data row to the collection
   *
   * @param row
   * @todo More explicit type annotations for things we're not too sure about
   */
  push(row: any | Array<any>) {
    if (!row) return;

    if (Array.isArray(row)) {
      // Recursively push each and every one of the rows
      row.forEach(single => {
        this.push(single);
      });

      return;
    }

    // Validate the input row
    let issues: string[] = this.validate(row);

    // Throw an exception is there are any issues
    if (issues.length) {
      throw new Error(issues.join(" | "));
    }

    // Push the data row to the internal collection
    this.data.push(Object.assign(this.getBlankSchemaObject(), row));

    // Persist the collection
    if(this._autoPersist) {
        this.persist();
    }
  }

  /**
   * Validates the row being inserted against the rules
   * 
   * @param row The row being inserted
   * @param issues Colection of issues
   */
  private validate(row: any): string[] {
    // Instatiate issues collection
    let issues: string[] = [];

    // Iterate over row's keys and validate each of them
    Object.keys(row).forEach(key => {
      let column = this.structure.columns.find(column => column.key === key);

      // Validating whether the collection structure has the specified key
      if (!column) {
        return issues.push(
          `The column '${key}' is not defined on collection structure`
        );
      }

      // If the key is required to have a value, validating whether is actually has a value
      if (column.required && !row[key]) {
        return issues.push(`The column '${key}' is required to have a value.`);
      }

      // If the key is required to have a specific type. Validating that the value is of that type
      let type = typeof row[key];
      if (column.type !== type && type !== "undefined") {
        return issues.push(
          `The column '${key}' should have data of the type '${type}'`
        );
      }
    });

    return this.validateMissing(row, issues);
  }

  /**
   * Validates any missing required columns in the input row
   * 
   * @param row The row being inserted
   * @param issues Colection of issues
   */
  private validateMissing(row: any, issues: string[]): string[] {
    this.structure.columns
      .filter(column => {
        if (!column.required) return;
        return row.hasOwnProperty(column.key);
      })
      .forEach(column => {
        issues.push(
          `The column '${column.key}' is required but was not given a value`
        );
      });

    return issues;
  }

  /**
   * Run a query against the collection
   * 
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
    if (!this._filename)
      throw new Error(
        "No filename has been specified. Did you initialize the collection"
      );
    if (!exists) return await this.persist();

    try {
      // Read the collection's data
      const data = await readFile(this._filename);

      // Parse JSON string to an object
      let object = JSON.parse(bufferToString(data));
      

      this._isLoaded = true;
    } catch (error) {
      this.load(false);
    }
  }

  /**
   * Initial persist of the collection
   */
  async persist() {
    // Get this collection's representation as a JSON string
    let output = getCollectionAsJSON(this);

    // Ensure the directory we're writing to exists
    await ensureFilePathExists(this._storageDirectory);

    // Write a file
    await writeFile(this._filename, output);
  }

  /**
   * Get a blank object representing the schema of the collection
   */
  private getBlankSchemaObject() {
    let output: any = {
      uid: randomString(32)
    };

    this.structure.columns.forEach((column) => {
      output[column.key] = null;
    });

    return output;
  }
}
