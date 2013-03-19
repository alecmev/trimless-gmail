// Copyright © 2013 Olegs Jeremejevs <olegs@jeremejevs.com>
// This work is free. You can redistribute it and/or modify it under the
// terms of the Do What The Fuck You Want To Public License, Version 2,
// as published by Sam Hocevar. See the COPYING file for more details.

function untrim()
{
    $('.ajV, .ajU, .aH1').click().remove();
    $('.im').css('cssText', 'color: ' + $('.hx').css('color') + ' !important');
    
    var firstLineBreak = $('.im > .gmail_extra > br:first-child:not(.leave-alone)');

    if (firstLineBreak.length > 0)
    {
        firstLineBreak.next('br').addClass('leave-alone');
        firstLineBreak.remove();
    }
}

function untrimForSure()
{
    untrim();
    window.setTimeout(untrim, 1000);
}

function untrimNotSure(event)
{
    if (!$(event.target).is('.ajV, .ajU, .aH1'))
        untrimForSure();
}

$(window).bind('hashchange', untrimForSure);
$(document).click(untrimNotSure);
untrimForSure();
