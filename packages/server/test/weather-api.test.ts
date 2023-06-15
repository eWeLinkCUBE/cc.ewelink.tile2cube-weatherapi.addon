import process from 'node:process';
import { weatherApiClient } from '../src/modules/weather-api';

// Test command: cd packages/server && npx ts-node -r dotenv/config test/weather-api.test.ts
async function test() {
    weatherApiClient.setRequestKey(process.env.TEST_WEATHER_API_KEY as string);
    await weatherApiClient.requestJsonData('search.json', { q: 'shen' });
}

test();
