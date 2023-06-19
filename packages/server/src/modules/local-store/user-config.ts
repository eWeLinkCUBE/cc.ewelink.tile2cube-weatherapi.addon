import process from 'node:process';
import path from 'node:path';
import Keyv from 'keyv';
import { KeyvFile } from 'keyv-file';
import { logger } from '../../logger';

const DATA_PATH = process.env.CONFIG_DATA_PATH as string;
const USER_CONFIG_FILE_NAME = 'user-config.json';
const FULLPATH = path.join(DATA_PATH, USER_CONFIG_FILE_NAME);

/**
 * User config data interface
 *
 * @param weatherApiKey Weather API key
 * @param cityName User city name
 * @param tempUnit Temperature unit
 */
interface UserConfigData {
    weatherApiKey?: string;
    cityName?: string;
    tempUnit?: string;
}

class UserConfigStore {
    private _store;

    private readonly _key = 'userConfig';

    constructor() {
        this._store = new Keyv({
            store: new KeyvFile({
                filename: FULLPATH
            })
        });
    }

    /** Set user config data */
    async setUserConfigData(userConfigData: UserConfigData) {
        logger.debug(`(mod.local-store.user-config) setUserConfigData() userConfigData: ${JSON.stringify(userConfigData)}`);
        const oldData = await this.getUserConfigData();
        if (!oldData) {
            await this._store.set(this._key, userConfigData);
        } else {
            if (userConfigData.weatherApiKey) {
                oldData.weatherApiKey = userConfigData.weatherApiKey;
            }

            if (userConfigData.cityName) {
                oldData.cityName = userConfigData.cityName;
            }

            if (userConfigData.tempUnit) {
                oldData.tempUnit = userConfigData.tempUnit;
            }

            await this._store.set(this._key, oldData);
        }
    }

    /** Get user config data */
    async getUserConfigData(): Promise<UserConfigData | undefined> {
        const res = await this._store.get(this._key);
        logger.debug(`(mod.local-store.user-config) getUserConfigData() res: ${JSON.stringify(res)}`);
        return res;
    }
}

export const userConfigStore = new UserConfigStore();