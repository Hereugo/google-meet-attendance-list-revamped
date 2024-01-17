class Utils {
    static log(message) {
        console.log(
            `%c[A4GM]%c ${message} `,
            'color:white;background:#058D80',
            'font-weight:bold;color:#058D80;'
        );
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static runOnReady(targetParent = '', target = '', callback = ()=>{}, options = {}) {
        new MutationObserver((mutations, me) => {
            if (document.querySelector(target)) {
                callback(mutations, me);
                me.disconnect();
            }
        }).observe(document.querySelector(targetParent), {
            childList: true,
            subtree: true,
            ...options
        });
    }
}