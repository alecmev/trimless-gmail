var styleSheets = document.styleSheets;
var containers = ['.im', '.gmail_quote', '.h5'];

function untrim()
{
    $('.adL, .adM, .h5, .h4').css('display', 'block'); // possibly '.adL > div'
    $('.ajR').not(':hidden').children('.aH1').click();
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
