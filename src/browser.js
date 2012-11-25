/**
 * Minify the current Document
 * @param  {String}   messagePrefix  Asterisk's namespace for console.log, so any logged by the site are ignored
 * @param  {String}   exitMessage    Log message to instruct PhantomJS to exit
 * @param  {Object}   config         Merged defaults.json and config.json
 * @param  {Boolean}  inspect        Whether to inspect layout information before and after minification
 */
function asteriskMinify (messagePrefix, exitMessage, config, inspect) {

  /**
   * If --inspect is set, how many elements have unchanged layout
   * @type {Number}
   */
  var intact = 0;

  /**
   * Whether to strip eg </li>
   * @type {Boolean}
   */
  var remove_optional_closing_tags = config.asterisk_minify.remove_optional_closing_tags;

  /**
   * All tags and text
   * @type {String[]}
   */
  var output = [];

  /**
   * The size and position of all elements before minification
   * @type {Object[]}
   */
  var layoutBefore = [];

  /**
   * The size and position of all elements after minification
   * @type {Object[]}
   */
  var layoutAfter = [];

  /**
   * Array indexes of the contents of `<style>` elements within `output`
   * @type {Number[]}
   */
  var inlineStyles = [];

  /**
   * Array indexes of the contents of `<script>` elements within `output`
   * @type {Number[]}
   */
  var inlineScripts = [];

  /**
   * Match element names with no closing tags
   * @type {RegExp}
   */
  var reClosingTagForbidden = new RegExp('^(' + config.asterisk_minify.forbidden_closing_tags.join('|') + ')$');

  /**
   * Match element names with optional closing tags
   * @type {RegExp}
   */
  var reClosingTagOptional = new RegExp('^(' + config.asterisk_minify.optional_closing_tags.join('|') + ')$');

  /**
   * Is the whitespace of this element significant? eg `<pre>` or `<code>` elements, or anything styled as such
   * @param  {HTMLElement}  el
   * @return {Boolean}
   */
  function hasSensitiveWhitespace(el) {
    var computedStyle = window.getComputedStyle(el, null);
    return computedStyle && computedStyle.getPropertyValue('white-space').search(/^pre/) !== -1;
  }

  /**
   * Is this an inline or inline-block element? eg `<span>`, `<a>` elements, or anything styled as such
   * @param  {HTMLElement}  el
   * @return {Boolean}
   */
  function isInlineElement(el) {
    var computedStyle = window.getComputedStyle(el, null);
    return computedStyle && computedStyle.getPropertyValue('display').search(/^inline/) !== -1;
  }

  /**
   * Trim whitespace from this text node, providing it won't affect the layout of it's sibling elements
   * @param  {HTMLElement}  el
   */
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

  /**
   * Gather the source code for the opening tag of this element
   * @param  {HTMLElement} el
   * @param  {String} nodeName
   */
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

  /**
   * Gather the source code for the closing tag of this element
   * @param  {HTMLElement} el
   * @param  {String} nodeName
   */
  function elementNodeClose(el, nodeName) {
    if(!~nodeName.search(reClosingTagForbidden) || (remove_optional_closing_tags && ~nodeName.search(reClosingTagOptional))) {
      output.push('</' + nodeName + '>');
    }
  }

  /**
   * Add to list, the size and position of element and it's descendants
   * @param  {HTMLElement} el
   * @param  {Object[]} list
   */
  function inspectLayout(el, list) {

    var i = 0;
    var children = el.childNodes;
    var len = children.length;
    var layout = {};

    if(el.nodeType === 1) {
      layout = el.getBoundingClientRect();
      list.push([layout.top, layout.right, layout.bottom, layout.left, layout.width, layout.height].join('-'));

      if(len) {
        while(i < len) {
          inspectLayout(children[i++], list);
        }
      }
    }

  }

  /**
   * Compare the results of {@link inspectLayout} taken before and after minification
   */
  function verifyLayout() {

    var i = 0;
    var len = layoutBefore.length;
    var after = '';

    if(len) {
      while(i < len) {
        after = layoutAfter[i];
        if (after === layoutBefore[i]) {
          intact++;
        }
        i++;
      }
    }

  }

  /**
   * Recursively process element and it's descendants
   * @param  {HTMLElement} el
   */
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

  /**
   * Get the markup for the type declaration for this document
   * @return {String}
   */
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

  /**
   * Since we need JavaScript enabled to process the document, other scripts will be enabled that can modify the document.
   * We need to re-request the original source code to do minify a document which is appropriate for use.
   * @param  {Function} onComplete  Passed an HTMLDocument
   */
  function getNonJsMarkup(onComplete) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function(evnt) {
      var _document = document.implementation.createHTMLDocument('no-js');
      _document.documentElement.innerHTML = xhr.responseText;
      onComplete(_document, xhr.responseText);
    };
    xhr.open('GET', location.href);
    xhr.responseType = 'text';
    xhr.send();
  }

  // begin
  getNonJsMarkup(function(_document, originalMarkup) {
    var i = 0;
    var executableScripts = _document.querySelectorAll('script:not([type]),script[type="text/javascript"]');
    var len = executableScripts.length;
    var root = document.documentElement;
    var docType = getDocType() +'\n';

    if(len) {
      while(i < len) {
        executableScripts[i++].type = 'asterisk/ignore';
      }
    }

    root.replaceChild(_document.querySelector('head'), document.querySelector('head'));
    root.replaceChild(_document.querySelector('body'), document.querySelector('body'));
    _document = null;

    output.push(docType);

    if (inspect) {
      inspectLayout(root, layoutBefore);
    }

    processElement(root);

    if (inspect) {
      inspectLayout(root, layoutAfter);
      verifyLayout();
    }

    console.log(messagePrefix, JSON.stringify({
      original: originalMarkup,
      html: output,
      iScripts: inlineScripts,
      iStyles: inlineStyles,
      count: layoutBefore.length,
      intact: intact
    }));

    console.log(exitMessage);
  });

}
