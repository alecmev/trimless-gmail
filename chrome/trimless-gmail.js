var isEnabled;

chrome.storage.local.get(null, function(items)
{
    isEnabled = items['trimless-enabled'];
});

function applyOptions()
{
    if (!document.getElementById('trimless-style')) {
        $('head').append('<style id=\'trimless-style\'></style>');
    }

    chrome.storage.sync.get(null, function(items)
    {
        var trimlessStyle = '';

        if (items['trimless-color-enabled']) {
            trimlessStyle +=
                '.trimless-color {' +
                    'color: ' + items['trimless-color-value'] + 
                        ' !important;' +
                    'border-color: ' + items['trimless-color-border'] +
                        ' !important;' +
                '}';
        }

        if (items['trimless-indentation-enabled']) {
            trimlessStyle +=
                '.trimless-indentation {' +
                    'padding-left: ' + items['trimless-indentation-value'] + 
                        'px !important;' +
                '}';
        }

        $('#trimless-style').html(trimlessStyle);
    });
}

@@THEREST@@

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse)
{
    sendResponse({ trimless: true });
});

chrome.storage.onChanged.addListener(function(changes, areaName)
{
    if ('sync' == areaName) {
        applyOptions();
        return;
    }

    isEnabled = changes['trimless-enabled'].newValue;
    chrome.runtime.sendMessage(isEnabled);
    if (isEnabled) {
        untrimForSure();
    }
    else {
        ununtrim();
    }
});
