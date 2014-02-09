currentTimeout = null;
tryAgain = 0;

function untrim() {
    console.log('UNTRIM');
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

    if (tryAgain) {
        --tryAgain;
        currentTimeout = window.setTimeout(untrim, 1000);
    }
    else {
        currentTimeout = null;
    }
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
        if (currentTimeout) {
            if (tryAgain < 4) {
                ++tryAgain;
            }
        }
        else {
            tryAgain = 2;
            untrim();
        }
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