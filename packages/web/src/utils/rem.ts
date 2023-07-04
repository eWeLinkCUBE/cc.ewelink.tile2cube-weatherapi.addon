// 基准大小
let baseSize = 68;//58;

// 设置 rem 函数
export function setRem() {
    // 大于1024 即进入平板时恢复到初始基准大小
    if (document.documentElement.clientWidth >= 960) {
        document.documentElement.style.fontSize = `${baseSize}px`;
        return;
    }

    // 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
    const scale = document.documentElement.clientWidth / 750;
    // 设置页面根节点字体大小, Math.min(scale,2)表示最大缩放比例为2
    document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + "px";
}

// 初始化
setRem();
// 改变窗口大小时重新设置 rem
window.addEventListener('resize', () => setRem());
