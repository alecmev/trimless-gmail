if (!('trimless-enabled' in localStorage))
    localStorage['trimless-enabled'] = true;

var isEnabled;
checkStorage(true);

function checkStorage(isFirstTime)
{
    var oldValue = isEnabled;
    isEnabled = JSON.parse(localStorage['trimless-enabled']);
    if (!isFirstTime && oldValue != isEnabled)
        chrome.runtime.sendMessage(isEnabled);
}

@@THEREST@@

chrome.runtime.onMessage.addListener(function(isCheck, sender, sendResponse)
{
    if (isCheck)
        sendResponse({ isEnabled: isEnabled });
    else {
        isEnabled = !isEnabled;
        localStorage['trimless-enabled'] = isEnabled;
        if (isEnabled)
            untrim();
        else
            ununtrim();

        sendResponse(isEnabled);
    }
});
