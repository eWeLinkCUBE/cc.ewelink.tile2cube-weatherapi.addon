/** Wait t ms. */
export function wait(t: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('done');
        }, t);
    });
}
