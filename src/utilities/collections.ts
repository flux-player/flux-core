import Collection from "../persistence/collection";

export const getCollectionAsJSON = (collection: Collection): string => {
    let output = {
        name: collection.name,
        structure: [] as { key: string, required: boolean, type: string }[],
        data: []
    };

    for (let column of collection.structure.columns) {
        output.structure.push({
            "key": column.key,
            "required": column.required,
            "type": column.type
        });
    }

    return JSON.stringify(output);
};
