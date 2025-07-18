chrome.runtime.onInstalled.addListener(async details => {
    if (details.reason !== 'install') return;

    const local = await chrome.storage.local.get(null);
    if (!local.hasOwnProperty('trimless-enabled')) {
        await chrome.storage.local.set({ 'trimless-enabled': true });
    }

    const sync = await chrome.storage.sync.get(null);
    if (!sync.hasOwnProperty('trimless-color-enabled')) {
        await chrome.storage.sync.set({
            'trimless-color-enabled': true,
            'trimless-color-value': '#888888',
            'trimless-color-border': '#a8a8a8', // 27-lighten of above
            'trimless-indentation-enabled': true,
            'trimless-indentation-value': 32,
            'trimless-reply-enabled': false
        });
    }
});

function updateIcon(tabId, isEnabled) {
    chrome.action.setIcon({
        tabId: tabId,
        path: {
            '19': `images/icon-action${isEnabled ? '' : '-gray'}-19.png`,
            '38': `images/icon-action${isEnabled ? '' : '-gray'}-38.png`
        }
    });
    chrome.action.setTitle({
        tabId: tabId,
        title: isEnabled ? 'Trimless is enabled' : 'Trimless is disabled'
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.tabs.sendMessage(tabId, true).then(data => {
            if (data?.trimless) {
                chrome.storage.local.get(null).then(items => {
                    updateIcon(tabId, items['trimless-enabled']);
                });
            }
        }).catch(() => {
            // Ignore errors when content script is not ready
        });
    }
});

chrome.action.onClicked.addListener((tab) => {
    chrome.storage.local.get(null).then(items => {
        const newState = !items['trimless-enabled'];
        void chrome.storage.local.set({ 'trimless-enabled': newState });
        updateIcon(tab.id, newState);
    });
});

chrome.runtime.onMessage.addListener((isEnabled, sender) => {
    updateIcon(sender.tab.id, isEnabled);
    setTimeout(() => updateIcon(sender.tab.id, isEnabled), 100);
    setTimeout(() => updateIcon(sender.tab.id, isEnabled), 200);
});
