/**
 * @fileOverview This is the Phantom Script called by the asterisk binary
 * @author Jamie Mason, <a href="http://twitter.com/gotnosugarbaby">@GotNoSugarBaby</a>, <a href="https://github.com/JamieMason">https://github.com/JamieMason</a>
 */

var system = require('system');
var cwd = system.args[1];
var url = system.args[2] || 'about:blank';
var task = system.args[3];
var page = require('webpage').create();
var messagePrefix = '[ASTERISK]';
var exitMessage = messagePrefix + ' END';
var commandToClass = {
  summary: 'DocumentSummary',
  minify: 'ComputedStyleMinify'
};

task = task in commandToClass ? commandToClass[task] : task;

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
  page.injectJs('ajax.js');
  page.injectJs('Class.js');
  page.injectJs('TreeCrawler.js');
  page.injectJs('DocumentSummary.js');
  page.injectJs('ComputedStyleMinify.js');
  page.evaluate(function(messagePrefix, exitMessage, taskName){
    new window[taskName]().crawl(function(output){
      console.log(messagePrefix, output);
      console.log(exitMessage);
    });
  }, messagePrefix, exitMessage, task);
});
