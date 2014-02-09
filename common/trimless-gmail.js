untrimTimer = new (function() {
    this.again = 0;
    this.isTicking = false;

    this.untrim = function() {
        if (!isEnabled) {
            untrimTimer.again = 0;
            untrimTimer.isTicking = false;
            return;
        }
        if (untrimTimer.again) {
            --untrimTimer.again;
            window.setTimeout(untrimTimer.untrim, 1000);
        }
        else {
            untrimTimer.isTicking = false;
        }
        untrim();
    }

    this.more = function() {
        if (!isEnabled) {
            untrimTimer.again = 0;
            untrimTimer.isTicking = false;
            return;
        }
        if (untrimTimer.again < 4) {
            ++untrimTimer.again;
        }
        if (!untrimTimer.isTicking) {
            untrimTimer.isTicking = true;
            ++untrimTimer.again;
            untrimTimer.untrim();
        }
    }
})();

function untrim() {
    if (!isEnabled) {
        return;
    }

    applyOptions();
    $('.adP').removeClass('adP').addClass('trimless-adP');
    $('.adO').removeClass('adO').addClass('trimless-adO');
    $('.adL > .im, .adL.im').add(
            $('.h5').removeClass('h5').addClass('im').addClass('trimless-h5')
        ).addClass('trimless-content');
    $('.ajU, .ajV, .adm').hide().addClass('trimless-button');
    $('.adL').each(function() {
        var tmpad = $(this);
        if (!tmpad.text().trim().length) {
            tmpad.hide().removeClass('adL').addClass('trimless-adL');
        }
    });
    $('.adM').each(function() {
        var tmpad = $(this);
        if (!tmpad.text().trim().length) {
            tmpad.hide().removeClass('adM').addClass('trimless-adM');
        }
    });
    $('.et .aH1').click();
    $('.editable:not(.trimless-br)').prepend('<br />').addClass('trimless-br');
}

function ununtrim() {
    $('.trimless-adM').each(function() {
        var tmpad = $(this);
        if (!tmpad.text().trim().length) {
            tmpad.removeClass('trimless-adM').addClass('adM').show();
        }
    });
    $('.trimless-adL').each(function() {
        var tmpad = $(this);
        if (!tmpad.text().trim().length) {
            tmpad.removeClass('trimless-adL').addClass('adL').show();
        }
    });
    $('.trimless-button').removeClass('trimless-button').show();
    $('.trimless-content').removeClass('trimless-content');
    $('.trimless-h5').removeClass('trimless-h5')
        .removeClass('im').addClass('h5');
    $('.trimless-adO').removeClass('trimless-adO').addClass('adO');
    $('.trimless-adP').removeClass('trimless-adP').addClass('adP');
}

function untrimForSure() {
    if (isEnabled) {
        untrimTimer.more();
    }
    else {
        ununtrim();
    }
}

function untrimOnClick(event) {
    if (isEnabled) {
        if (!$(event.target).is('.aH1')) {
            untrimForSure();
        }
    }
}

function applyOptionsInterface(options) {
    if (!document.getElementById('trimless-style')) {
        $('head').append('<style id=\'trimless-style\'></style>');
    }

    var trimlessStyle = '';

    if (options['trimless-color-enabled']) {
        trimlessStyle +=
            '.trimless-content, .trimless-content * {' +
                'color: ' + options['trimless-color-value'] + 
                    ' !important;' +
                'border-color: ' + options['trimless-color-border'] +
                    ' !important;' +
            '}';
    }

    if (options['trimless-indentation-enabled']) {
        trimlessStyle +=
            '.trimless-content {' +
                'padding-left: ' + options['trimless-indentation-value'] + 
                    'px !important;' +
            '}';
    }

    $('#trimless-style').html(trimlessStyle);
}

untrimForSure();
$(window).bind('hashchange', untrimForSure);
$(document).click(untrimOnClick);
$(window).load(untrimForSure);
$(applyOptions);