var fs            = require('fs');
var system        = require('system');
var page          = require('webpage').create();
var cwd           = system.args[1];
var url           = system.args[2] || 'about:blank';
var config        = system.args[3];
var inspect       = system.args[4] === 'true';
var outFile       = system.args[5];
var messagePrefix = '[ASTERISK]';
var exitMessage   = messagePrefix + ' END';
var stream;

// create/empty file
fs.write(outFile, '', 'w');

// open file for output
stream = fs.open(outFile, 'a');

config = JSON.parse(config);

page.onConsoleMessage = function(msg) {
  if(msg === exitMessage) {
    phantom.exit();
  } else if(~msg.indexOf(messagePrefix)) {
    stream.write(msg.replace(messagePrefix, ''));
    stream.flush();
  }
};

page.onError = function(msg, trace) {
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

page.open(url, function(status){
  page.injectJs('browser.js');
  page.evaluate(function(messagePrefix, exitMessage, config, inspect){
    asteriskMinify(messagePrefix, exitMessage, config, inspect);
  }, messagePrefix, exitMessage, config, inspect);
});
