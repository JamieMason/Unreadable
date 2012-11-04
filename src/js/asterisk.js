/**
 * @fileOverview This is the CasperJS Script called by the asterisk binary
 * @author Jamie Mason, <a href="http://twitter.com/gotnosugarbaby">@GotNoSugarBaby</a>, <a href="https://github.com/JamieMason">https://github.com/JamieMason</a>
 */
var system, cwd, url, task, messagePrefix, exitMessage, page;
system = require('system');
/**
 * The current working directory needs supplying currently, I can't find a way to locate it using Casper
 * @type {String}
 */
cwd = system.args[1];
/**
 * The web page to process
 * @type {String}
 */
url = system.args[2] || 'about:blank';
/**
 * The task to perform on the URL
 * @type {String}
 */
task = system.args[3];
messagePrefix = '[ASTERISK]';
exitMessage = messagePrefix + " END";
if (task === 'summary') {
  task = 'DocumentSummary';
}
if (task === 'minify') {
  task = 'ComputedStyleMinify';
}
page = require('webpage').create();
page.onConsoleMessage = function(msg){
  if (msg === exitMessage) {
    return phantom.exit();
  } else if (~msg.indexOf(messagePrefix)) {
    return console.log(msg.replace(messagePrefix, ''));
  }
};
page.onError = function(msg, trace){
  var msgStack;
  msgStack = ['ERROR: ' + msg];
  if (trace) {
    msgStack.push('TRACE:');
    trace.forEach(function(t){
      var ref$;
      return msgStack.push(' -> ' + t.file + ': ' + t.line + ((ref$ = t['function']) != null
        ? ref$
        : ' (in function "' + t['function'] + {
          '")': ''
        }));
    });
  }
  console.error(msgStack.join('\n'));
  return phantom.exit();
};
page.open(url, function(status){
  page.injectJs('browser/ElementProcessor.js');
  page.injectJs('browser/TreeCrawler.js');
  page.injectJs('browser/DocumentSummary.js');
  page.injectJs('browser/ComputedStyleMinify.js');
  page.injectJs('browser/ajax.js');
  return page.evaluate(function(messagePrefix, exitMessage, taskName){
    var iterator;
    iterator = new window[taskName]();
    return iterator.crawl(function(output){
      console.log(messagePrefix, output);
      return console.log(exitMessage);
    });
  }, messagePrefix, exitMessage, task);
});
/**
 * @fileOverview This is the CasperJS Script called by the asterisk binary
 * @author Jamie Mason, <a href="http://twitter.com/gotnosugarbaby">@GotNoSugarBaby</a>, <a href="https://github.com/JamieMason">https://github.com/JamieMason</a>
 */