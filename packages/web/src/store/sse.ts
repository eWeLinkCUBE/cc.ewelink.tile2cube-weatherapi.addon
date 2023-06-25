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

            source.addEventListener('get_cube_token_start', async (event: any) => {
                console.log('get_cube_token_start------------>',JSON.parse(event.data));
                const weatherStore = useWeatherStore();
                await weatherStore.getTokenInfo();
                // const tokenInfo = JSON.parse(event.data) as ITokenInfo;
                // tokenInfo.cubeTokenValid = false;
                // weatherStore.setTokenInfo(tokenInfo);
            });

            source.addEventListener('get_cube_token_end', async (event: any) => {
                console.log('get_cube_token_end------------>',JSON.parse(event));
                const weatherStore = useWeatherStore();
                await weatherStore.getTokenInfo();
            });

            /** SSE失败 */
            source.addEventListener('error',(event: any) => {
                console.log('SSE connect error, reboot');
                setTimeout(()=>{
                    this.startSse();
                },10000)
            });
        },
    },
    persist: true,
});
