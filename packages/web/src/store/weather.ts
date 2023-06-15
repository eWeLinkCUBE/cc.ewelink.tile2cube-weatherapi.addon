import { defineStore } from 'pinia';
import api from '../api';
import _ from 'lodash';
import router from '@/router';
import moment from 'moment';

interface IWeatherState {
    weatherInfo:string,
}

export const useWeatherStore = defineStore('weather', {
    state: (): IWeatherState => {
        return {
            weatherInfo:'',
        };
    },
    actions: {
        setWeatherInfo(weatherInfo:string){
            this.weatherInfo = weatherInfo;
        },
    },
    getters: {

    },
    persist: true,
});
