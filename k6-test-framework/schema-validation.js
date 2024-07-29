import { expect, chai } from 'https://jslib.k6.io/k6chaijs/4.3.4.0/index.js';
import { initContractPlugin } from 'https://jslib.k6.io/k6chaijs-contracts/4.3.4.0/index.js';
import { contactSchema } from './schemas/contact-schema.js';
import { userSchema } from './schemas/user-schema.js';
import { tokenSchema } from './schemas/token-schema.js';
import { login, getContacts } from './utils/httpUtil.js';

initContractPlugin(chai);

export default function () {
    const loginResponse = login();
    const loginData = loginResponse.json();

    console.log(JSON.stringify(loginData, null, 2));

    expect(loginData.user, "Login schema validation.").to.matchSchema(userSchema);

    const token = loginData.token;

    console.log(JSON.stringify(token, null, 2));


    expect(loginData.token, "Token schema validation.").to.matchSchema(tokenSchema);

    const contactsResponse = getContacts(token);
    const contactsData = contactsResponse.json();

    console.log(JSON.stringify(contactsData, null, 2));

    contactsData.forEach(contact => {
        expect(contact, "Contact schema validation.").to.matchSchema(contactSchema);
    });
}