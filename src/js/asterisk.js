/**
 * @fileOverview This is the CasperJS Script called by the asterisk binary
 * @author Jamie Mason, <a href="http://twitter.com/gotnosugarbaby">@GotNoSugarBaby</a>, <a href="https://github.com/JamieMason">https://github.com/JamieMason</a>
 */
/**
 * The current working directory needs supplying currently, I can't find a way to locate it using Casper
 * @type {String}
 */
var cwd, url, task, casper;
cwd = phantom.casperArgs.get('cwd');
/**
 * The web page to process
 * @type {String}
 */
url = phantom.casperArgs.get('url') || 'about:blank';
/**
 * The task to perform on the URL
 * @type {String}
 */
task = phantom.casperArgs.get('task');
/* Create a Crawler which injects our tasks to any URL we process */
casper = require('casper').create({
  verbose: false,
  logLevel: 'error',
  javascriptEnabled: false,
  loadImages: false,
  loadPlugins: false,
  onError: function(self, message){
    console.error(message);
    return self.exit();
  },
  clientScripts: [cwd + '/src/js/browser/ElementProcessor.js', cwd + '/src/js/browser/TreeCrawler.js', cwd + '/src/js/browser/DocumentSummary.js', cwd + '/src/js/browser/ComputedStyleMinify.js']
});
/* validate task name */
if (task.search(/^(summary|minify)$/) === -1) {
  casper.die("There is no task called \"" + task + "\"");
}
/* map the task option name to it's Class */
if (task === 'summary') {
  task = 'DocumentSummary';
}
if (task === 'minify') {
  task = 'ComputedStyleMinify';
}
/* Visit the URL and perform the chosen task */
casper.start(url, function(){
  var elements;
  elements = this.evaluate(function(taskName){
    var iterator;
    iterator = new window[taskName]();
    iterator.crawl();
    return iterator.output.join('');
  }, {
    taskName: task
  });
  return this.echo(elements);
});
casper.run();