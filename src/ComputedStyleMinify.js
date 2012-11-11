/**
 * @fileOverview
 * @author Jamie Mason, <a href="http://twitter.com/gotnosugarbaby">@GotNoSugarBaby</a>, <a href="https://github.com/JamieMason">https://github.com/JamieMason</a>
 */

/**
 * @class    ComputedStyleMinify
 * @extends  TreeCrawler
 */
var ComputedStyleMinify = TreeCrawler.extend({

  /**
   * @extends TreeCrawler.reset
   * @memberOf ComputedStyleMinify
   */
  reset: function() {
    this._super();
    this.output = {
      html: [this.getDocType(document) + '\n'],
      iScripts: [],
      iStyles: [],
      logs: []
    };
  },

  getElement: function(doc, selector) {
    return doc.getElementsByTagName(selector)[0];
  },

  transferElement: function(selector, fromDocument, toDocument) {
    var outgoing = this.getElement(toDocument, selector);
    var incoming = this.getElement(fromDocument, selector);
    outgoing.parentNode.replaceChild(incoming, outgoing);
  },

  crawl: function(onComplete) {
    var _super = this._super.bind(this);

    this.getNonJsMarkup(function(doc) {
      this.transferElement('head', doc, document);
      this.transferElement('body', doc, document);
      _super(onComplete);
    }.bind(this));
  },

  /**
   * @param  {String}  textNodeValue
   * @return {Boolean}
   */
  isFormattingWhitespace: function(textNodeValue) {
    return textNodeValue !== ' ' && !!~textNodeValue.search(/\S/);
  },

  trimLeft: function(value, substitute){
    return value.replace(/^\s\s*/, substitute);
  },

  trimRight: function(value, substitute){
    var i = value.length;
    do {} while (/\s/.test(value.charAt(--i)));
    return value.slice(0, i + 1) + substitute;
  },

  isInlineElement: function(el) {
    if(el === null) {
      return false;
    }
    var computedStyle = window.getComputedStyle(el, null);
    return (computedStyle && !!~computedStyle.getPropertyValue('display').indexOf('inline')) || false;
  },

  ELEMENT_NODE_OPEN: function(el) {
    var nodeName = el.nodeName.toLowerCase();
    var attrs = this.attrsToHtml(el);
    var output = this.output;

    attrs = attrs.length ? ' ' + attrs.join(' ') : '';

    if(nodeName === 'style') {
      output.iStyles.push(output.html.length + 1);
    }

    // @FIXME scripts in the head are not having their @types processed correctly
    else if(nodeName === 'script' && el.type === 'asterisk/ignore' || el.type === 'text/javascript') {
      attrs = attrs.replace(' type=asterisk/ignore', '').replace(' type=text/javascript', '');

      if(el.firstChild && el.firstChild.nodeValue) {
        output.iScripts.push(output.html.length + 1);
      }
    }
    output.html.push('<' + nodeName + attrs + '>');
  },

  ELEMENT_NODE_CLOSE: function(el) {
    var nodeName = el.nodeName.toLowerCase();
    // if closing tag is not optional or forbidden
    // if nodeName.search(/^(body|colgroup|dd|dt|head|html|li|option|tbody|td|tfoot|th|thead|tr)$/) is -1 and nodeName.search(/^(img|input|br|hr|frame|area|base|basefont|col|isindex|link|meta|param)$/) is -1
    //   crawler.output.html.push("</#{nodeName}>")
    this.output.html.push('</' + nodeName + '>');
  },

  TEXT_NODE_OPEN: function(el) {
    var value = el.nodeValue;

    // if(!!~value.search(/[^ ]/)) {
    //   value = value.replace(/^\s+/, this.isInlineElement(el.previousSibling) ? ' ' : '');
    // }

    value = this.trimLeft(value, this.isInlineElement(el.previousSibling) ? ' ' : '');
    value = this.trimRight(value, this.isInlineElement(el.nextSibling) ? ' ' : '');
    this.output.html.push(value);
  }

});
