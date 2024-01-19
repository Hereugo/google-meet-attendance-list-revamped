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

    static storageAvailable(type) {
        let storage;
        try {
            storage = window[type];
            const x = "__storage_test__";
            storage.setItem(x, x);
            storage.removeItem(x);

            return true;
        } catch(e) {
            return (
                e instanceof DOMException &&
                // everything except Firefox
                (e.name == "QUOTA_EXCEEDED_ERR" ||
                    // Firefox
                    e.name == "NS_ERROR_DOM_QUOTA_REACHED") &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage &&
                storage.length !== 0
            );
        }
    }

    static createElement(
        tag,
        id = null,
        className = null,
        textContent = null,
        attrs = null,
        props = null,
    ) {
        const el = document.createElement(tag);
        if (id) el.id = id;
        if (className) el.className = className;
        if (textContent) el.innerHTML = textContent; //innerText
        if (attrs) {
          for (let key in attrs) el.setAttribute(key, attrs[key]);
        }
      
        if (props) for (let key in props) el[key] = props[key];
    
        return el;
    }

    static onReady(targetParent = '', target = '', callback = ()=>{}, options = {}) {
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