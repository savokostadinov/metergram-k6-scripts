import { login, getContacts, updateContact, getContact } from '../utils/httpUtil.js';
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

    const getContactsRes = getContacts(token);

    check(getContactsRes, {
        'contacts succesfully readed': (ctsRes) => ctsRes.status === 200,
    });

    const cont = getContactsRes.json();

    if (cont.length > 0) {

        const contactId = cont[3]._id;
        console.log(`Contact ID: ${contactId}`);

        const getContactRes = getContact(token, contactId);

        check(getContactRes, {
            'contact successfully retrieved': (cResR) => cResR.status === 200,
        });

        const existingContact = getContactRes.json();
        const updatedContact = Object.assign({}, existingContact, { firstName: "John", lastName: "Lennon" });

        const updateContactRes = updateContact(token, contactId, updatedContact);

        check(updateContactRes, {
            'contact updated successfully': (cRes) => cRes.status === 200,
        });

        const verifyContactRes = getContact(token, contactId);

        check(verifyContactRes, {
            'contact succesfully readed': (cResR) => cResR.status === 200,
            'contact data matching: first name - updated': (cRes) => cRes.json().firstName === updatedContact.firstName,
            'contact data matching: last name - updated': (cRes) => cRes.json().lastName === updatedContact.lastName,
            'contact data matching: email': (cRes) => cRes.json().email === contact.email,
            'contact data matching: city': (cRes) => cRes.json().city === contact.city
        });


    } else {
        console.log('No contacts found to update.');
    }

    sleep(1);

};