var system = require('system');
var cwd = system.args[1];
var url = system.args[2] || 'about:blank';
var task = system.args[3];
var page = require('webpage').create();
var messagePrefix = '[ASTERISK]';
var exitMessage = messagePrefix + ' END';
var config = require('../config.json');

page.onConsoleMessage = function(msg){
  return msg === exitMessage ?
    phantom.exit()
    : !!~msg.indexOf(messagePrefix) ?
      console.log(msg.replace(messagePrefix, ''))
      : false;
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
  page.injectJs('shims.js');
  page.injectJs('Class.js');
  page.injectJs('TreeCrawler.js');
  page.injectJs('DocumentSummary.js');
  page.injectJs('ComputedStyleMinify.js');
  page.evaluate(function(messagePrefix, exitMessage, taskName, config){
    new window[taskName](config).crawl(function(output){
      console.log(messagePrefix, output);
      console.log(exitMessage);
    });
  }, messagePrefix, exitMessage, task, config);
});
