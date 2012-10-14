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
   * @see TreeCrawler#reset
   * @memberOf DocumentSummary.prototype
   */
  reset: ->
    super!
    @output = []

  /**
   * Does the String contain one or more spaces?
   * @param  {String} x
   * @return {Boolean}
   * @static
   */
  @hasSpaces = (x) ->
    x.indexOf(' ') isnt -1

  /**
   * Return a list of the element's attributes and values
   * @param  {HTMLElement} el
   * @return {String[]}
   * @static
   */
  @outputAttrs = (el) ->
    for attr in el.attributes
      name = attr.name
      value = attr.value
      if value.length is 0
        name
      else
        if @hasSpaces(value)
          value = '"' + value + '"'
        "#{name}=#{value}"

  ELEMENT_NODE:
    /**
     * Return a more legible summary of the HTML document
     * @return {String}
     * @see TreeCrawler.prototype#process
     * @memberOf DocumentSummary.prototype
     */
    process: (crawler, el) ->
      indentation = ' ' * (crawler.depth * 2)
      element = el.nodeName.toLowerCase!
      attrs = DocumentSummary.outputAttrs(el)
      attrs = if attrs.length isnt 0 then ' ' + attrs.join(' ') else ''
      crawler.output.push("#{indentation}#{element}#{attrs}\n")
