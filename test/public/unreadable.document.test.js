describe('unreadable.document', function() {
  it('is a namespace', function() {
    expect(unreadable.document).toBeObject();
  });
});



describe('unreadable.document.getDocType', function() {

  var documents = {};

  beforeEach(function() {
    documents = {
      'html-4.01-frameset': {
        doctype: {
          name: 'html',
          publicId: '-//W3C//DTD HTML 4.01 Frameset//EN',
          systemId: 'http://www.w3.org/TR/html4/frameset.dtd'
        }
      },
      'html-4.01-strict': {
        doctype: {
          name: 'html',
          publicId: '-//W3C//DTD HTML 4.01//EN',
          systemId: 'http://www.w3.org/TR/html4/strict.dtd'
        }
      },
      'html-4.01-transitional': {
        doctype: {
          name: 'html',
          publicId: '-//W3C//DTD HTML 4.01 Transitional//EN',
          systemId: 'http://www.w3.org/TR/html4/loose.dtd'
        }
      },
      'html5': {
        doctype: {
          name: 'html',
          publicId: '',
          systemId: ''
        }
      },
      'xhtml-1.0-frameset': {
        doctype: {
          name: 'html',
          publicId: '-//W3C//DTD XHTML 1.0 Frameset//EN',
          systemId: 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd'
        }
      },
      'xhtml-1.0-strict': {
        doctype: {
          name: 'html',
          publicId: '-//W3C//DTD XHTML 1.0 Strict//EN',
          systemId: 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'
        }
      },
      'xhtml-1.0-transitional': {
        doctype: {
          name: 'html',
          publicId: '-//W3C//DTD XHTML 1.0 Transitional//EN',
          systemId: 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'
        }
      },
      'xhtml-1.1-basic': {
        doctype: {
          name: 'html',
          publicId: '-//W3C//DTD XHTML Basic 1.1//EN',
          systemId: 'http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd'
        }
      },
      'xhtml-1.1-dtd': {
        doctype: {
          name: 'html',
          publicId: '-//W3C//DTD XHTML 1.1//EN',
          systemId: 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'
        }
      }
    };
  });

  describe('when passed a document object', function() {
    it('returns the correct doctype definition', function() {
      expect(unreadable.document.getDocType(documents['html-4.01-frameset'])).toEqual('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">');
      expect(unreadable.document.getDocType(documents['html-4.01-strict'])).toEqual('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">');
      expect(unreadable.document.getDocType(documents['html-4.01-transitional'])).toEqual('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">');
      expect(unreadable.document.getDocType(documents['html5'])).toEqual('<!DOCTYPE html>');
      expect(unreadable.document.getDocType(documents['xhtml-1.0-frameset'])).toEqual('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">');
      expect(unreadable.document.getDocType(documents['xhtml-1.0-strict'])).toEqual('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">');
      expect(unreadable.document.getDocType(documents['xhtml-1.0-transitional'])).toEqual('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">');
      expect(unreadable.document.getDocType(documents['xhtml-1.1-basic'])).toEqual('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">');
      expect(unreadable.document.getDocType(documents['xhtml-1.1-dtd'])).toEqual('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">');
    });
  });

});



describe('unreadable.document.parse', function() {
  describe('when supplied HTML file contents', function () {
    var fileContents;

    beforeEach(function () {
      fileContents = '';
      fileContents += '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
      fileContents += '<html lang="en-GB" class="no-js" id="some-id">';
      fileContents += '<head>';
      fileContents += '  <meta charset="UTF-8">';
      fileContents += '  <title>HTML 4.01 Strict</title>';
      fileContents += '</head>';
      fileContents += '<body>';
      fileContents += '    <p>xxx</p>';
      fileContents += '</body>';
      fileContents += '</html>';
    });

    it('creates an accurate document object from it', function () {
      var doc = unreadable.document.parse(fileContents);
      expect(doc).toBeObject();
      expect(doc.toString()).toEqual('[object HTMLDocument]');
      expect(doc.documentElement.getAttribute('lang')).toEqual('en-GB');
      expect(doc.documentElement.className).toEqual('no-js');
      expect(doc.documentElement.getAttribute('id')).toEqual('some-id');
    });
  });

  describe('when supplied HTML file contents with unquoted attributes', function () {
    var fileContents;

    beforeEach(function () {
      fileContents = '';
      fileContents += '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" http://www.w3.org/TR/html4/strict.dtd>';
      fileContents += '<html lang=en-GB class=no-js id=some-id>';
      fileContents += '<head>';
      fileContents += '  <meta charset=UTF-8>';
      fileContents += '  <title>HTML 4.01 Strict</title>';
      fileContents += '</head>';
      fileContents += '<body>';
      fileContents += '    <p>xxx</p>';
      fileContents += '</body>';
      fileContents += '</html>';
    });

    it('creates an accurate document object from it', function () {
      var doc = unreadable.document.parse(fileContents);
      expect(doc).toBeObject();
      expect(doc.toString()).toEqual('[object HTMLDocument]');
      expect(doc.documentElement.getAttribute('lang')).toEqual('en-GB');
      expect(doc.documentElement.className).toEqual('no-js');
      expect(doc.documentElement.getAttribute('id')).toEqual('some-id');
    });
  });
});




