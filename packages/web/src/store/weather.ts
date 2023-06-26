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
    /** 是否改变了城市 */
    isChangeCity:boolean,
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
            isChangeCity:false,
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
        },

        /** 修改了城市 */
        setIsChangeCity(isChange:boolean){
            this.isChangeCity = isChange;
        }
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
