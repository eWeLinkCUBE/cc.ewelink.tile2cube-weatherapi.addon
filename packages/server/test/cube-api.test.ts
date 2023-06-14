import { cubeApiClient } from '../src/modules/cube-api';

// Test command: npx ts-node -r dotenv/config test/cube-api.test.ts
async function test() {
    await cubeApiClient.getBridgeToken();
}

test();
