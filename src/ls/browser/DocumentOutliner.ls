class DocumentOutliner extends TreeCrawler

  # Prototype
  # --------------------------------------------------
  reset: ->
    super!
    @output = []

  @isEmpty = (string) ->
    string.length is 0

  @hasSpaces = (string) ->
    string.indexOf(' ') isnt -1

  @getAttributesHtml = (el) ->
    for attr in el.attributes
      name = attr.name
      value = attr.value
      if DocumentOutliner.isEmpty(value)
        name
      else
        if DocumentOutliner.hasSpaces(value)
          value = ['"', '"'].join(value)
        [name, value].join('=')

  ELEMENT_NODE:
    process: (crawler, el) ->
      crawler.output.push("#{' ' * (crawler.depth * 2)}#{el.nodeName.toLowerCase()} #{DocumentOutliner.getAttributesHtml(el).join(' ')}")

window.DocumentOutliner = DocumentOutliner
