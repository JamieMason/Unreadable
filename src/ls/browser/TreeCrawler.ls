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
class TreeCrawler

  /**
   * Restore the crawler's default state
   * @memberOf TreeCrawler
   */
  reset: (doc) ->
    @depth = 0
    @output = null

  /**
   * Start crawling the document
   * @param  {HTMLElement} [el=document.documentElement]
   * @param  {Function}    [iterator=TreeCrawler.processNodeByType]
   * @memberOf TreeCrawler
   */
  crawl: !(done, doc = document, iterator = TreeCrawler.processNodeByType) ->
    @reset(doc)
    TreeCrawler.processElement.call(@, doc.documentElement, iterator)
    done(@output)

  /**
   * Lookup table of node types to node type names
   * @type {Object}
   * @memberOf TreeCrawler
   */
  NODE_TYPES:
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

  for type, name of prototype.NODE_TYPES
    prototype[name] = new ElementProcessor()

  @getDocType = (doc) ->
    node = doc.doctype or name: 'html'
    extra = ''
    extra += (if node.publicId then " PUBLIC #{node.publicId}" else '')
    extra += (if !node.publicId and node.systemId then ' SYSTEM' else '')
    extra += (if node.systemId then " #{node.systemId}" else '')
    "<!DOCTYPE #{node.name}" + extra + '>'

  @getNonJsMarkup = (done) ->
    xhr = new XMLHttpRequest!

    xhr.onload = (e) ->
      doc = document.implementation.createHTMLDocument('no-js')
      doc.documentElement.innerHTML = this.responseText
      Array.prototype.slice.call(doc.querySelectorAll('script:not([type]),script[type="text/javascript"]')).forEach((el) ->
        el.setAttribute('type', 'asterisk/ignore')
      )
      done(doc)

    xhr.open('GET', window.location.href)
    xhr.responseType = 'text'
    xhr.send()

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
  @processNodeByType = !(crawler, el, phase) ->
    lookup = crawler.NODE_TYPES
    typeName = lookup[el.nodeType]
    nodeType[phase](crawler, el, typeName) if nodeType = crawler[typeName]

  /**
   * Recursively apply the iterator to el, it's children and their descendents
   * @param  {HTMLElement}  el
   * @param  {Function}     iterator
   * @static
   */
  @processElement = !(el, iterator) ->
    iterator(@, el, 'opening')
    if el.childNodes.length
      @depth++
      for child in children = el.childNodes
        TreeCrawler.processElement.call(@, child, iterator)
      @depth--
    iterator(@, el, 'closing')

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
