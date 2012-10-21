/**
 * @fileOverview
 * @author Jamie Mason, <a href="http://twitter.com/gotnosugarbaby">@GotNoSugarBaby</a>, <a href="https://github.com/JamieMason">https://github.com/JamieMason</a>
 */

/**
 * @class    ComputedStyleMinify
 * @extends  TreeCrawler
 */
class ComputedStyleMinify extends TreeCrawler

  /**
   * @extends TreeCrawler.reset
   * @memberOf ComputedStyleMinify
   */
  reset: ->
    super!
    @output = [TreeCrawler.getDocType()]

  /**
   * @param  {String}  textNodeValue
   * @return {Boolean}
   * @static
   */
  @isFormattingWhitespace = (textNodeValue) ->
    textNodeValue isnt ' ' and textNodeValue.search(/\S/) is -1

  /**
   * @param  {String}  textNodeValue
   * @return {String}
   * @static
   */
  @trim = (textNodeValue) ->
    textNodeValue = textNodeValue.replace(/^\s\s*/, '')
    i = textNodeValue.length
    do
      i
    while /\s/.test(textNodeValue.charAt(--i))
    textNodeValue.slice(0, i + 1)

  @isInlineElement = (el) ->
    el isnt null and window.getComputedStyle(el, null).getPropertyValue('display').indexOf('inline') isnt -1

  ELEMENT_NODE: new ElementProcessor(
    opening: (crawler, el) ->
      element = el.nodeName.toLowerCase!
      attrs = DocumentSummary.outputAttrs(el)
      attrs = if attrs.length isnt 0 then ' ' + attrs.join(' ') else ''
      crawler.output.push("<#{element}#{attrs}>")

    closing: (crawler, el) ->
      element = el.nodeName.toLowerCase!
      # if closing tag is not optional or forbidden
      if element.search(/^(body|colgroup|dd|dt|head|html|li|option|p|tbody|td|tfoot|th|thead|tr)$/) is -1 and element.search(/^(img|input|br|hr|frame|area|base|basefont|col|isindex|link|meta|param)$/) is -1
        crawler.output.push("</#{element}>")
  )

  # DOCUMENT_NODE: prototype.ELEMENT_NODE

  TEXT_NODE: new ElementProcessor(
    opening: (crawler, el) ->
      value = el.nodeValue
      value = value.replace(/^\s+/, if ComputedStyleMinify.isInlineElement(el.previousSibling) then ' ' else '')
      value = value.replace(/\s+$/, if ComputedStyleMinify.isInlineElement(el.nextSibling) then ' ' else '')
      crawler.output.push(value)
  )
