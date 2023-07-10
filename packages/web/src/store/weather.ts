import { defineStore } from 'pinia';
import api from '@/api/Weather/index';
import _ from 'lodash';
import router from '@/router';
import moment from 'moment';
import { emitter } from '@/main';
import type { ITokenInfo ,IFormState ,IForeCastResultInfo} from '@/api/ts/interface/IWeatherInfo';

interface IWeatherState {
    /** token info */
    tokenInfo: ITokenInfo;
    /** saved token info */
    weatherInfo: IFormState;
    /** wether foreCast info */
    foreCastInfo:IForeCastResultInfo;
}

export const useWeatherStore = defineStore('weather', {
    state: (): IWeatherState => {
        return {
            weatherInfo: {
                weather:{
                    weatherApiKey: '',
                    cityData: undefined,
                    tempUnit: undefined,
                }
            },
            tokenInfo: {
                requestTokenTime: 0,
                cubeTokenValid: false,
            },
            foreCastInfo:{
                forecastData:{
                    alerts: {},
                    current: {},
                    forecast: {},
                    location: {},
                },
                updateTime:0
            }
        };
    },
    actions: {
        /** get token info */
        async getTokenInfo(){
            const res = await api.GetTokenInfo();
            if(res.data && res.error ===0){
                this.tokenInfo = res.data;
                const seconds = moment(moment()).diff(moment(res.data.requestTokenTime), 'seconds');
                if(seconds>=0 && seconds<=300 && !res.data.cubeTokenValid){
                    emitter.emit('cutdown', seconds);
                }
            }else{
                this.tokenInfo.cubeTokenValid = false;
            }
            return res;
        },

        /** get weather data */
        async getForeCastInfo(){
            const res = await api.getForeCastInfo({days:5});
            if(res.error === 0 && res.data){
                this.foreCastInfo = res.data;
                // console.log('foreCastInfo--------------->', res.data);
            }
            return res;
        },

        /** set weather info */
        setWeatherInfo(weatherInfo: IFormState) {
            this.weatherInfo = weatherInfo;
        },

        /** set token info */
        setTokenInfo(info:ITokenInfo){
            this.tokenInfo = info;
        },
    },
    getters: {
        countdownStatus(state){
            const seconds = moment(moment()).diff(moment(state.tokenInfo.requestTokenTime), 'seconds');
            return seconds >= 300 || state.tokenInfo.cubeTokenValid ? false : true;
        }
    },
    persist: true,
});
