// Entry point
(async () => {
    Utils.onReady(
        ".crqnQb",
        ".c8mVDd",
        initialize,
    );

    console.log("Hello");
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

    if (Utils.storageAvailable("sessionStorage")) {
        populateStorage();
    } else {
        alert("Session storage is not available");
        // TODO Figure out another way to handle storage
    }
}

function populateStorage() {
    sessionStorage.setItem("participants", []);

    
}

window.addEventListener("message", (event) => {
    if (event.origin !== "https://meet.google.com") {
        return;
    }

    switch(event.data.sender) {
        case "inject-message": {
            console.log(event.data.participants);

            sessionStorage.setItem(
                "participants",
                JSON.stringify(event.data.participants)
            );
        }
    }
});
