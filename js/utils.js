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

    static addChild(
        parent,
        tag,
        id = null,
        className = null,
        textContent = null,
        attrs = null,
        props = null,
    ) {
        const el = Utils.createElement(tag, id, className, textContent, attrs, props);
        parent.appendChild(el);
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

    /** Array to CSV 
    * Source: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
    */
    static arrayToCSV(arr) {
        return arr.map((row) =>
            row
            .map(String)  // Convert every value to a string
            .map(v => v.replaceAll('"', '""'))  // escape double quotes
            .map(v => `"${v}"`)  // quote it
            .join(",")  // comma-seperated
        ).join("\r\n");  // row starting on new lines
    }
    
    /** Download contents as a file
    * Source: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
    */
    static downloadBlob(content, filename, contentType) {
        // Create a blob
        var blob = new Blob([content], { type: contentType });
        var url = URL.createObjectURL(blob);
        
        // Create a link to download it
        var pom = document.createElement('a');
        pom.href = url;
        pom.setAttribute('download', filename);
        pom.click();
    }
}
