var tmpItems = null;

function save() {
  chrome.storage.sync.set(tmpItems, () => {
    $('#status').text('Saved!');
    setTimeout(() => $('#status').text(''), 2000);
  });
}

function updateColorValue() {
  $('#color-value').text(tmpItems['trimless-color-value']);
  $('#color-value').css('color', tmpItems['trimless-color-value']);
}

function handleColorChange(color) {
  tmpItems['trimless-color-value'] =
    color.toHexString().toUpperCase();
  tmpItems['trimless-color-border'] =
    color.lighten(27).toHexString().toUpperCase();
  updateColorValue();
}

function handleIntentationChange(e) {
  tmpItems['trimless-indentation-value'] = e.target.value;
  $('#indentation-value').text(tmpItems['trimless-indentation-value']);
}

function initialize() {
  $('#color-enabled').on('change', function() {
    tmpItems['trimless-color-enabled'] = this.checked;
  });
  $('#color-enabled').prop('checked', tmpItems['trimless-color-enabled']);

  updateColorValue();

  $('#color-input').spectrum({
    color: tmpItems['trimless-color-value'],
    flat: true,
    showButtons: false,
    showInput: true,
    preferredFormat: 'hex',
    change: handleColorChange,
    move: handleColorChange
  });

  $('#indentation-enabled').on('change', function() {
    tmpItems['trimless-indentation-enabled'] = this.checked;
  });
  $('#indentation-enabled').prop(
    'checked', tmpItems['trimless-indentation-enabled']
  );

  $('#indentation-input').on('change', handleIntentationChange);
  $('#indentation-input').on('input change', handleIntentationChange);
  $('#indentation-input').val(tmpItems['trimless-indentation-value']);
  $('#indentation-input').trigger('change');

  $('#reply-enabled').on('change', function() {
    tmpItems['trimless-reply-enabled'] = this.checked;
  });
  $('#reply-enabled').prop('checked', tmpItems['trimless-reply-enabled']);

  $('#save').on('click', save);

  $('#reset').on('click', function() {
    $('#color-enabled').prop('checked', true);
    $('#color-enabled').trigger('change');
    $('#color-input').spectrum('set', '#888888');

    $('#indentation-enabled').prop('checked', true);
    $('#indentation-enabled').trigger('change');
    $('#indentation-input').val(32);
    $('#indentation-input').trigger('change');

    $('#reply-enabled').prop('checked', false);
    $('#reply-enabled').trigger('change');
  });
}

document.addEventListener(
  'DOMContentLoaded',
  () => {
    chrome.storage.sync.get(null, function(items) {
      tmpItems = items;
      initialize();
    });
  }
);
