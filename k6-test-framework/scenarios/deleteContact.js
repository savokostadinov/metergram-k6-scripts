import { login, getContacts, getContact, deleteContact } from '../utils/httpUtil.js';
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
            const contactId = cont[0]._id;
            const deleteContactRes = deleteContact(token, contactId);
            console.log(`Contact ID: ${contactId}`);

            check(deleteContactRes, {
                'contact deleted successfully': (cRes) => cRes.status === 200,
            });

            const getContactAfterDeleteRes = getContact(token, contactId);

            check(getContactAfterDeleteRes, {
                'contact no longer exists': (res) => res.status === 404,
            });
        
    } else {
        console.log('No contacts fount for deleting');
    }
}