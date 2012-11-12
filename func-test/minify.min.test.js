var casper = require('casper').create();
var original = {
  url: 'http://localhost:1111/func-test/minify.html',
  elements: []
};
var minified = {
  url: 'http://localhost:1111/func-test/minify.min.html',
  elements: []
};

function measureElements (entity) {
  casper.thenOpen(entity.url, function() {
    entity.elements = casper.evaluate(function() {
      return Array.prototype.slice.call(document.getElementsByTagName('*')).map(function(el) {
        return {
          nodeName: el.nodeName,
          boundingRect: JSON.stringify(el.getBoundingClientRect())
        };
      });
    });
  });
}

casper.start('about:blank');
measureElements(original);
measureElements(minified);

casper.run(function() {
  casper.test.assert(original.elements.length === minified.elements.length, 'Minifier did not add or remove elements');

  original.elements.forEach(function(element, i){
    var originalElement = original.elements[i];
    var minifiedElement = minified.elements[i];
    casper.test.assert(originalElement.boundingRect === minifiedElement.boundingRect, 'Layout of ' + originalElement.nodeName + ' at '+ i +' has not changed');
  });

  casper.test.done();
  casper.test.renderResults(true, 0, 'func-test/test-results.xml');
  casper.exit();
});
