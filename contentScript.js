let isEnabled;

// Initialize extension state
chrome.storage.local.get(null).then(items => {
    isEnabled = items['trimless-enabled'];
});

const untrimTimer = new (function() {
    this.again = 0;
    this.isTicking = false;

    this.more = function() {
        if (!isEnabled) {
            ununtrim();
            return;
        }
        if (untrimTimer.again < 4) {
            ++untrimTimer.again;
        }
        if (!untrimTimer.isTicking) {
            untrimTimer.again = 2;
            untrimTimer.isTicking = true;
            untrimTimer.stuff();
        }
    }

    this.stuff = function() {
        if (!isEnabled) {
            ununtrim();
            untrimTimer.again = 0;
            untrimTimer.isTicking = false;
            return;
        }
        if (untrimTimer.again) {
            --untrimTimer.again;
            setTimeout(() => untrimTimer.stuff(), 1000);
        }
        else {
            untrimTimer.isTicking = false;
        }
        untrim();
    }
})();

let untrimReplies = false;

async function applyOptions() {
    const options = await chrome.storage.sync.get(null);
    applyOptionsInterface(options);
    untrimReplies = options['trimless-reply-enabled'];
    untrimTimer.more();
}

function untrim() {
    const ad = function(what) {
        const tmpad = $(this);
        if (!tmpad.text().trim().length) {
            tmpad.hide().removeClass(what).addClass('trimless-' + what);
        }
    };

    // "View entire message"
    $(".iX > a").each(function() {
        const tmpvem = $(this);
        $.get(this.href, function(data) {
            tmpvem.parents().eq(1).html($('font[size=-1]', data).last().html());
        });
    });

    applyOptions();
    $('.adP').removeClass('adP').addClass('trimless-adP');
    $('.adO').removeClass('adO').addClass('trimless-adO');
    $('.adL > .im, .adL.im').add(
        $('.h5').removeClass('h5').addClass('im').addClass('trimless-h5')
    ).addClass('trimless-content');
    $('.ajU, .ajV, .adm').hide().addClass('trimless-button');
    $('.adL').each(function() { ad.apply(this, ['adL']); });
    $('.adM').each(function() { ad.apply(this, ['adM']); });

    if (untrimReplies) {
        // Otherwise the main textarea steals the focus
        $('.ajR[style="user-select: none;"]').click(function(e) {
            e.stopPropagation();
        });
        // Harder to undo, since this part isn't read-only
        $('.ajR[style="user-select: none;"] > .uC').click();
    }

    const tmpah1 = $('.et .aH1');
    if (tmpah1.is(':visible')) {
        tmpah1.click();
        const tmpextra = $('.editable > .gmail_extra');
        if (!tmpextra.prev('br').length) {
            tmpextra.prepend('<br />');
        }
    }
}

function ununtrim() {
    const ad = function(what) {
        const tmpad = $(this);
        if (!tmpad.text().trim().length) {
            tmpad.removeClass('trimless-' + what).addClass(what).show();
        }
    }

    $('.trimless-adM').each(function() { ad.apply(this, ['adM']); });
    $('.trimless-adL').each(function() { ad.apply(this, ['adL']); });
    $('.trimless-button').removeClass('trimless-button').show();
    $('.trimless-content').removeClass('trimless-content');
    $('.trimless-h5').removeClass('trimless-h5')
        .removeClass('im').addClass('h5');
    $('.trimless-adO').removeClass('trimless-adO').addClass('adO');
    $('.trimless-adP').removeClass('trimless-adP').addClass('adP');
}

function untrimOnClick(event) {
    if (isEnabled && !$(event.target).is('.aH1')) {
        untrimTimer.more();
    }
}

function applyOptionsInterface(options) {
    if (!document.getElementById('trimless-style')) {
        $('head').append('<style id="trimless-style"></style>');
    }

    let trimlessStyle = '';

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

// Initialize
untrimTimer.more();
$(window).on('hashchange', untrimTimer.more);
$(document).on('click', untrimOnClick);
$(window).on('load', untrimTimer.more);
$(applyOptions);

document.addEventListener('visibilitychange', untrimTimer.more);

// Handle extension messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    sendResponse({ trimless: true });
    return true;
});

// Handle storage changes
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync') {
        applyOptions();
        return;
    }

    if (changes['trimless-enabled']) {
        isEnabled = changes['trimless-enabled'].newValue;
        chrome.runtime.sendMessage(isEnabled);
        if (isEnabled) {
            untrimTimer.more();
        } else {
            ununtrim();
        }
    }
});
