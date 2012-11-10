/**
 * @fileOverview
 * @author Jamie Mason, <a href="http://twitter.com/gotnosugarbaby">@GotNoSugarBaby</a>, <a href="https://github.com/JamieMason">https://github.com/JamieMason</a>
 */

/**
 * @class TreeCrawler
 * @property {Object} ELEMENT_NODE
 * @property {Object} ATTRIBUTE_NODE
 * @property {Object} TEXT_NODE
 * @property {Object} CDATA_SECTION_NODE
 * @property {Object} ENTITY_REFERENCE_NODE
 * @property {Object} ENTITY_NODE
 * @property {Object} PROCESSING_INSTRUCTION_NODE
 * @property {Object} COMMENT_NODE
 * @property {Object} DOCUMENT_NODE
 * @property {Object} DOCUMENT_TYPE_NODE
 * @property {Object} DOCUMENT_FRAGMENT_NODE
 * @property {Object} NOTATION_NODE
 */

var TreeCrawler = Class.create({

  /**
   * Lookup table of node types to node type names
   * @type {Object}
   * @memberOf TreeCrawler
   */
  NODE_TYPES: {
     '1' : 'ELEMENT_NODE',
     '2' : 'ATTRIBUTE_NODE',
     '3' : 'TEXT_NODE',
     '4' : 'CDATA_SECTION_NODE',
     '5' : 'ENTITY_REFERENCE_NODE',
     '6' : 'ENTITY_NODE',
     '7' : 'PROCESSING_INSTRUCTION_NODE',
     '8' : 'COMMENT_NODE',
     '9' : 'DOCUMENT_NODE',
    '10' : 'DOCUMENT_TYPE_NODE',
    '11' : 'DOCUMENT_FRAGMENT_NODE',
    '12' : 'NOTATION_NODE'
  },

  /**
   * Restore the crawler's default state
   * @memberOf TreeCrawler
   */
  reset: function () {
    this.depth = 0;
    this.output = null;
  },

  /**
   * Start crawling the document
   * @param    {Function}     onComplete
   * @param    {HTMLElement}  [el=document.documentElement]
   * @param    {Function}     [iterator=TreeCrawler.processNodeByType]
   * @memberOf TreeCrawler
   */
  crawl: function(onComplete, doc, iterator) {
    this.doc = doc || document;
    this.iterator = TreeCrawler.processNodeByType;
  },

  /**
   * Get the markup for the doctype declaration
   * @return {String}
   */
  getDocType: function() {
    var element = this.doc.doctype || { name: 'html' };
    var publicId = element.publicId;
    var systemId = element.systemId;
    var extra = '';

    if (publicId) {
      extra = extra + ' PUBLIC ' + publicId;
    }

    if (!publicId && systemId) {
      extra = extra + ' SYSTEM';
    }

    if (systemId) {
      extra = extra + ' ' + systemId;
    }

    return '<!DOCTYPE ' + element.name + extra + '>';
  },

  /**
   * Get all <script>s which would be interpreted as JavaScript
   * @param  {HTMLDocument} doc
   * @return {HTMLScriptElement[]}
   */
  getScripts: function(doc) {
    return Array.prototype.slice.call(doc.querySelectorAll('script:not([type]),script[type="text/javascript"]'));
  },

  /**
   * Create an entire new HTML Document and populate it's HTML
   * @param  {String} html
   * @return {HTMLDocument}
   */
  createDocument: function(html){
    var doc = document.implementation.createHTMLDocument('no-js');
    doc.documentElement.innerHTML = html;
    return doc;
  },

  /**
   * XHR callback for TreeCrawler.getNonJsMarkup
   * @param  {Function} onComplete
   * @param  {Object} evnt
   * @private
   */
  _onAjaxedDocumentLoad: function(onComplete, evnt) {
    var doc = this.createDocument(this.responseText);

    this.getScripts(doc).forEach(function(el) {
      el.setAttribute('type', 'asterisk/ignore');
    });

    onComplete(doc);
  },

  /**
   * XHR the HTMLDocument in order to get it's original HTML before any JavaScript has augmented it
   * @param  {Function} onComplete
   */
  getNonJsMarkup: function (onComplete) {
    var xhr = new XMLHttpRequest();
    xhr.onload = this._onAjaxedDocumentLoad.bind(this, onComplete);
    xhr.open('GET', location.href);
    xhr.responseType = 'text';
    xhr.send();
  },

  /**
   * Has the String got spaces in?
   * @param  {String}  x
   * @return {Boolean}
   */
  hasSpaces: function(x) {
    return !!~x.indexOf(' ');
  },

  /**
   * Iterator method which routes each element in the document to the appropriate processor based on it's node type
   * @param  {HTMLElement}  el
   * @param  {String} phase  "open" or "close" representing whether we're processing the opening or closing tag for the element
   */
  processNodeByType: function(el, phase) {
    var lookup = this.NODE_TYPES;
    var typeName = lookup[el.nodeType];
    var nodeType = this[typeName];

    if(nodeType) {
      nodeType[phase](el, typeName);
    }
  },

  /**
   * Recursively apply the iterator to el, it's children and their descendents
   * @param  {HTMLElement}  el
   * @param  {Function}     iterator
   */
  processElement: function(el, iterator) {
    iterator.call(this, el, 'opening');
    if(el.childNodes.length) {
      this.depth++;
      this._each(el.childNodes, function(child) {
        this.processElement.call(this, child, iterator);
      }.bind(this));
      this.depth--;
    }
    iterator.call(this, el, 'closing');
  },

  /**
   * Map using iterator, el's attributes and values
   * @param  {HTMLElement}  el
   * @param  {Function}     iterator  params are name:String, value:String, isEmpty:Boolean, hasSpaces:Boolean
   * @return {Array}
   */
  processAttrs: function(el, iterator) {
    this._each(el.attributes, function(attr) {
      var value = attr.value;
      iterator(attr.name, value, value.length === 0, this.hasSpaces(value));
    }.bind(this));
  },

  /**
   * Iterate over every member of xs, calling f with the arguments: member, i, xs
   * @param  {Array} xs
   * @param  {Function} f
   * @return {Array} xs
   * @private
   */
  _each: function(xs, f) {
    var i = 0;
    var len = xs.length;

    while (i < len) {
      f(xs[i], i++, xs);
    }
    return xs;
  }

});
