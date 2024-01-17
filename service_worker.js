chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({
        url: 'demo/index.html'
    });
});

// Watch for changes to the user's options & apply them
chrome.storage.onChanged.addListener(async (changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        const tabs = await chrome.tabs.query({ url: 'https://meet.google.com/**-**-**' });
        for (let tab of tabs) {
            console.log(tab.url);
            await chrome.tabs.sendMessage(tab.id, { type: `${key}-changed` });
        }
    }
});
