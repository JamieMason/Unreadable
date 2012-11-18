function asteriskMinify (messagePrefix, exitMessage, config) {

  var remove_optional_closing_tags = config.asterisk_minify.remove_optional_closing_tags;
  var output = [];
  var inlineStyles = [];
  var inlineScripts = [];
  var reClosingTagForbidden = new RegExp('^(' + config.asterisk_minify.forbidden_closing_tags.join('|') + ')$');
  var reClosingTagOptional = new RegExp('^(' + config.asterisk_minify.optional_closing_tags.join('|') + ')$');

  function hasSensitiveWhitespace(el) {
    var computedStyle;
    return el && (computedStyle = getComputedStyle(el, null)) && ~(computedStyle.getPropertyValue('white-space') + '').search(/^pre/);
  }

  function isInlineElement(el) {
    var computedStyle;
    return el && (computedStyle = getComputedStyle(el, null)) && ~(computedStyle.getPropertyValue('display') + '').search(/^inline/);
  }

  function textNode(el) {
    var text = el.nodeValue;

    if(!hasSensitiveWhitespace(el.parentNode)) {

      // trim left
      text = text.replace(/^\s\s*/, isInlineElement(el.previousSibling) ? ' ' : '');

      // trim right
      var i = text.length;
      do {} while (/\s/.test(text.charAt(--i)));

      text = text.slice(0, i + 1) + (isInlineElement(el.nextSibling) ? ' ' : '');
    }

    output.push(text);
  }

  function elementNodeOpen(el, nodeName) {

    var i = 0;
    var attributes = el.attributes;
    var len = attributes.length;
    var attrs = [];
    var attr;
    var attrName;
    var attrValue;

    if(len) {
      while(i < len) {
        attr = attributes[i++];
        attrName = attr.name;
        attrValue = attr.value;

        if(!attrValue.length) {
          attrs.push(attrName);
          continue;
        } else if(~attrValue.indexOf(' ')) {
          attrs.push(attrName + '="' + attrValue + '"');
          continue;
        } else {
          attrs.push(attrName + '=' + attrValue);
        }
      }
    }

    attrs = attrs.join(' ');

    if(nodeName === 'style') {
      inlineStyles.push(output.length + 1);
    } else if(nodeName === 'script') {

      // @FIXME scripts in the head are not having their @types processed correctly
      if(~el.type.search(/^(asterisk\/ignore|text\/javascript)/)) {
        attrs = attrs.replace(' ' + el.type, '');
        el.type = '';
      }

      if(!el.src && !el.type) {
        inlineScripts.push(output.length + 1);
      }

    }

    output.push(attrs ? ('<' + nodeName + ' ' + attrs + '>') : '<' + nodeName + '>');

  }

  function elementNodeClose(el, nodeName) {
    if(!~nodeName.search(reClosingTagForbidden) || (remove_optional_closing_tags && ~nodeName.search(reClosingTagOptional))) {
      output.push('</' + nodeName + '>');
    }
  }

  function processElement(el) {

    var i = 0;
    var children = el.childNodes;
    var len = children.length;
    var isElementNode = el.nodeType === 1;
    var isTextNode = el.nodeType === 3;
    var nodeName = el.nodeName.toLowerCase();

    if(isElementNode) {
      elementNodeOpen(el, nodeName);
      if(len) {
        while(i < len) {
          processElement(children[i++]);
        }
      }
      elementNodeClose(el, nodeName);
    } else if(isTextNode) {
      textNode(el);
    }

  }

  function getDocType() {
    var element = document.doctype || {
      name: 'html'
    };
    var publicId = element.publicId;
    var systemId = element.systemId;
    var extra = '';

    if(publicId) {
      extra = extra + ' PUBLIC ' + publicId;
    }

    if(!publicId && systemId) {
      extra = extra + ' SYSTEM';
    }

    if(systemId) {
      extra = extra + ' ' + systemId;
    }

    return '<!DOCTYPE ' + element.name + extra + '>';
  }

  function getNonJsMarkup(onComplete) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function(evnt) {
      var _document = document.implementation.createHTMLDocument('no-js');
      _document.documentElement.innerHTML = xhr.responseText;
      onComplete(_document);
    };
    xhr.open('GET', location.href);
    xhr.responseType = 'text';
    xhr.send();
  }

  getNonJsMarkup(function(_document) {
    var i = 0;
    var executableScripts = _document.querySelectorAll('script:not([type]),script[type="text/javascript"]');
    var len = executableScripts.length;

    if(len) {
      while(i < len) {
        executableScripts[i++].type = 'asterisk/ignore';
      }
    }

    document.documentElement.innerHTML = _document.documentElement.innerHTML;
    _document = null;
    output.push(getDocType() +'\n');
    processElement(document.documentElement);

    console.log(messagePrefix, JSON.stringify({
      html: output,
      iScripts: inlineScripts,
      iStyles: inlineStyles
    }));

    console.log(exitMessage);
  });

}
