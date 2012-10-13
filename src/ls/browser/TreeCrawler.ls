class TreeCrawler

  # Constructor
  # --------------------------------------------------
  ->
    @reset()

  # Prototype
  # --------------------------------------------------
  reset: ->
    @depth = 0
    @output = null

  crawl: !(el = document.documentElement, iterator = TreeCrawler.processNodeByType) ->
    @reset()
    TreeCrawler.each.call(@, el, iterator)

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

  # extend nodeTypes
  for type, name of prototype.nodeTypes
    prototype.nodeTypes[name] =
      process: ->

  # Statics
  # --------------------------------------------------
  @processNodeByType = !(crawler, el) ->
    nodeTypes = crawler.nodeTypes
    nodeType.process(crawler, el) if nodeType = nodeTypes[nodeTypes[el.nodeType]]

  @each = !(el, iterator) ->
    for child in children = el.childNodes
      iterator(@, child)
      if child.childNodes.length
        @depth++
        TreeCrawler.each.call(@, child, iterator)
        @depth--

window.TreeCrawler = TreeCrawler
