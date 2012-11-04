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
var TreeCrawler;
TreeCrawler = (function(){
  TreeCrawler.displayName = 'TreeCrawler';
  var type, ref$, name, prototype = TreeCrawler.prototype, constructor = TreeCrawler;
  /**
   * Restore the crawler's default state
   * @memberOf TreeCrawler
   */
  prototype.reset = function(doc){
    this.depth = 0;
    return this.output = null;
  };
  /**
   * Start crawling the document
   * @param  {HTMLElement} [el=document.documentElement]
   * @param  {Function}    [iterator=TreeCrawler.processNodeByType]
   * @memberOf TreeCrawler
   */
  prototype.crawl = function(done, doc, iterator){
    doc == null && (doc = document);
    iterator == null && (iterator = TreeCrawler.processNodeByType);
    this.reset(doc);
    TreeCrawler.processElement.call(this, doc.documentElement, iterator);
    done(this.output);
  };
  /**
   * Lookup table of node types to node type names
   * @type {Object}
   * @memberOf TreeCrawler
   */
  prototype.NODE_TYPES = {
    '1': 'ELEMENT_NODE',
    '2': 'ATTRIBUTE_NODE',
    '3': 'TEXT_NODE',
    '4': 'CDATA_SECTION_NODE',
    '5': 'ENTITY_REFERENCE_NODE',
    '6': 'ENTITY_NODE',
    '7': 'PROCESSING_INSTRUCTION_NODE',
    '8': 'COMMENT_NODE',
    '9': 'DOCUMENT_NODE',
    '10': 'DOCUMENT_TYPE_NODE',
    '11': 'DOCUMENT_FRAGMENT_NODE',
    '12': 'NOTATION_NODE'
  };
  for (type in ref$ = prototype.NODE_TYPES) {
    name = ref$[type];
    prototype[name] = new ElementProcessor();
  }
  TreeCrawler.getDocType = function(doc){
    var node, extra;
    node = doc.doctype || {
      name: 'html'
    };
    extra = '';
    extra += node.publicId ? " PUBLIC " + node.publicId : '';
    extra += !node.publicId && node.systemId ? ' SYSTEM' : '';
    extra += node.systemId ? " " + node.systemId : '';
    return ("<!DOCTYPE " + node.name) + extra + '>';
  };
  TreeCrawler.getNonJsMarkup = function(done){
    var xhr;
    xhr = new XMLHttpRequest();
    xhr.onload = function(e){
      var doc;
      doc = document.implementation.createHTMLDocument('no-js');
      doc.documentElement.innerHTML = this.responseText;
      Array.prototype.slice.call(doc.querySelectorAll('script:not([type]),script[type="text/javascript"]')).forEach(function(el){
        return el.setAttribute('type', 'asterisk/ignore');
      });
      return done(doc);
    };
    xhr.open('GET', window.location.href);
    xhr.responseType = 'text';
    return xhr.send();
  };
  /**
   * Does the String contain one or more spaces?
   * @param  {String} x
   * @return {Boolean}
   * @static
   */
  TreeCrawler.hasSpaces = function(x){
    return x.indexOf(' ') !== -1;
  };
  /**
   * Iterator method which routes each element in the document to the appropriate processor based on it's node type
   * @param  {TreeCrawler}  crawler  Instance of TreeCrawler or one of it's subclasses
   * @param  {HTMLElement}  el
   * @static
   */
  TreeCrawler.processNodeByType = function(crawler, el, phase){
    var lookup, typeName, nodeType;
    lookup = crawler.NODE_TYPES;
    typeName = lookup[el.nodeType];
    if (nodeType = crawler[typeName]) {
      nodeType[phase](crawler, el, typeName);
    }
  };
  /**
   * Recursively apply the iterator to el, it's children and their descendents
   * @param  {HTMLElement}  el
   * @param  {Function}     iterator
   * @static
   */
  TreeCrawler.processElement = function(el, iterator){
    var i$, ref$, children, len$, child;
    iterator(this, el, 'opening');
    if (el.childNodes.length) {
      this.depth++;
      for (i$ = 0, len$ = (ref$ = children = el.childNodes).length; i$ < len$; ++i$) {
        child = ref$[i$];
        TreeCrawler.processElement.call(this, child, iterator);
      }
      this.depth--;
    }
    iterator(this, el, 'closing');
  };
  /**
   * Map using iterator, el's attributes and values
   * @param  {HTMLElement}  el
   * @param  {Function}     iterator  params are name:String, value:String, isEmpty:Boolean, hasSpaces:Boolean
   * @return {Array}
   * @static
   */
  TreeCrawler.processAttrs = function(el, iterator){
    var i$, ref$, len$, attr, value, results$ = [];
    for (i$ = 0, len$ = (ref$ = el.attributes).length; i$ < len$; ++i$) {
      attr = ref$[i$];
      value = attr.value;
      results$.push(iterator(attr.name, value, value.length === 0, this.hasSpaces(value)));
    }
    return results$;
  };
  function TreeCrawler(){}
  return TreeCrawler;
}());