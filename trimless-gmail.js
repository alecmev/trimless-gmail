function untrim()
{
    $('.ajV, .ajU').click().remove();
    $('.im').css('cssText', 'color: ' + $('.hx').css('color') + ' !important');
}

function untrimForSure()
{
    untrim();
    window.setTimeout(untrim, 1000);
}

$(window).bind('hashchange', untrimForSure);
untrimForSure();
