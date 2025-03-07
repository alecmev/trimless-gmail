// Color utility function
function lightenHexColor(hex, percent) {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Convert to RGB
    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);
    
    // Lighten
    r = Math.min(255, Math.round(r + (255 - r) * (percent / 100)));
    g = Math.min(255, Math.round(g + (255 - g) * (percent / 100)));
    b = Math.min(255, Math.round(b + (255 - b) * (percent / 100)));
    
    // Convert back to hex
    const toHex = (n) => {
        const hex = n.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

// Initialize storage with default values
async function initializeStorage() {
    try {
        const local = await chrome.storage.local.get(null);
        if (!local.hasOwnProperty('trimless-enabled')) {
            await chrome.storage.local.set({ 'trimless-enabled': true });
        }

        const sync = await chrome.storage.sync.get(null);
        if (!sync.hasOwnProperty('trimless-color-enabled')) {
            const baseColor = '#888888';
            await chrome.storage.sync.set({
                'trimless-color-enabled': true,
                'trimless-color-value': baseColor,
                'trimless-color-border': lightenHexColor(baseColor, 27),
                'trimless-indentation-enabled': true,
                'trimless-indentation-value': 32,
                'trimless-reply-enabled': false
            });
        }
    } catch (error) {
        console.error('Error initializing storage:', error);
    }
}

// Update the extension icon
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

// Handle tab updates
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

// Handle icon clicks
chrome.action.onClicked.addListener((tab) => {
    chrome.storage.local.get(null).then(items => {
        const newState = !items['trimless-enabled'];
        chrome.storage.local.set({ 'trimless-enabled': newState }).then(() => {
            updateIcon(tab.id, newState);
        });
    });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((isEnabled, sender) => {
    updateIcon(sender.tab.id, isEnabled);
    // Use setTimeout for multiple updates to ensure icon state is consistent
    setTimeout(() => updateIcon(sender.tab.id, isEnabled), 100);
    setTimeout(() => updateIcon(sender.tab.id, isEnabled), 200);
});

// Initialize service worker
self.addEventListener('install', (event) => {
    event.waitUntil(initializeStorage());
});

self.addEventListener('activate', (event) => {
    event.waitUntil(Promise.resolve()); // Ensure service worker activation
});
