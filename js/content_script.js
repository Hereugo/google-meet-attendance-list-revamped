// Entry point
(async () => {
    Utils.onReady(
        ".crqnQb",
        ".c8mVDd",
        initialize,
    );
})();

function initialize() {
    if (document.querySelector("#gmal__app")) {
        return;
    }

    ["js/utils.js", "js/inject.js"].forEach((filePath) => {
        let s = document.createElement("script");
        s.src = chrome.runtime.getURL(filePath);
        document.documentElement.appendChild(s);
    });

    setupDOM();
}

window.addEventListener("message", (event) => {
    if (event.origin !== "https://meet.google.com") {
        return;
    }

    switch(event.data.sender) {
        case "inject-message": {
            console.log(event.data.participants);
        }
    }
});
