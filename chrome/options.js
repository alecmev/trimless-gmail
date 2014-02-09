var tmpItems = null;

function save() {
    chrome.storage.sync.set(tmpItems);
}

function initialize() {
    $('#color-enabled').change(function() {
        tmpItems['trimless-color-enabled'] = this.checked;
    });
    $('#color-enabled').prop('checked', tmpItems['trimless-color-enabled']);

    $('#color-input').spectrum({
        color: tmpItems['trimless-color-value'],
        flat: true,
        showButtons: false,
        showInput: true,
        change: function(color) {
            tmpItems['trimless-color-value'] =
                color.toHexString().toUpperCase();
            tmpItems['trimless-color-border'] =
                tinycolor.lighten(color, 27).toHexString().toUpperCase();
            $('#color-value').text(tmpItems['trimless-color-value']);
            $('#color-value').css('color', tmpItems['trimless-color-value']);
        }
    });

    $('#indentation-enabled').change(function() {
        tmpItems['trimless-indentation-enabled'] = this.checked;
    });
    $('#indentation-enabled').prop(
        'checked', tmpItems['trimless-indentation-enabled']
    );

    $('#indentation-input').change(function() {
        tmpItems['trimless-indentation-value'] = $(this).val();
        $('#indentation-value').text(tmpItems['trimless-indentation-value']);
    });
    $('#indentation-input').val(tmpItems['trimless-indentation-value']);
    $('#indentation-input').change();

    $('#reset').click(function() {
        $('#color-enabled').prop('checked', true);
        $('#color-enabled').change();
        $('#color-input').spectrum('set', '#888888');

        $('#indentation-enabled').prop('checked', true);
        $('#indentation-enabled').change();
        $('#indentation-input').val(32);
        $('#indentation-input').change();
    });
}

chrome.storage.sync.get(null, function(items) {
    tmpItems = items;
    $(window).blur(save);
    $(window).unload(save);
    $(document).bind('webkitvisibilitychange', save);
    $(initialize);
});
