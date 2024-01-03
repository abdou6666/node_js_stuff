import axios from 'axios';
import { stringify } from 'querystring';


// this style of caching helps is usefull concurrent requests from client side to the same resource
const cache = new Map();

const requests = Array.from({ length: 1000 }).map((_, i) => ({
    query: { q: i % 2 === 1 ? 1 : 2 },
}));

const END_POINT = 'http://localhost:8080/test';
const result = [];

const forwardRequests = async () => {
    for (const { query } of requests) {
        const queryStr = stringify(query);
        const cachedPromise = cache.get(queryStr);
        if (cachedPromise) {
            const { data } = await cachedPromise;
            console.log({ data });
            result.push(data);
        } else {
            const url = `${END_POINT}?${queryStr}`;
            const promise = axios.get(url);
            cache.set(queryStr, promise);
            const { data } = await promise;
            console.log({ data });
            result.push(data);
        }
    }

    console.log(result.length, requests.length);
};

forwardRequests();