describe('unreadable.document.stringify', function() {
  describe('when supplied a document object', function () {

    var fileContents;
    var doc;

    beforeEach(function () {
      fileContents = '';
      fileContents += '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
      fileContents += '<html lang="en-GB">';
      fileContents += '<head>';
      fileContents += '  <meta charset="UTF-8">';
      fileContents += '  <title>HTML 4.01 Strict</title>';
      fileContents += '</head>';
      fileContents += '<body>';
      fileContents += '    <p>xxx</p>';
      fileContents += '</body>';
      fileContents += '</html>';
      doc = unreadable.document.parse(fileContents);
    });

    it('returns the HTML file contents', function () {
      var parsed = unreadable.document.stringify(doc);
      expect(parsed.toLowerCase().replace(/\s/g, '')).toEqual(fileContents.toLowerCase().replace(/\s/g, ''));
    });

  });
});



describe('unreadable.document.getOriginal', function() {

  var originalXhr;

  beforeEach(function () {
    originalXhr = unreadable.xhr;
    unreadable.xhr = function (url, handler) {
      setTimeout(function () {
        var fileContents = '';
        fileContents += '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" http://www.w3.org/TR/html4/strict.dtd>';
        fileContents += '<html lang=en-GB class=no-js id=some-id>';
        fileContents += '<head>';
        fileContents += '  <meta charset=UTF-8>';
        fileContents += '  <title>HTML 4.01 Strict</title>';
        fileContents += '</head>';
        fileContents += '<body>';
        fileContents += '    <p>xxx</p>';
        fileContents += '    <script>document.getElementsByTagName("body")[0].setAttribute("id", "js-executed");</script>';
        fileContents += '</body>';
        fileContents += '</html>';
        handler(fileContents);
      }, 500);
    };
  });

  afterEach(function () {
    unreadable.xhr = originalXhr;
  });

  describe('when supplied a same domain URL and handler', function () {
    it('calls handler with a document object which has not been augmented by JavaScript', function () {
      var doc = -1;

      runs(function() {
        unreadable.document.getOriginal(document, function(_doc) {
          doc = _doc;
        });
      });

      waitsFor(function() {
        return doc !== -1;
      }, 'unreadable.document.getOriginal did not respond', 10000);

      runs(function() {
        expect(doc).toBeObject();
        expect(doc.toString()).toEqual('[object HTMLDocument]');
        expect(doc.documentElement.getAttribute('lang')).toEqual('en-GB');
        expect(doc.documentElement.className).toEqual('no-js');
        expect(doc.documentElement.getAttribute('id')).toEqual('some-id');
      });
    });
  });
});



describe('unreadable.document.disableScripts', function() {
  describe('when supplied a document object', function () {

    var doc;

    beforeEach(function () {
      var fileContents = '';
      fileContents += '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
      fileContents += '<html lang="en-GB">';
      fileContents += '<head>';
      fileContents += '  <meta charset="UTF-8">';
      fileContents += '  <title>HTML 4.01 Strict</title>';
      fileContents += '</head>';
      fileContents += '<body>';
      fileContents += '    <script type="text/javascript"></script>';
      fileContents += '    <script type="text/arbitrary"></script>';
      fileContents += '    <script>document.getElementsByTagName("body")[0].setAttribute("id", "js-executed");</script>';
      fileContents += '</body>';
      fileContents += '</html>';
      doc = unreadable.document.parse(fileContents);
    });

    it('sets unrecognised type attributes on all scripts so they do not execute', function () {
      var _doc = unreadable.document.disableScripts(doc);
      var scripts = _doc.getElementsByTagName('script');
      expect(scripts.length).toEqual(3);
      expect(scripts[0].getAttribute('type')).toEqual('unreadable/ignore');
      expect(scripts[1].getAttribute('type')).toEqual('text/arbitrary');
      expect(scripts[2].getAttribute('type')).toEqual('unreadable/ignore');
      expect(_doc.getElementsByTagName('body')[0].getAttribute('id')).not.toEqual('js-executed');
    });
  });
});



describe('unreadable.document.getMinifyable', function() {
  describe('when supplied a document object', function () {

    var doc;
    var originalGetOriginal;

    beforeEach(function () {
      var fileContents = '';
      fileContents += '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
      fileContents += '<html lang="en-GB">';
      fileContents += '<head>';
      fileContents += '  <meta charset="UTF-8">';
      fileContents += '  <title>HTML 4.01 Strict</title>';
      fileContents += '</head>';
      fileContents += '<body>';
      fileContents += '    <script type="text/javascript"></script>';
      fileContents += '    <script type="text/arbitrary"></script>';
      fileContents += '    <script>document.getElementsByTagName("body")[0].setAttribute("id", "js-executed");</script>';
      fileContents += '</body>';
      fileContents += '</html>';
      doc = unreadable.document.parse(fileContents);
      originalGetOriginal = unreadable.document.getOriginal;
      unreadable.document.getOriginal = function (doc, handler) {
        setTimeout(function () {
          handler(doc);
        }, 500);
      };
    });

    afterEach(function () {
      unreadable.document.getOriginal = originalGetOriginal;
    });

    it('returns a window object containing that document, not augmented by JavaScript', function () {
      var win = -1;

      runs(function() {
        unreadable.document.getMinifyable(doc, function (_win) {
          win = _win;
        });
      });

      waitsFor(function() {
        return win !== -1;
      }, 'unreadable.document.getMinifyable did not respond', 10000);

      runs(function() {
        var scripts = win.document.getElementsByTagName('script');
        expect(scripts.length).toEqual(3);
        expect(scripts[0].getAttribute('type')).toEqual('unreadable/ignore');
        expect(scripts[1].getAttribute('type')).toEqual('text/arbitrary');
        expect(scripts[2].getAttribute('type')).toEqual('unreadable/ignore');
        expect(win.document.getElementsByTagName('body')[0].getAttribute('id')).not.toEqual('js-executed');
      });
    });
  });
});
