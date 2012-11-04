/**
 * @fileOverview This is the CasperJS Script called by the asterisk binary
 * @author Jamie Mason, <a href="http://twitter.com/gotnosugarbaby">@GotNoSugarBaby</a>, <a href="https://github.com/JamieMason">https://github.com/JamieMason</a>
 */

system = require('system')

/**
 * The current working directory needs supplying currently, I can't find a way to locate it using Casper
 * @type {String}
 */
cwd = system.args[1]

/**
 * The web page to process
 * @type {String}
 */
url = system.args[2] or 'about:blank'

/**
 * The task to perform on the URL
 * @type {String}
 */
task = system.args[3]

messagePrefix = '[ASTERISK]'
exitMessage = "#{messagePrefix} END"

task = 'DocumentSummary' if task is 'summary'
task = 'ComputedStyleMinify' if task is 'minify'

page = require('webpage').create()

page.onConsoleMessage = (msg) ->
  if msg is exitMessage then phantom.exit()
  else if ~msg.indexOf(messagePrefix) then console.log(msg.replace(messagePrefix, ''))

page.onError = (msg, trace) ->
  msgStack = ['ERROR: ' + msg]
  if trace
    msgStack.push('TRACE:')
    trace.forEach((t) ->
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''))
    )
  console.error(msgStack.join('\n'))
  phantom.exit()

page.open(url, (status) ->
  page.injectJs('browser/ElementProcessor.js')
  page.injectJs('browser/TreeCrawler.js')
  page.injectJs('browser/DocumentSummary.js')
  page.injectJs('browser/ComputedStyleMinify.js')
  page.injectJs('browser/ajax.js')

  page.evaluate((messagePrefix, exitMessage, taskName) ->

    iterator = new window[taskName]!
    iterator.crawl((output) ->
      console.log(messagePrefix, output);
      console.log(exitMessage)
    )

  , messagePrefix, exitMessage, task)
)
