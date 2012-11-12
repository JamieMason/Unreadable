var casper = require('casper').create({
  verbose: false,
  logLevel: 'error',
  viewportSize: {
    width: 1420,
    height: 860
  }
});

function TestPage(name, originalUrl, minifiedUrl) {
  this.name = '[' + name + ']';

  this.before = {
    url: originalUrl,
    elements: []
  };

  this.after = {
    url: minifiedUrl,
    elements: []
  };
}

TestPage.prototype = {

  measureElements: function measureElements(phase) {
    var self = this;
    casper.thenOpen(self[phase].url, function() {
      self[phase].elements = casper.evaluate(function() {
        return Array.prototype.slice.call(document.getElementsByTagName('*')).map(function(el) {
          return {
            nodeName: el.nodeName,
            boundingRect: JSON.stringify(el.getBoundingClientRect())
          };
        });
      });
    });
  },

  readDocuments: function() {
    this.measureElements('before');
    this.measureElements('after');
  },

  assertLength: function() {
    casper.test.assert(this.before.elements.length === this.after.elements.length, this.name + ' Minified document has same number of elements');
  },

  assertOrder: function(i, before, after) {
    casper.test.assert(before.nodeName === after.nodeName, this.name + ' Minified document preserves correct order of elements');
  },

  assertLayout: function(i, before, after) {
    casper.test.assert(before.boundingRect === after.boundingRect, this.name + ' Minified document preserves layout of ' + before.nodeName + ' ' + i);
  },

  runTests: function() {
    var self = this;
    self.assertLength();
    self.before.elements.forEach(function(element, i) {
      var before = self.before.elements[i];
      var after = self.after.elements[i];
      self.assertOrder(i, before, after);
      self.assertLayout(i, before, after);
    });
  }

};

var asteriskTestPage = new TestPage('Asterisk Test Page', 'http://localhost:1111/minify.html', 'http://localhost:1111/minify.min.html');

casper.start('about:blank');
asteriskTestPage.readDocuments();

casper.run(function() {
  asteriskTestPage.runTests();
  casper.test.renderResults(true, 0, 'test-results.xml');
  casper.exit();
});
