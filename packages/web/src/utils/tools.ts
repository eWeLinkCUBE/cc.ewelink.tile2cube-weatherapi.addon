import router from '@/router';
import i18n from '@/i18n';
import { message } from 'ant-design-vue';
/**
 *
 * 根据路径获取assets文件夹内的文件（主要用于图片）
 * @date 29/05/2023
 * @export
 * @param {string} url
 * @returns {*}
 */
 export function getAssetsFile(url: string) {
    return new URL(`../assets/${url}`, import.meta.url).href
};

/**
 *
 * ip校验（link IP）
 * @date 30/05/2023
 * @export
 * @param {string} ip
 * @returns {*}
 */
export function checkIpValid(ipAddress:string){
    const reg = new RegExp(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/);
    if (!reg.test(ipAddress)) {
        return false;
    }
    return true;
}

/**
 *
 * 睡眠函数
 * @date 01/06/2023
 * @param {number} time
 */
export function sleep(time: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(1);
        }, time)
    })
}
