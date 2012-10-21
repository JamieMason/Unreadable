/**
 * @fileOverview
 * @author Jamie Mason, <a href="http://twitter.com/gotnosugarbaby">@GotNoSugarBaby</a>, <a href="https://github.com/JamieMason">https://github.com/JamieMason</a>
 */

/**
 * @class    DocumentSummary
 * @extends  TreeCrawler
 */
class DocumentSummary extends TreeCrawler

  /**
   * @see TreeCrawler.reset
   * @memberOf DocumentSummary
   */
  reset: ->
    super!
    @output = []

  /**
   * Return a list of the element's attributes and values
   * @param  {HTMLElement} el
   * @return {String[]}
   * @static
   */
  @outputAttrs = (el) ->
    TreeCrawler.processAttrs(el, (name, value, isEmpty, hasSpaces) ->
      if isEmpty then return name
      if hasSpaces then value = "\"#{value}\""
      "#{name}=#{value}"
    )

  ELEMENT_NODE: new ElementProcessor(
    opening: (crawler, el) ->
      indentation = ' ' * (crawler.depth * 2)
      element = el.nodeName.toLowerCase!
      attrs = DocumentSummary.outputAttrs(el)
      attrs = if attrs.length isnt 0 then ' ' + attrs.join(' ') else ''
      crawler.output.push("#{indentation}#{element}#{attrs}\n")
  )
