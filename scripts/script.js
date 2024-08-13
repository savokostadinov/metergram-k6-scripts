import http from 'k6/http'
import {check, sleep} from 'k6'
import {Trend} from 'k6/metrics'


export let options = {
    stages: [
        {duration: '10s', target: 2 },
        {duration: '20s', target: 5 },
        {duration: '30s', target: 10 },
        {duration: '10s', target: 10 },
        {duration: '10s', target: 0 },
    ],
    executor: "shared-iterations",
    thresholds: {
        'http_req_duration{status:200}':['p(95)<500'],
    },
};

export default function (){
    const url = 'https://google.com/';

    const response = http.get(url);

    check(response, {
        'is status 200': (r) => r.status === 200,
    });

    console.log(`Response time for ${url}: ${response.timings.duration} ms`);

    sleep(1);
}