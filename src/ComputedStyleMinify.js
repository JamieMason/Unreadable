/**
 * @class    ComputedStyleMinify
 * @extends  TreeCrawler
 */
var ComputedStyleMinify = TreeCrawler.extend({

  minifyConfig: {},
  reClosingTagForbidden: /./,
  reClosingTagOptional: /./,

  init: function(config) {
    this._super(config);
    this.minifyConfig = this.config.asterisk_minify;
    this.reClosingTagForbidden = new RegExp('^(' + this.minifyConfig.forbidden_closing_tags.join('|') + ')$');
    this.reClosingTagOptional = new RegExp('^(' + this.minifyConfig.optional_closing_tags.join('|') + ')$');
  },

  /**
   * @extends TreeCrawler.reset
   * @memberOf ComputedStyleMinify.prototype
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

  /**
   * Returns the first element matching the nodeName provided
   *
   * @param  {HTMLDocument} doc
   * @param  {String} tagName
   * @return {HTMLElement}
   * @memberOf ComputedStyleMinify.prototype
   */
  getElement: function(doc, tagName) {
    return doc.getElementsByTagName(tagName)[0];
  },

  /**
   * Copy the first element matching the nodeName provided from one HTMLDocument to another
   *
   * @param  {String} tagName
   * @param  {HTMLDocument} fromDocument
   * @param  {HTMLDocument} toDocument
   * @memberOf ComputedStyleMinify.prototype
   */
  transferElement: function(tagName, fromDocument, toDocument) {
    var outgoing = this.getElement(toDocument, tagName);
    var incoming = this.getElement(fromDocument, tagName);
    outgoing.parentNode.replaceChild(incoming, outgoing);
  },

  /**
   * Process the document
   *
   * @extends TreeCrawler.crawl
   * @param  {Function}  onComplete  This function is passed the resulting output of processing the document
   * @memberOf ComputedStyleMinify.prototype
   */
  crawl: function(onComplete) {
    var _super = this._super.bind(this);
    this.getNonJsMarkup(function(doc) {
      this.transferElement('head', doc, document);
      this.transferElement('body', doc, document);
      _super(onComplete);
    }.bind(this));
  },

  /**
   * Is this text node whitespace for indentation, not content?
   *
   * @param  {String}  textNodeValue
   * @return {Boolean}
   * @memberOf ComputedStyleMinify.prototype
   */
  isFormattingWhitespace: function(textNodeValue) {
    return textNodeValue !== ' ' && !!~textNodeValue.search(/\S/);
  },

  /**
   * Replace leading whitespace with our substitute
   *
   * @param  {String}  value
   * @param  {String}  substitute  Replace the whitespace with this value
   * @return {String}
   * @memberOf ComputedStyleMinify.prototype
   */
  trimLeft: function(value, substitute){
    return value.replace(/^\s\s*/, substitute);
  },

  /**
   * Replace trailing whitespace with our substitute
   *
   * @param  {String}  value
   * @param  {String}  substitute  Replace the whitespace with this value
   * @return {String}
   * @memberOf ComputedStyleMinify.prototype
   */
  trimRight: function(value, substitute){
    var i = value.length;
    do {} while (/\s/.test(value.charAt(--i)));
    return value.slice(0, i + 1) + substitute;
  },

  /**
   * Read the computed style property of an HTMLElement
   *
   * @param  {HTMLElement} el
   * @param  {String} property
   * @return {String}
   * @memberOf ComputedStyleMinify.prototype
   */
  inspectStyle: function(el, property) {
    var computedStyle = getComputedStyle(el, null);
    return(computedStyle && computedStyle.getPropertyValue(property) + '') || '';
  },

  /**
   * Does the HTMLElement's computed style contain our sub string?
   *
   * @param  {HTMLElement} el
   * @param  {String} property
   * @param  {String} subString
   * @return {Boolean}
   * @memberOf ComputedStyleMinify.prototype
   */
  styleContains: function(el, property, subString) {
    return el === null ? false : !!~this.inspectStyle(el, property).search(subString);
  },

  /**
   * Is the Element's CSS display property either inline or inline-block?
   *
   * @param  {HTMLElement}  el
   * @return {Boolean}
   * @memberOf ComputedStyleMinify.prototype
   */
  isInlineElement: function(el) {
    return this.styleContains(el, 'display', 'inline');
  },

  /**
   * Is the Element's CSS white-space property either pre, pre-line or pre-wrap?
   *
   * @param  {HTMLElement}  el
   * @return {Boolean}
   * @memberOf ComputedStyleMinify.prototype
   */
  hasSensitiveWhitespace: function(el){
    return this.styleContains(el, 'white-space', 'pre');
  },

  /**
   * Process the opening tag of HTMLElement
   *
   * @extends TreeCrawler.ELEMENT_NODE_OPEN
   * @param {HTMLElement} el
   * @memberOf ComputedStyleMinify.prototype
   */
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

  /**
   * Process the closing tag of HTMLElement
   *
   * @extends TreeCrawler.ELEMENT_NODE_CLOSE
   * @param {HTMLElement} el
   * @memberOf ComputedStyleMinify.prototype
   */
  ELEMENT_NODE_CLOSE: function(el) {
    var nodeName = el.nodeName.toLowerCase();

    // omit closing tag if forbidden, or optional and we want to remove optional closing tags...
    if (!!~nodeName.search(this.reClosingTagForbidden) || (this.minifyConfig.remove_optional_closing_tags && !!~nodeName.search(this.reClosingTagOptional))) {
      return;
    }

    this.output.html.push('</' + nodeName + '>');
  },

  /**
   * Process a text node
   *
   * @extends TreeCrawler.TEXT_NODE_OPEN
   * @param {Text} el
   * @memberOf ComputedStyleMinify.prototype
   */
  TEXT_NODE_OPEN: function(el) {
    var value = el.nodeValue;
    if(!this.hasSensitiveWhitespace(el.parentNode)) {
      value = this.trimLeft(value, this.isInlineElement(el.previousSibling) ? ' ' : '');
      value = this.trimRight(value, this.isInlineElement(el.nextSibling) ? ' ' : '');
    }
    this.output.html.push(value);
  }

});
