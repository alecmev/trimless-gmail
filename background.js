function updateIcon(tabId, isEnabled)
{
    chrome.pageAction.setIcon({ tabId: tabId, path: {
        '19': 'icon-action' + (isEnabled ? '' : '-gray') + '-19.png',
        '38': 'icon-action' + (isEnabled ? '' : '-gray') + '-38.png'
    }});
    chrome.pageAction.setTitle({ tabId: tabId, 
        title: (isEnabled ? 'Trimless is enabled' : 'Trimless is disabled')
    });
}

chrome.pageAction.onClicked.addListener(function(tab)
{
    chrome.tabs.sendMessage(tab.id, false, function(isEnabled)
    {
        updateIcon(tab.id, isEnabled);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
    chrome.tabs.sendMessage(tabId, true, function(data)
    {
        if (data != undefined && 'isEnabled' in data)
        {
            chrome.pageAction.show(tabId);
            updateIcon(tabId, data.isEnabled);
        }
    });
});

chrome.runtime.onMessage.addListener(function(isEnabled, sender, sendResponse)
{
    window.setTimeout(function() {
        updateIcon(sender.tab.id, isEnabled);
    }, 100);
    window.setTimeout(function() {
        updateIcon(sender.tab.id, isEnabled);
    }, 200);
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-40792111-3']);
_gaq.push(['_trackPageview']);
var ga = document.createElement('script');
ga.type = 'text/javascript';
ga.async = true;
ga.src = 'https://ssl.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(ga, s);
