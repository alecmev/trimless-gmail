if (!('trimless-enabled' in localStorage)) {
    localStorage['trimless-enabled'] = true;
}

var isEnabled = localStorage['trimless-enabled'];

@@THEREST@@

self.port.on('toggle', function(message)
{
    isEnabled = JSON.parse(message);
    localStorage['trimless-enabled'] = isEnabled;
    console.log('toggle: ' + isEnabled);
    if (isEnabled) {
        untrim();
    }
    else {
        ununtrim();
    }
});

self.on('detach', function()
{
    console.log('detach');
    ununtrim();
});
