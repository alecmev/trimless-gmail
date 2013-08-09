var pageMod = require('sdk/page-mod');
var self = require("sdk/self");
var ss = require("sdk/simple-storage");
var tabs = require("sdk/tabs");
var tabUtils = require("sdk/tabs/utils");
var winUtils = require('sdk/window/utils');

var { Cc, Ci, Cu } = require("chrome");

Cu.import('resource://gre/modules/Services.jsm');

var styleSheetService = 
    Cc['@mozilla.org/content/style-sheet-service;1']
    .getService(Ci.nsIStyleSheetService);
var styleSheetURI = Services.io.newURI(
    self.data.url('main.css'), null, null
);
var matchURL = 'https://mail.google.com';

function toggleTrimless(window)
{
    var trimlessButton = window.document.getElementById('trimless-button');
    trimlessButton.setAttribute(
        'disabled', (!ss.storage.enabled).toString()
    );
    trimlessButton.setAttribute('tooltiptext', ss.storage.enabled ? 
        'Trimless is enabled' : 'Trimless is disabled'
    );
}

function buttonClicked(e)
{
    ss.storage.enabled = !ss.storage.enabled;
    applyToWindows(toggleTrimless);
    workers.forEach(function(worker) {
        worker.port.emit('toggle', ss.storage.enabled.toString());
    });
}

function addButton(window)
{
    if (
        'chrome://browser/content/browser.xul' != window.location ||
        window.document.getElementById('trimless-button') != null
    ) {
        return;
    }

    var trimlessButton = window.document.createElement('toolbarbutton');
    trimlessButton.id = 'trimless-button';
    trimlessButton.setAttribute('tooltiptext', 'Trimless is enabled');
    trimlessButton.setAttribute(
        'disabled', (!ss.storage.enabled).toString()
    );
    trimlessButton.setAttribute('hidden', 'true');
    trimlessButton.addEventListener('click', buttonClicked);
    var tmpUrlbarIcons = window.document.getElementById('urlbar-icons');
    tmpUrlbarIcons.insertBefore(trimlessButton, tmpUrlbarIcons.firstChild);

    tabEvent(window);
    window.gBrowser.addTabsProgressListener({
        window: window,
        onLocationChange: function(a, b, c, d)
        {
            tabEvent(window);
        }
    });
    var tabEventWrapper =
    {
        window: window,
        tabEvent: function()
        {
            tabEvent(window);
        }
    }
    window.gBrowser.tabContainer.addEventListener(
        'TabOpen', tabEventWrapper.tabEvent
    );
    window.gBrowser.tabContainer.addEventListener(
        'TabSelect', tabEventWrapper.tabEvent
    );
}

function removeButton(window)
{
    var trimlessButton = window.document.getElementById('trimless-button');
    if (trimlessButton == null) {
        return;
    }

    trimlessButton.parentNode.removeChild(trimlessButton);
}

function checkDomain(window)
{
    window.document.getElementById('trimless-button').setAttribute('hidden', 
        window.content.document.location.href.indexOf(matchURL) == -1
    );
}

function tabEvent(window)
{
    if (window.document.readyState != 'complete') {
        window.addEventListener('DOMContentLoaded', function(e) {
            window.removeEventListener('DOMContentLoaded', arguments.callee);
            checkDomain(window);
        });
    }
    else {
        checkDomain(window);
    }
}

var workers = [];
var workerTabs = [];
 
function detachWorker(worker)
{
    var index = workers.indexOf(worker);
    if (index != -1) {
        workers.splice(index, 1);
        workerTabs.splice(index, 1);
    }
}

function applyToWindows(something)
{
    var tmpEnum = Services.wm.getEnumerator('navigator:browser');
    while (tmpEnum.hasMoreElements()) {
        var window = tmpEnum.getNext();
        window.QueryInterface(Ci.nsIDOMWindow);
        something(window);
    }
}

var windowListener =
{
    onOpenWindow: function(window)
    {
        window.docShell.QueryInterface(Ci.nsIInterfaceRequestor)
            .getInterface(Ci.nsIDOMWindow).addEventListener('load', this, true);
    },

    handleEvent: function(e)
    {
        var window = e.target.defaultView;
        window.removeEventListener('load', this, true);
        addButton(window);
    },

    onCloseWindow: function(window) { },
    onWindowTitleChange: function(window, title) { },
}

exports.main = function(options, callbacks)
{
    if (!('enabled' in ss.storage) || options.loadReason != 'startup') {
        ss.storage.enabled = true;
    }

    styleSheetService.loadAndRegisterSheet(
        styleSheetURI, styleSheetService.USER_SHEET
    );
    applyToWindows(addButton);
    Services.wm.addListener(windowListener);

    pageMod.PageMod({
        include: matchURL + '/*',
        attachTo: [ 'existing', 'top' ],
        contentScriptWhen: 'start',
        contentScriptFile: [
            self.data.url('jquery-2.0.3.min.js'),
            self.data.url('trimless-gmail.js')
        ],
        contentStyleFile: self.data.url('trimless-gmail.css'),
        onAttach: function(worker)
        {
            console.log('attached');
            worker.port.emit('toggle', ss.storage.enabled.toString());
            workers.push(worker);
            workerTabs.push(worker.tab);
            worker.on('detach', function () {
                console.log('detached');
                detachWorker(this);
            });
        }
    });
}

exports.onUnload = function(reason)
{
    Services.wm.removeListener(windowListener);
    applyToWindows(removeButton);
    styleSheetService.unregisterSheet(
        styleSheetURI, styleSheetService.USER_SHEET
    );
}
