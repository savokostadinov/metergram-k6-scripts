import { login, addContact, getContact } from '../utils/httpUtil.js';
import { check, sleep } from 'k6';
import { contact } from '../config/config.js';
import { Rate } from 'k6/metrics';

const successRate = new Rate('success_rate'); //tracks the success rate of checks

export let options = {
    thresholds: {
        'http_req_duration{status:200}' : ['p(95)<500'],
        'success_rate' : ['rate>0.95'],
    },
};

export default function () {
    const loginResponse = login();

    check(loginResponse, {
        'logged in successfully': (lRes) => lRes.status === 200,
    });

    const token = loginResponse.json('token');
    console.log(token);

        const contactResponse = addContact(token, contact[0]);

        check(contactResponse, {
            'contact added successfully': (cRes) => cRes.status === 201,
        });

        const contactId = contactResponse.json('_id');
        console.log(contactId);
        const getContactRes = getContact(token, contactId);

        check(getContactRes, {
            'contact succesfully readed': (cResR) => cResR.status === 200,
            'contact data matching: first name': (cRes) => cRes.json().firstName === contact[0].firstName,
            'contact data matching: last name': (cRes) => cRes.json().lastName === contact[0].lastName,
            'contact data matching: email': (cRes) => cRes.json().email === contact[0].email,
            'contact data matching: city': (cRes) => cRes.json().city === contact[0].city
        });

        sleep(1);
};
