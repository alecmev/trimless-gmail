chrome.storage.local.get(null, function(items) {
    if (!items.hasOwnProperty('trimless-enabled')) {
        items['trimless-enabled'] = true;
        chrome.storage.local.set(items);
    }
});

chrome.storage.sync.get(null, function(items) {
    if (!items.hasOwnProperty('trimless-color-enabled')) {
        items['trimless-color-enabled'] = true;
        items['trimless-color-value'] = '#888888';
        items['trimless-color-border'] = (
            tinycolor(items['trimless-color-value'])
                .lighten(27)
                .toHexString()
                .toUpperCase()
        );
        items['trimless-indentation-enabled'] = true;
        items['trimless-indentation-value'] = 32;
        items['trimless-reply-enabled'] = false;
        chrome.storage.sync.set(items);
    }
});

function updateIcon(tabId, isEnabled) {
    chrome.pageAction.setIcon({ tabId: tabId, path: {
        '19': 'images/icon-action' + (isEnabled ? '' : '-gray') + '-19.png',
        '38': 'images/icon-action' + (isEnabled ? '' : '-gray') + '-38.png'
    }});
    chrome.pageAction.setTitle({ tabId: tabId, 
        title: (isEnabled ? 'Trimless is enabled' : 'Trimless is disabled')
    });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.tabs.sendMessage(tabId, true, function(data) {
        if (data !== undefined && data.hasOwnProperty('trimless')) {
            chrome.pageAction.show(tabId);
            chrome.storage.local.get(null, function(items) {
                updateIcon(tabId, items['trimless-enabled']);
            });
        }
    });
});

chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.storage.local.get(null, function(items) {
        items['trimless-enabled'] = !items['trimless-enabled'];
        chrome.storage.local.set(items);
        updateIcon(tab.id, items['trimless-enabled']);
    });
});

chrome.runtime.onMessage.addListener(function(isEnabled, sender, sendResponse) {
    updateIcon(sender.tab.id, isEnabled);
    window.setTimeout(function() {
        updateIcon(sender.tab.id, isEnabled);
    }, 100);
    window.setTimeout(function() {
        updateIcon(sender.tab.id, isEnabled);
    }, 200);
});
