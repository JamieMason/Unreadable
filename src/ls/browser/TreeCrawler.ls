/**
 * @fileOverview
 * @author Jamie Mason, <a href="http://twitter.com/gotnosugarbaby">@GotNoSugarBaby</a>, <a href="https://github.com/JamieMason">https://github.com/JamieMason</a>
 */

/**
 * @class TreeCrawler
 */
class TreeCrawler

  /** constructor */
  ->
    @reset()

  /**
   * Restore the crawler's default state
   * @memberOf TreeCrawler.prototype
   */
  reset: ->
    @depth = 0
    @output = null

  /**
   * Start crawling the document
   * @param  {HTMLElement} [el=document.documentElement]
   * @param  {Function}    [iterator=TreeCrawler.processNodeByType]
   * @memberOf TreeCrawler.prototype
   */
  crawl: !(el = document.documentElement, iterator = TreeCrawler.processNodeByType) ->
    @reset()
    TreeCrawler.processElement.call(@, el, iterator)

  /**
   * Lookup table of node types to node type names
   * @type {Object}
   * @memberOf TreeCrawler.prototype
   */
  nodeTypes:
    '1'  : 'ELEMENT_NODE'
    '2'  : 'ATTRIBUTE_NODE'
    '3'  : 'TEXT_NODE'
    '4'  : 'CDATA_SECTION_NODE'
    '5'  : 'ENTITY_REFERENCE_NODE'
    '6'  : 'ENTITY_NODE'
    '7'  : 'PROCESSING_INSTRUCTION_NODE'
    '8'  : 'COMMENT_NODE'
    '9'  : 'DOCUMENT_NODE'
    '10' : 'DOCUMENT_TYPE_NODE'
    '11' : 'DOCUMENT_FRAGMENT_NODE'
    '12' : 'NOTATION_NODE'

  for type, name of prototype.nodeTypes
    prototype[name] =
      /**
       * Default no-op element processors at TreeCrawler.prototype.ELEMENT_NODE intended to be overridden
       * @param  {TreeCrawler}  crawler  Instance of TreeCrawler or one of it's subclasses
       * @param  {HTMLElement}  el
       * @param  {String}       type     eg ELEMENT_NODE
       * @memberOf TreeCrawler.prototype
       */
      process: ->

  /**
   * Does the String contain one or more spaces?
   * @param  {String} x
   * @return {Boolean}
   * @static
   */
  @hasSpaces = (x) ->
    x.indexOf(' ') isnt -1

  /**
   * Iterator method which routes each element in the document to the appropriate processor based on it's node type
   * @param  {TreeCrawler}  crawler  Instance of TreeCrawler or one of it's subclasses
   * @param  {HTMLElement}  el
   * @static
   */
  @processNodeByType = !(crawler, el) ->
    lookup = crawler.nodeTypes
    typeName = lookup[el.nodeType]
    nodeType.process(crawler, el, typeName) if nodeType = crawler[typeName]

  /**
   * Recursively apply the iterator to el, it's children and their descendents
   * @param  {HTMLElement}  el
   * @param  {Function}     iterator
   * @static
   */
  @processElement = !(el, iterator) ->
    for child in children = el.childNodes
      iterator(@, child)
      if child.childNodes.length
        @depth++
        TreeCrawler.processElement.call(@, child, iterator)
        @depth--

  /**
   * Map using iterator, el's attributes and values
   * @param  {HTMLElement}  el
   * @param  {Function}     iterator  params are name:String, value:String, isEmpty:Boolean, hasSpaces:Boolean
   * @return {Array}
   * @static
   */
  @processAttrs = (el, iterator) ->
    for attr in el.attributes
      value = attr.value
      iterator(attr.name, value, value.length is 0, @hasSpaces(value))
