if (!('trimless-enabled' in localStorage)) {
    localStorage['trimless-enabled'] = true;
}

var isEnabled = localStorage['trimless-enabled'];
var options = null;

function applyOptions() {
    if (options === null) {
        return;
    }

    options['trimless-color-border'] = 
        tinycolor.lighten(tinycolor(options['trimless-color-value']), 27)
            .toHexString().toUpperCase();
    applyOptionsInterface(options);
}

@@THEREST@@

$(document).bind((
    typeof document.hidden !== 'undefined' ?
        'visibilitychange' : 'mozvisibilitychange'
    ), untrimForSure
);

self.port.on('toggle', function(message) {
    isEnabled = JSON.parse(message);
    localStorage['trimless-enabled'] = isEnabled;
    if (isEnabled) {
        untrim();
    }
    else {
        ununtrim();
    }
});

self.on('detach', function() {
    ununtrim();
});

self.port.on('options', function(message) {
    options = message;
    applyOptions();
});
