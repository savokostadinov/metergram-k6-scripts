// utils/utils.js
import http from 'k6/http';
import { check } from 'k6';

export function get(url, params = {}) {
    const response = http.get(url, params);
    check(response, {
        'status is 200': (r) => r.status === 200,
    });
    return response;
}
