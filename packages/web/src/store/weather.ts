import { defineStore } from 'pinia';
import api from '../api';
import _ from 'lodash';
import router from '@/router';
import moment from 'moment';

interface IDeviceState {

}

export const useWeatherStore = defineStore('weather', {
    state: (): IDeviceState => {
        return {

        };
    },
    actions: {

    },
    getters: {

    },
    persist: true,
});
