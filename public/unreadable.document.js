unreadable.document = (function() {

  var exports = {};

  exports.getDocType = function(doc) {

    var element = doc.doctype || { name: 'html', publicId: '', systemId: '' };
    var extra = '';
    var publicId = element.publicId;
    var systemId = element.systemId;

    if (publicId) {
      extra = extra + ' PUBLIC "' + publicId + '"';
    }

    if (!publicId && systemId) {
      extra = extra + ' SYSTEM';
    }

    if (systemId) {
      extra = extra + ' "' + systemId + '"';
    }

    return '<!DOCTYPE ' + element.name + extra + '>';

  };

  function getDocumentElementAttrs (contents) {
    var frag = document.createElement('div');
    var attributes = contents.split(/<html ?/i)[1].split('>')[0];
    frag.innerHTML = '<div ' + attributes + '></div>';
    return frag.firstChild.attributes;
  }

  exports.parse = function(contents) {
    var doc = document.implementation.createHTMLDocument('');
    var docTypeMatch = exports.determineDocType(contents);
    var docType = document.implementation.createDocumentType('html', docTypeMatch.publicId, docTypeMatch.systemId);
    var frag = doc.createElement('html');

    frag.innerHTML = contents;
    doc.documentElement.replaceChild(frag.querySelector('head'), doc.querySelector('head'));
    doc.documentElement.replaceChild(frag.querySelector('body'), doc.querySelector('body'));
    doc.doctype.parentNode.replaceChild(docType, doc.doctype);

    // manually copy over lost <html> attributes
    [].slice.call(getDocumentElementAttrs(contents)).forEach(function(attribute) {
      doc.documentElement.setAttribute(attribute.name, attribute.value);
    });

    return doc;
  };

  exports.stringify = function(doc) {
    return exports.getDocType(doc) + '\n' + doc.documentElement.outerHTML;
  };

  exports.getOriginal = function(doc, handler) {
    unreadable.xhr(doc.location.href, function(contents) {
      handler(exports.parse(contents));
    });
  };

  exports.disableScripts = function(doc) {
    var executableScripts = doc.querySelectorAll('script:not([type]),script[type="text/javascript"]');
    [].slice.call(executableScripts).forEach(function(script) {
      script.setAttribute('type', 'unreadable/ignore');
    });
    return doc;
  };

  exports.getMinifyable = function (doc, handler) {
    exports.getOriginal(doc, function (original) {
      var contents = exports.stringify(exports.disableScripts(original));
      var iframe;
      var idocument;

      iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      idocument = iframe.contentDocument;
      idocument.open();
      idocument.write(contents);
      idocument.close();

      handler(iframe.contentWindow);
    });
  };

  exports.determineDocType = function(contents) {
    if (contents.indexOf('html4/frameset.dtd') !== -1) {
      return {
        source: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">',
        publicId: '-//W3C//DTD HTML 4.01 Frameset//EN',
        systemId: 'http://www.w3.org/TR/html4/frameset.dtd'
      };
    }
    if (contents.indexOf('html4/strict.dtd') !== -1) {
      return {
        source: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">',
        publicId: '-//W3C//DTD HTML 4.01//EN',
        systemId: 'http://www.w3.org/TR/html4/strict.dtd'
      };
    }
    if (contents.indexOf('html4/loose.dtd') !== -1) {
      return {
        source: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">',
        publicId: '-//W3C//DTD HTML 4.01 Transitional//EN',
        systemId: 'http://www.w3.org/TR/html4/loose.dtd'
      };
    }
    if (contents.indexOf('xhtml1-frameset.dtd') !== -1) {
      return {
        source: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
        publicId: '-//W3C//DTD XHTML 1.0 Frameset//EN',
        systemId: 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd'
      };
    }
    if (contents.indexOf('xhtml1-strict.dtd') !== -1) {
      return {
        source: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
        publicId: '-//W3C//DTD XHTML 1.0 Strict//EN',
        systemId: 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'
      };
    }
    if (contents.indexOf('xhtml1-transitional.dtd') !== -1) {
      return {
        source: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
        publicId: '-//W3C//DTD XHTML 1.0 Transitional//EN',
        systemId: 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'
      };
    }
    if (contents.indexOf('xhtml-basic11.dtd') !== -1) {
      return {
        source: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">',
        publicId: '-//W3C//DTD XHTML Basic 1.1//EN',
        systemId: 'http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd'
      };
    }
    if (contents.indexOf('xhtml11.dtd') !== -1) {
      return {
        source: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
        publicId: '-//W3C//DTD XHTML 1.1//EN',
        systemId: 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'
      };
    }
    return {
      source: '<!DOCTYPE HTML>',
      publicId: '',
      systemId: ''
    };
  };

  return exports;

}());
