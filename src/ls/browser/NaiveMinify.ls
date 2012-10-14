/**
 * @fileOverview
 * @author Jamie Mason, <a href="http://twitter.com/gotnosugarbaby">@GotNoSugarBaby</a>, <a href="https://github.com/JamieMason">https://github.com/JamieMason</a>
 */

/**
 * @class    NaiveMinify
 * @extends  TreeCrawler
 */
class NaiveMinify extends TreeCrawler

  /**
   * @see TreeCrawler#reset
   * @memberOf NaiveMinify.prototype
   */
  reset: ->
    super!
    @output = []

  /**
   * @param  {String}  x
   * @return {Boolean}
   * @static
   */
  @isFormattingWhitespace = (x) ->
    x isnt ' ' and x.search(/\S/) is -1

  @trim = (x) ->
    x = x.replace(/^\s\s*/, '')
    i = x.length
    do
      i
    while /\s/.test(x.charAt(--i))
    x.slice(0, i + 1)

  ELEMENT_NODE:
    /**
     *
     * @return {String}
     * @see TreeCrawler.prototype#opening
     * @memberOf NaiveMinify.prototype
     */
    opening: (crawler, el) ->
      element = el.nodeName.toLowerCase!
      attrs = DocumentSummary.outputAttrs(el)
      attrs = if attrs.length isnt 0 then ' ' + attrs.join(' ') else ''
      crawler.output.push("<#{element}#{attrs}>")

    /**
     *
     * @return {String}
     * @see TreeCrawler.prototype#closing
     * @memberOf NaiveMinify.prototype
     */
    closing: (crawler, el) ->
      element = el.nodeName.toLowerCase!
      crawler.output.push("</#{element}>")

  TEXT_NODE:
    /**
     *
     * @return {String}
     * @see TreeCrawler.prototype#opening
     * @memberOf NaiveMinify.prototype
     */
    opening: (crawler, el) ->
      value = el.nodeValue
      if !NaiveMinify.isFormattingWhitespace(value)
        crawler.output.push(NaiveMinify.trim(value))

    closing: ->
