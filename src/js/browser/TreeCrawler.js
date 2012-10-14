/**
 * @fileOverview
 * @author Jamie Mason, <a href="http://twitter.com/gotnosugarbaby">@GotNoSugarBaby</a>, <a href="https://github.com/JamieMason">https://github.com/JamieMason</a>
 */
/**
 * @class TreeCrawler
 */
var TreeCrawler;
TreeCrawler = (function(){
  /** constructor */
  TreeCrawler.displayName = 'TreeCrawler';
  var type, ref$, name, prototype = TreeCrawler.prototype, constructor = TreeCrawler;
  function TreeCrawler(){
    this.reset();
  }
  /**
   * Restore the crawler's default state
   * @memberOf TreeCrawler.prototype
   */
  prototype.reset = function(){
    this.depth = 0;
    return this.output = null;
  };
  /**
   * Start crawling the document
   * @param  {HTMLElement} [el=document.documentElement]
   * @param  {Function}    [iterator=TreeCrawler.processNodeByType]
   * @memberOf TreeCrawler.prototype
   */
  prototype.crawl = function(el, iterator){
    el == null && (el = document.documentElement);
    iterator == null && (iterator = TreeCrawler.processNodeByType);
    this.reset();
    TreeCrawler.processElement.call(this, el, iterator);
  };
  /**
   * Lookup table of node types to node type names
   * @type {Object}
   * @memberOf TreeCrawler.prototype
   */
  prototype.nodeTypes = {
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
  for (type in ref$ = prototype.nodeTypes) {
    name = ref$[type];
    prototype[name] = {
      /**
       * Default no-op element processors at TreeCrawler.prototype.ELEMENT_NODE intended to be overridden
       * @param  {TreeCrawler}  crawler  Instance of TreeCrawler or one of it's subclasses
       * @param  {HTMLElement}  el
       * @param  {String}       type     eg ELEMENT_NODE
       * @memberOf TreeCrawler.prototype
       */
      opening: fn$,
      closing: fn1$
    };
  }
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
    lookup = crawler.nodeTypes;
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
    for (i$ = 0, len$ = (ref$ = children = el.childNodes).length; i$ < len$; ++i$) {
      child = ref$[i$];
      iterator(this, child, 'opening');
      if (child.childNodes.length) {
        this.depth++;
        TreeCrawler.processElement.call(this, child, iterator);
        this.depth--;
      }
      iterator(this, child, 'closing');
    }
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
  return TreeCrawler;
  function fn$(){}
  function fn1$(){}
}());