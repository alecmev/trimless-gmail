// Copyright © 2013 Olegs Jeremejevs <olegs@jeremejevs.com>
// This work is free. You can redistribute it and/or modify it under the
// terms of the Do What The Fuck You Want To Public License, Version 2,
// as published by Sam Hocevar. See the COPYING file for more details.

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
