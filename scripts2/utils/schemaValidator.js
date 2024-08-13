// utils/schemaValidator.js
import { check } from 'k6';

// utils/schemaValidator.js

export function validateSchema(data, schema) {
    function validateObject(obj, objSchema) {
        for (const key in objSchema.properties) {
            if (objSchema.required.includes(key)) {
                if (!(key in obj)) {
                    console.error(`Missing required property: ${key}`);
                    return false;
                }
            }
            if (objSchema.properties[key].type && typeof obj[key] !== objSchema.properties[key].type) {
                console.error(`Invalid type for property: ${key}. Expected ${objSchema.properties[key].type}, got ${typeof obj[key]}`);
                return false;
            }
        }
        return true;
    }

    if (schema.type === 'array') {
        if (!Array.isArray(data)) {
            console.error(`Invalid type. Expected array, got ${typeof data}`);
            return false;
        }
        for (const item of data) {
            if (!validateObject(item, schema.items)) {
                return false;
            }
        }
    } else if (schema.type === 'object') {
        if (typeof data !== 'object' || Array.isArray(data)) {
            console.error(`Invalid type. Expected object, got ${typeof data}`);
            return false;
        }
        if (!validateObject(data, schema)) {
            return false;
        }
    }

    return true;
}
