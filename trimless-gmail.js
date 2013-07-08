function untrim()
{
    $('.adL, .adM, .h5, .h4').css('display', 'block');
    $('.ajR').not(':hidden').children('.aH1').click();
    $('.adm, .ajU, .ajV').remove();
}

function untrimForSure()
{
    untrim();
    window.setTimeout(untrim, 1000);
    window.setTimeout(untrim, 2000);
    styleUntrimmed();
}

function untrimOnClick(event)
{
    if (!$(event.target).is('.aH1'))
        untrimForSure();
}

function styleUntrimmed()
{
    $('.adL > .im, .gmail_quote, .h5, blockquote > div')
        .addClass('trimless-padding trimless-color')
        .find('*').addClass('trimless-color');
}

untrimForSure();
$(window).bind('hashchange', untrimForSure);
$(document).click(untrimOnClick);
$(window).load(untrimForSure);
