var isEnabled;

chrome.storage.local.get(null, function(items) {
    isEnabled = items['trimless-enabled'];
});

function applyOptions() {
    chrome.storage.sync.get(null, function(options) {
        applyOptionsInterface(options);
    });
}

@@THEREST@@

$(document).bind('webkitvisibilitychange', untrimTimer.more);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    sendResponse({ trimless: true });
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
    if ('sync' == areaName) {
        applyOptions();
        return;
    }

    isEnabled = changes['trimless-enabled'].newValue;
    chrome.runtime.sendMessage(isEnabled);
    if (isEnabled) {
        untrimTimer.more();
    }
    else {
        ununtrim();
    }
});
