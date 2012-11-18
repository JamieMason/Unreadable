var system = require('system');
var cwd = system.args[1];
var url = system.args[2] || 'about:blank';
var config = JSON.parse(system.args[3]);
var inspect = system.args[4] === 'true';
var page = require('webpage').create();
var messagePrefix = '[ASTERISK]';
var exitMessage = messagePrefix + ' END';

page.onConsoleMessage = function(msg) {
  if(msg === exitMessage) {
    phantom.exit();
  } else if(~msg.indexOf(messagePrefix)) {
    console.log(msg.replace(messagePrefix, ''));
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
