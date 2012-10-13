args = phantom.casperArgs
cwd = args.get('cwd')
url = args.get('url') || 'about:blank'
task = args.get('task')

casper = require('casper').create(
  onError: (self, m) ->
    console.log('FATAL:' + m)
    self.exit()
  clientScripts:
    cwd + '/src/js/browser/TreeCrawler.js'
    cwd + '/src/js/browser/DocumentOutliner.js'
)

casper.start url, ->
  elements = @evaluate ->
    iterator = new DocumentOutliner!
    iterator.crawl!
    iterator.output.join '\n'
  @echo elements

casper.run!
