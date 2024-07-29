import http from 'k6/http';
import { BASE_URL, user, contact } from '../config/config.js';

export function login() {
    const url = `${BASE_URL}/users/login`;
    const payload = JSON.stringify(user);
    const params = { headers: { 'Content-Type': 'application/json' } };
    return http.post(url, payload, params);
}

export function addContact(token, contact) {
    const url = `${BASE_URL}/contacts`;
    const payload = JSON.stringify(contact);
    const params = { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } };
    return http.post(url, payload, params);
}

export function getContact(token, contactId) {
    const url = `${BASE_URL}/contacts/${contactId}`;
    const params = { headers: { 'Authorization': `Bearer ${token}` } };
    return http.get(url, params);
}

export function getContacts(token) {
    const url = `${BASE_URL}/contacts`;
    const params = {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    };
    return http.get(url, params);
}

export function updateContact(token, contactId, contact) {
    const url = `${BASE_URL}/contacts/${contactId}`;
    const payload = JSON.stringify(contact);
    const params = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
    return http.put(url, payload, params);
}

export function deleteContact(token, contactId) {
    const url = `${BASE_URL}/contacts/${contactId}`;
    const params = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    return http.del(url, null, params);
}