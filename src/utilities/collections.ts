import Collection from "../persistence/collection";

export const getCollectionAsJSON = (collection: Collection) : string => {
    let output = Object.create({
        name: collection.name,
        structure: [],
        data: []
    });

    for(let column of collection.structure.columns) {
        output.structure.push({
            key: column.key,
            type: column.type
        });
    }

    return JSON.stringify(output);
};