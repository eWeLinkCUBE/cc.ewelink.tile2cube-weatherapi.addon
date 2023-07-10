import { defineStore } from 'pinia';
import { sseUrl } from '@/config';
import { useEtcStore } from './etc';
import { message } from 'ant-design-vue';
import i18n from '@/i18n';
import api from '@/api/Weather/index';
import { useWeatherStore } from '@/store/weather';
import type {
    ITokenInfo,
} from '@/api/ts/interface/IWeatherInfo';
let source: null | EventSource = null;

interface ISseState {
    sseIsConnect: boolean;
}

export const useSseStore = defineStore('sse', {
    state: (): ISseState => {
        return {
            sseIsConnect: false,
        };
    },
    actions: {
        setSseIsConnect(state: boolean) {
            this.sseIsConnect = state;
        },

        async startSse() {
            console.log('start SSE');
            if (source) source.close();
            const timestamp = new Date().getTime();
            source = new EventSource(`${sseUrl}?id=${timestamp}`);
            source.addEventListener('open', () => {
                console.log('SSE connect success');
                this.sseIsConnect = true;
            });

            /** 开始获取token */
            source.addEventListener('get_cube_token_start', async (event: any) => {
                console.log('get_cube_token_start------------>',JSON.parse(event.data));
                const weatherStore = useWeatherStore();
                await weatherStore.getTokenInfo();
            });

            /** 获取token结束 */
            source.addEventListener('get_cube_token_end', async (event: any) => {
                console.log('get_cube_token_end------------>',JSON.parse(event.data));
                const weatherStore = useWeatherStore();
                await weatherStore.getTokenInfo();
            });

            /** 更改配置刷新天气 */
            source.addEventListener('user_config_updated', async (event: any) => {
                // console.log('user_config_updated------------>',JSON.parse(event.data));
                const weatherStore = useWeatherStore();
                await weatherStore.getForeCastInfo();
            });

            /** SSE失败 */
            source.addEventListener('error',(event: any) => {
                console.log('SSE connect error, reboot');
                setTimeout(()=>{
                    this.startSse();
                },10000)
            });
        },
        closeSse(){
            if(!source)return;
            source.close();
        }
    },
    persist: true,
});
