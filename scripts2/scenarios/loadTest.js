// scenarios/loadTest.js

import { group, sleep } from 'k6';
import { BASE_URL, API_URL } from '../config/config.js';
import { get } from '../utils/utils.js';
import { validateSchema } from '../utils/schemaValidator.js';
import { contactSchema } from '../test_data/schemas.js';

export let options = {
    stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 10 },
        { duration: '30s', target: 0 },
    ],
};

export default function () {
    group('Get Contacts', function () {
        const response = get(`${API_URL}/contacts`);
        const contacts = JSON.parse(response.body);
        const isValid = validateSchema(contacts, contactSchema);
        if (!isValid) {
            console.error('Schema validation failed.');
        }
        console.log(contacts);
    });

    sleep(1);
}
