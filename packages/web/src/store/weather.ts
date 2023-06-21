import { defineStore } from 'pinia';
import api from '@/api/Weather/index';
import _ from 'lodash';
import router from '@/router';
import moment from 'moment';
import type { ITokenInfo ,IFormState } from '@/api/ts/interface/IWeatherInfo';

interface IWeatherState {
    /** token信息 */
    tokenInfo: ITokenInfo;
    /** 保存的配置信息 */
    weatherInfo: IFormState;
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

        /** 设置配置信息 */
        setWeatherInfo(weatherInfo: IFormState) {
            this.weatherInfo = weatherInfo;
        },

        /** 设置token信息 */
        setTokenInfo(info:ITokenInfo){
            this.tokenInfo = info;
            console.log('------------------>',this.tokenInfo);
        }
    },
    getters: {
        countdownStatus(state){
            const seconds = moment(moment()).diff(moment(state.tokenInfo.requestTokenTime), 'seconds');
            console.log('second------------>', seconds);
            return seconds >= 300 || state.tokenInfo.cubeTokenValid ? false : true;
        }
    },
    persist: true,
});
