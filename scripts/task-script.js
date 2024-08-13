import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend} from 'k6/metrics';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
        
export let options = {
    stages: [
      { duration: '10s', target: 10 },
      { duration: '20s', target: 10 }, 
      { duration: '30s', target: 0 },
    ],
    thresholds: {
        'http_req_duration{status:200}' : ['p(95)<500'], 
        'success_rate' : ['rate>0.95'],        
    },
  };
  
  const successfulRequests = new Counter('successful_requests');
  const successRate = new Rate('success_rate');




export default function () {
    // const registerResponse = http.post('https://reqres.in/api/register', {
    //      email: "eve.holt@reqres.in",
    //      password: "pistol"
    // });
    const response = http.get('https://reqres.in/api/users?page=5');
    const jar = http.cookieJar();
    jar.set('https://reqres.in', 'session_id', '1234567890abcdef', {
        domain: 'reqres.in',
        path: '/',
        secure: true,
        max_age: 3600,
    });

    const isSuccess = check(response, {
        'Register status is 200': (r) => r.status === 200,
        'response time < 200ms': (r) => r.timings.duration < 200,
    });

    if(isSuccess){
        successfulRequests.add(1);
    } else {
        successRate.add(false);
    }

    sleep(1);
}

export function handleSummary(data) {
    return {
        'stdout': textSummary(data, { indent: ' ', enableColors: true }), 
        'results.json': JSON.stringify(data), 
    };
}