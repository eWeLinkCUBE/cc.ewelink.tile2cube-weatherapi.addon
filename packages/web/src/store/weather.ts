import { defineStore } from 'pinia';
import api from '@/api/Weather/index';
import _ from 'lodash';
import router from '@/router';
import moment from 'moment';
import type { ITokenInfo ,IFormState ,IForeCastResultInfo} from '@/api/ts/interface/IWeatherInfo';

interface IWeatherState {
    /** token信息 */
    tokenInfo: ITokenInfo;
    /** 保存的配置信息 */
    weatherInfo: IFormState;
    /** 天气预报数据 */
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
        /** 获取token信息 */
        async getTokenInfo(){
            const res = await api.GetTokenInfo();
            if(res.error === 0 && res.data){
                this.tokenInfo = res.data;
            }else{
                this.tokenInfo.cubeTokenValid = false;
            }
            return res;
        },

        /** 获取天气预报数据 */
        async getForeCastInfo(){
            const res = await api.getForeCastInfo({days:5,refresh: '1'});
            if(res.error === 0 && res.data){
                this.foreCastInfo = res.data;
                console.log('foreCastInfo--------------->', res.data);
            }
            return res;
        },

        /** 设置配置信息 */
        setWeatherInfo(weatherInfo: IFormState) {
            this.weatherInfo = weatherInfo;
        },

        /** 设置token信息 */
        setTokenInfo(info:ITokenInfo){
            this.tokenInfo = info;
        },
    },
    getters: {
        countdownStatus(state){
            const seconds = moment(moment()).diff(moment(state.tokenInfo.requestTokenTime), 'seconds');
            console.log('getters second------------>', seconds);
            return seconds >= 300 || state.tokenInfo.cubeTokenValid ? false : true;
        }
    },
    persist: true,
});
