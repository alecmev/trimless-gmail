if (!('trimless-enabled' in localStorage)) {
    localStorage['trimless-enabled'] = true;
}

var isEnabled = localStorage['trimless-enabled'];
var options = null;

function applyOptions()
{
    if (options === null) {
        return;
    }

    if (!document.getElementById('trimless-style')) {
        $('head').append('<style id=\'trimless-style\'></style>');
    }

    var trimlessStyle = '';

    if (options['trimless-color-enabled']) {
        trimlessStyle +=
            '.trimless-color {' +
                'color: ' + options['trimless-color-value'] + 
                    ' !important;' +
                'border-color: ' + tinycolor.lighten(
                        tinycolor(options['trimless-color-value']), 27
                    ).toHexString().toUpperCase() +
                    ' !important;' +
            '}';
    }

    if (options['trimless-indentation-enabled']) {
        trimlessStyle +=
            '.trimless-indentation {' +
                'padding-left: ' + options['trimless-indentation-value'] + 
                    'px !important;' +
            '}';
    }

    $('#trimless-style').html(trimlessStyle);
}

@@THEREST@@

self.port.on('toggle', function(message)
{
    isEnabled = JSON.parse(message);
    localStorage['trimless-enabled'] = isEnabled;
    if (isEnabled) {
        untrim();
    }
    else {
        ununtrim();
    }
});

self.on('detach', function()
{
    ununtrim();
});

self.port.on('options', function(message)
{
    options = message;
    applyOptions();
});
