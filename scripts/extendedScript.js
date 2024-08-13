import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend} from 'k6/metrics';
import { SharedArray } from 'k6/data';

//Custom metrics

const resposeTimeTrend = new Trend('response_time'); // tracks response times
const failedChecksCounter = new Counter('failed_checks'); // counts failed checks
const successRate = new Rate('success_rate'); //tracks the success rate of checks

//Shared data array

const urls = new SharedArray('URLs', function(){
    return ['https://httpbin.test.k6.io/get', 'https://httpbin.test.k6.io/status/200', 'https://httpbin.test.k6.io/status/404']
});

//Environment variables

const BASE_URL = __ENV.BASE_URL || 'https://httpbin.test.k6.io';

//Options configuration using scenarios
export let options = {
    thresholds: {
        'http_req_duration{status:200}' : ['p(95)<500'], // 95% of successful requests should complete within 500ms
        'success_rate' : ['rate>0.95'], //Custom rate metric should be greater than 95%
    },
    tags: { environment: __ENV.ENVIRONMENT || 'development'}, // Tag with environment
    scenarios: {
        ramping_scenario: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                {duration: '10s', target: 50},
                {duration: '20s', target: 100},
                {duration: '30s', target: 150},
                {duration: '10s', target: 150},
                {duration: '10s', target: 0},
            ],
            gracefulRampDown: '10s',
        },
    },
};

//Setup function

export function setup(){
    console.log('Setup: Initializing test environment.');
    //Simulate setting cookies
    http.get(`${BASE_URL}/cookies/set?foo=bar`);
}

//Teardown function
export function teardown(data){
    console.log('Teardown: Cleaning up test environment.');
    //Simulate clearing cookies
    http.get(`${BASE_URL}/cookies/delete?foo`);
}

//The default function that runs for each virtual user
export default function(){
    group('Get URLs', function(){
        urls.forEach(url => {
            const response = http.get(url);

            const checlRes = check(response, {
                'is status 200' : (r) => r.status === 200,
                'response time < 500ms': (r) => r.timings.duration < 500,
            });

            if(!checlRes){
                failedChecksCounter.add(1); // Increment the custom counter for failed checks
                successRate.add(false); // Record a failure in the custom rate metric
            } else {
                successRate.add(true); // Record a success in the custom rate metric
            }

            resposeTimeTrend.add(response.timings.duration); // Record the response time in the custom trend metric
            console.log(`Response time for ${url}: ${response.timings.duration} ms`);
        });
    });

    sleep(1);
}
