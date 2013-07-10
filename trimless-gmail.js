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

function untrim()
{
    $('.adL, .adM, .h5, .h4').filter("[display!='block']")
        .css('display', 'block').addClass('trimless-block');
    $('.ajR').not(':hidden').hide().addClass('trimless-button1')
        .children('.aH1').click().addClass('trimless-button2');
    $('.adm, .ajU, .ajV').hide().addClass('trimless-button3');

    style();
}

function ununtrim()
{
    $('.trimless-block').removeAttr('style');
    $('.trimless-button1').show();
    $('.trimless-button2').click();
    $('.trimless-button3').show();

    unstyle();
}

function style()
{
    $('.adL > .im, .gmail_quote, .h5, blockquote > div')
        .addClass('trimless-padding trimless-color').find('*')
        .addClass('trimless-color').removeClass('trimless-padding');
}

function unstyle()
{
    $('.trimless-padding, .trimless-color')
        .removeClass('trimless-padding').removeClass('trimless-color');
}

function untrimForSure()
{
    checkStorage(false);
    if (isEnabled) {
        untrim();
        window.setTimeout(untrim, 1000);
        window.setTimeout(untrim, 2000);
    }
    else
        ununtrim();
}

function untrimOnClick(event)
{
    if (isEnabled) {
        if (!$(event.target).is('.aH1'))
            untrimForSure();
    }
}

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

untrimForSure();
$(window).bind('hashchange', untrimForSure);
$(document).bind('webkitvisibilitychange', untrimForSure);
$(document).click(untrimOnClick);
$(window).load(untrimForSure);
