import process from 'node:process';
import path from 'node:path';
import Keyv from 'keyv';
import { KeyvFile } from 'keyv-file';
import { logger } from '../../logger';

const DATA_PATH = process.env.CONFIG_DATA_PATH as string;
const CUBE_TOKEN_FILE_NAME = 'cube-token.json';
const FULLPATH = path.join(DATA_PATH, CUBE_TOKEN_FILE_NAME);

/**
 * eWeLink cube data interface
 *
 * @param token token data string
 * @param requestTokenTime last request token timestamp
 */
interface CubeTokenData {
    token?: string;
    requestTokenTime?: number;
}

class CubeTokenStore {
    private _store;

    private readonly _key = 'cubeToken';

    constructor() {
        this._store = new Keyv({
            store: new KeyvFile({
                filename: FULLPATH
            })
        });
    }

    /** Set cube token data. */
    async setCubeToken(tokenData: CubeTokenData) {
        logger.debug(`(mod.local-store.cube-token) setCubeToken() tokenData: ${JSON.stringify(tokenData)}`);
        const oldTokenData = await this.getCubeToken();
        if (!oldTokenData) {
            await this._store.set(this._key, tokenData);
        } else {
            if (tokenData.token) {
                oldTokenData.token = tokenData.token;
            }
            if (tokenData.requestTokenTime) {
                oldTokenData.requestTokenTime = tokenData.requestTokenTime;
            }
            await this._store.set(this._key, oldTokenData);
        }
    }

    /** Get cube token data. */
    async getCubeToken(): Promise<CubeTokenData | undefined> {
        const res = await this._store.get(this._key);
        logger.debug(`(mod.local-store.cube-token) getCubeToken() res: ${JSON.stringify(res)}`);
        return res;
    }
}

export const cubeTokenStore = new CubeTokenStore();
