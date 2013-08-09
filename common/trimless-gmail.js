function untrim()
{
    if (!isEnabled) {
        return;
    }

    $('.adL, .adM, .h5, .h4').not('.ajR').filter("[display!='block']")
        .css('display', 'block').addClass('trimless-block');
    $('.ajR:visible').hide().addClass('trimless-button1')
        .children('.aH1').click().addClass('trimless-button2');
    $('.adm, .ajU, .ajV').hide().addClass('trimless-button3');

    style();
}

function ununtrim()
{
    unstyle();

    $('.trimless-button3').show();
    $('.trimless-button2').click();
    $('.trimless-button1').show();
    $('.trimless-block').removeAttr('style');
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
    @@CHECK@@
    if (isEnabled) {
        untrim();
        window.setTimeout(function() {
            untrim();
        }, 1000);
        window.setTimeout(function() {
            untrim();
        }, 2000);
    }
    else {
        ununtrim();
    }
}

function untrimOnClick(event)
{
    if (isEnabled) {
        if (!$(event.target).is('.aH1')) {
            untrimForSure();
        }
    }
}

untrimForSure();
$(window).bind('hashchange', untrimForSure);
$(document).bind('webkitvisibilitychange', untrimForSure);
$(document).click(untrimOnClick);
$(window).load(untrimForSure);