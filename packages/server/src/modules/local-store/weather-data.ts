import process from 'node:process';
import path from 'node:path';
import Keyv from 'keyv';
import { KeyvFile } from 'keyv-file';
import { logger } from '../../logger';

const DATA_PATH = process.env.CONFIG_DATA_PATH as string;
const WEATHER_DATA_CONFIG_FILE_NAME = 'weather-data.json';
const FULLPATH = path.join(DATA_PATH, WEATHER_DATA_CONFIG_FILE_NAME);

/**
 * Weather data interface
 *
 * @param updateTime Weather data update timestamp
 * @param forecastData Weather API forecast data
 */
interface WeatherData {
    updateTime?: number;
    forecastData?: any;
}

class WeatherDataStore {
    private _store;

    private _key = 'weatherData';

    constructor() {
        this._store = new Keyv({
            store: new KeyvFile({
                filename: FULLPATH
            })
        });
    }

    async setWeatherData(weatherData: WeatherData) {
        logger.debug(`(mod.local-store.weather-data) setWeatherData() weatherData: ${JSON.stringify(weatherData)}`);
        const oldData = await this.getWeatherData();
        if (!oldData) {
            await this._store.set(this._key, weatherData);
        } else {
            if (weatherData.updateTime) {
                oldData.updateTime = weatherData.updateTime;
            }

            if (weatherData.forecastData) {
                oldData.forecastData = weatherData.forecastData;
            }

            await this._store.set(this._key, oldData);
        }
    }

    async getWeatherData(): Promise<WeatherData | undefined> {
        const res = await this._store.get(this._key);
        logger.debug(`(mod.local-store.weather-data) getWeatherData() res: ${JSON.stringify(res)}`);
        return res;
    }
}

export const weatherDataStore = new WeatherDataStore();
