// Entry point
(async () => {
    Utils.runOnReady(
        '.crqnQb',
        '.c8mVDd',
        initialize,
    );
})();

function initialize() {
    ['js/utils.js', 'js/inject.js'].forEach((filePath) => {
        let s = document.createElement('script');
        s.src = chrome.runtime.getURL(filePath);
        document.documentElement.appendChild(s);
    });
}

window.addEventListener('message', (event) => {
    if (event.origin !== 'https://meet.google.com') {
        return;
    }

    switch(event.data.sender) {
        case 'inject-message': {
            Utils.log('Received message from inject');
            console.log(event.data.participants);
        }
    }
});
