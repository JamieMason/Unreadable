var fs             = require('fs');
var system         = require('system');
var phantomSession = require('webpage').create();
var cwd            = system.args[1];
var url            = system.args[2] || 'about:blank';
var config         = system.args[3];
var inspect        = system.args[4] === 'true';
var outFile        = system.args[5];
var messagePrefix  = '[UNREADABLE]';
var exitMessage    = messagePrefix + ' END';
var stream;

// create/empty file
fs.write(outFile, '', 'w');

// open file for output
stream = fs.open(outFile, 'a');

config = JSON.parse(config);

/**
 * Listen for our data being returned from the browser session, write output and exit
 * @param  {String} msg
 */
phantomSession.onConsoleMessage = function(msg) {
  if(msg === exitMessage) {
    phantom.exit();
  } else if(~msg.indexOf(messagePrefix)) {
    stream.write(msg.replace(messagePrefix, ''));
    stream.flush();
  }
};

/**
 * Listen for JavaScript errors happening in the browser, log them and exit
 * @param  {String} msg
 * @param  {Array} trace
 */
phantomSession.onError = function(msg, trace) {
  var msgStack = ['ERROR: ' + msg];
  if (trace) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
    });
  }
  console.error(msgStack.join('\n'));
  phantom.exit();
};

// Open the URL and process it
phantomSession.open(url, function(status){
  phantomSession.injectJs('browser.js');
  phantomSession.evaluate(function(messagePrefix, exitMessage, config, inspect){
    unreadableMinify(messagePrefix, exitMessage, config, inspect);
  }, messagePrefix, exitMessage, config, inspect);
});
