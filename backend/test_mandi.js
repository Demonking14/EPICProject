import 'dotenv/config';
import { fetchMandiPrices } from './services/mandiService.js';

async function test() {
    console.log('Testing fetchMandiPrices...');
    try {
        const data = await fetchMandiPrices({ limit: 1 });
        console.log('Result:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    }
}

test();
