function untrim()
{
    $('.ajT').parent().parent().remove();
    $('.adL, .adL > div, .h5, .adM').css('display', 'block');
}

function untrimForSure()
{
    untrim();
    window.setTimeout(untrim, 1000);
    window.setTimeout(untrim, 2000);
}

function initialize()
{
    untrimForSure();

    var styleSheets = document.styleSheets;
    var containers = ['.im', '.gmail_quote', '.h5'];

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

$(window).load(initialize);
$(window).bind('hashchange', untrimForSure);
$(document).click(untrimForSure);
