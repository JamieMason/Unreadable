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
  reset: (doc) ->
    super!
    @output =
      html: [TreeCrawler.getDocType(doc) + '\n']
      iScripts: []
      iStyles: []

  crawl: (done) ->
    _self = @;
    _super = super

    TreeCrawler.getNonJsMarkup((doc) ->
      document.head = doc.head
      document.body = doc.body

      _super.call(_self, (output) ->
        _self.output = JSON.stringify(output)
        done(_self.output)
      )
    )

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
    if el is null
      return false
    computedStyle = window.getComputedStyle(el, null)
    if !computedStyle
      return false
    computedStyle.getPropertyValue('display').indexOf('inline') isnt -1

  ELEMENT_NODE: new ElementProcessor(
    opening: (crawler, el) ->
      nodeName = el.nodeName.toLowerCase!
      attrs = DocumentSummary.outputAttrs(el)
      attrs = if attrs.length isnt 0 then ' ' + attrs.join(' ') else ''
      # store the line number of the text content of this inline style block
      if nodeName === 'style'
        crawler.output.iStyles.push(crawler.output.html.length + 1)
      else if nodeName is 'script' and el.type is 'asterisk/ignore' and el.firstChild and el.firstChild.nodeValue
        crawler.output.iScripts.push(crawler.output.html.length + 1)
        attrs = attrs.replace(' type=asterisk/ignore', '')
      crawler.output.html.push("<#{nodeName}#{attrs}>")

    closing: (crawler, el) ->
      nodeName = el.nodeName.toLowerCase!
      # if closing tag is not optional or forbidden
      if nodeName.search(/^(body|colgroup|dd|dt|head|html|li|option|p|tbody|td|tfoot|th|thead|tr)$/) is -1 and nodeName.search(/^(img|input|br|hr|frame|area|base|basefont|col|isindex|link|meta|param)$/) is -1
        crawler.output.html.push("</#{nodeName}>")
  )

  TEXT_NODE: new ElementProcessor(
    opening: (crawler, el) ->
      value = el.nodeValue
      value = value.replace(/^\s+/, if ComputedStyleMinify.isInlineElement(el.previousSibling) then ' ' else '')
      value = value.replace(/\s+$/, if ComputedStyleMinify.isInlineElement(el.nextSibling) then ' ' else '')
      crawler.output.html.push(value)
  )
