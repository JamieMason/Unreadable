/**
 * @class TreeCrawler
 */
var TreeCrawler = Class.extend({

  /**
   * Lookup table of node types to node type names
   *
   * @type {Object}
   * @memberOf TreeCrawler.prototype
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
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  ELEMENT_NODE_OPEN: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  ELEMENT_NODE_CLOSE: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  ATTRIBUTE_NODE_OPEN: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  ATTRIBUTE_NODE_CLOSE: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  TEXT_NODE_OPEN: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  TEXT_NODE_CLOSE: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  CDATA_SECTION_NODE_OPEN: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  CDATA_SECTION_NODE_CLOSE: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  ENTITY_REFERENCE_NODE_OPEN: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  ENTITY_REFERENCE_NODE_CLOSE: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  ENTITY_NODE_OPEN: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  ENTITY_NODE_CLOSE: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  PROCESSING_INSTRUCTION_NODE_OPEN: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  PROCESSING_INSTRUCTION_NODE_CLOSE: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  COMMENT_NODE_OPEN: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  COMMENT_NODE_CLOSE: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  DOCUMENT_NODE_OPEN: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  DOCUMENT_NODE_CLOSE: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  DOCUMENT_TYPE_NODE_OPEN: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  DOCUMENT_TYPE_NODE_CLOSE: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  DOCUMENT_FRAGMENT_NODE_OPEN: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  DOCUMENT_FRAGMENT_NODE_CLOSE: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  NOTATION_NODE_OPEN: function(){},

  /**
   * @param {HTMLElement} el
   * @memberOf TreeCrawler.prototype
   */
  NOTATION_NODE_CLOSE: function(){},

  /**
   * Restore the crawler's default state
   *
   * @memberOf TreeCrawler.prototype
   */
  reset: function () {
    this.depth = 0;
    this.output = null;
  },

  /**
   * Process the document
   *
   * @param  {Function}  onComplete  This function is passed the resulting output of processing the document
   * @memberOf TreeCrawler.prototype
   */
  crawl: function(onComplete) {
    this.iterator = this.processNodeByType;
    this.reset();
    this.processElement(document.documentElement);
    onComplete(this.output = JSON.stringify(this.output));
  },

  /**
   * Get the markup for the doctype declaration
   *
   * @return {String}
   * @memberOf TreeCrawler.prototype
   */
  getDocType: function() {
    var element = document.doctype || { name: 'html' };
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
   * Get all <script>s which would be interpreted as JavaScript (as opposed to templates etc)
   *
   * @param  {HTMLDocument} doc
   * @return {HTMLScriptElement[]}
   * @memberOf TreeCrawler.prototype
   */
  getScripts: function(doc) {
    return Array.prototype.slice.call(doc.querySelectorAll('script:not([type]),script[type="text/javascript"]'));
  },

  /**
   * Create an entire new HTML Document and populate it's HTML
   *
   * @param  {String} html
   * @return {HTMLDocument}
   * @memberOf TreeCrawler.prototype
   */
  createDocument: function(html){
    var doc = document.implementation.createHTMLDocument('no-js');
    doc.documentElement.innerHTML = html;
    return doc;
  },

  /**
   * XHR callback for TreeCrawler.getNonJsMarkup
   *
   * @param {XMLHTTPRequest} xhr
   * @param {Function} onComplete
   * @param {Object} evnt
   * @memberOf TreeCrawler.prototype
   * @private
   */
  _onAjaxedDocumentLoad: function(xhr, onComplete, evnt) {
    var doc = this.createDocument(xhr.responseText);
    this.getScripts(doc).forEach(function(el) {
      el.setAttribute('type', 'asterisk/ignore');
    });
    onComplete(doc);
  },

  /**
   * XHR the HTMLDocument in order to get it's original HTML before any JavaScript has augmented it
   *
   * @param  {Function} onComplete
   * @memberOf TreeCrawler.prototype
   */
  getNonJsMarkup: function (onComplete) {
    var xhr = new XMLHttpRequest();
    xhr.onload = this._onAjaxedDocumentLoad.bind(this, xhr, onComplete);
    xhr.open('GET', location.href);
    xhr.responseType = 'text';
    xhr.send();
  },

  /**
   * Has the String got spaces in?
   *
   * @param  {String} string
   * @return {Boolean}
   * @memberOf TreeCrawler.prototype
   */
  hasSpaces: function(string) {
    return !!~string.indexOf(' ');
  },

  /**
   * Iterator method which routes each element in the document to the appropriate processor based on it's node type
   *
   * @param  {HTMLElement}  el
   * @param  {String} phase  "OPEN" or "CLOSE" representing whether we're processing the opening or closing tag for the element
   * @memberOf TreeCrawler.prototype
   */
  processNodeByType: function(el, phase) {
    this[this.NODE_TYPES[el.nodeType] + '_' + phase](el);
  },

  /**
   * Recursively process el, it's children and their descendents
   *
   * @param  {HTMLElement}  el
   * @memberOf TreeCrawler.prototype
   */
  processElement: function(el) {
    this.iterator(el, 'OPEN');
    if(el.childNodes.length) {
      this.depth++;
      this._each(el.childNodes, function(child) {
        this.processElement(child);
      }.bind(this));
      this.depth--;
    }
    this.iterator(el, 'CLOSE');
  },

  /**
   * Map using iterator, el's attributes and values
   *
   * @param  {HTMLElement}  el
   * @param  {Function}     iterator  params are name:String, value:String, isEmpty:Boolean, hasSpaces:Boolean
   * @return {Array}
   * @memberOf TreeCrawler.prototype
   */
  processAttrs: function(el, iterator) {
    return this._each(el.attributes, function(attr) {
      var value = attr.value;
      return iterator(attr.name, value, value.length === 0, this.hasSpaces(value));
    }.bind(this));
  },

  /**
   * Get the HTML markup for an attribute, omitting quotes etc as necessary
   *
   * @param  {String}  name
   * @param  {Mixed}  value
   * @param  {Boolean} isEmpty
   * @param  {Boolean} hasSpaces
   * @return {String}
   * @memberOf TreeCrawler.prototype
   */
  attrToHtml: function(name, value, isEmpty, hasSpaces) {
    if(isEmpty) {
      return name;
    }
    if(hasSpaces) {
      value = '"' + value + '"';
    }
    return name + '=' + value;
  },

  /**
   * Get the HTML markup for an element node's attributes
   *
   * @param  {HTMLElement} el
   * @return {String}
   * @memberOf TreeCrawler.prototype
   */
  attrsToHtml: function(el) {
    return this.processAttrs(el, this.attrToHtml);
  },

  /**
   * Iterate over every member of xs, calling f with the arguments: member, i, xs
   *
   * @param  {Array} xs
   * @param  {Function} f
   * @return {Array}
   * @private
   * @memberOf TreeCrawler.prototype
   */
  _each: function(xs, f) {
    var i = 0;
    var len = xs.length;
    var ys = [];

    while (i < len) {
      ys.push(f(xs[i], i++, xs));
    }

    return ys;
  }

});
