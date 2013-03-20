var styleSheets = document.styleSheets;
var containers = ['.im', '.gmail_quote', '.h5'];
var uet;

function untrim()
{
    $('.adL, .adM, .h5, .h4').css('display', 'block'); // possibly '.adL > div'
    $('.adm, .ajU, .ajV').remove();
}

function untrimForSure()
{
    untrim();
    window.setTimeout(untrim, 1000);
    window.setTimeout(untrim, 2000);
    resetColor();
}

function untrimOnClick(event)
{
    if (!$(event.target).is('.aH1'))
        untrimForSure();
}

function resetColor()
{
    for (var i = 0; i < styleSheets.length; i++)
    {
        var rules = styleSheets[i].cssRules || styleSheets[i].rules;

        for (var j = 0; j < rules.length; j++)
        {
            for (var k = 0; k < containers.length; k++)
            {
                if (rules[j].selectorText === containers[k])
                    rules[j].style.color = '#222';
            }
        }
    }
}

untrimForSure();
$(window).bind('hashchange', untrimForSure);
$(document).click(untrimOnClick);
$(window).load(untrimForSure);

$(document).on('DOMSubtreeModified', 'div.Am.aO9.Al.editable.LW-avf', function()
{
    var target = $('div.Am.aO9.Al.editable.LW-avf');

    if (target.hasClass('initialized4')) // not simply unbinding, because there can be other instances
        return;

    if (uet == null)
        uet = $('input[name=uet]').val();

    var overwrite = function()
    {
        if (target.html() == '' || target.html() == '<br>')
        {
            target.html(uet);
            console.log('invoked');
        }
    }

    if (!target.hasClass('initialized1'))
        target.addClass('initialized1');

    else if (!target.hasClass('initialized2'))
        target.addClass('initialized2');

    else if (!target.hasClass('initialized3'))
    {
        target.addClass('initialized3');
        overwrite();
    }

    else if (!target.hasClass('initialized4'))
    {
        target.addClass('initialized4');
        overwrite();
    }
});
