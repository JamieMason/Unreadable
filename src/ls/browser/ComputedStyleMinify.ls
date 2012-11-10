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
      logs: []

  crawl: (done) ->
    _self = @;
    _super = super

    TreeCrawler.getNonJsMarkup((doc) ->
      oldHead = document.getElementsByTagName('head')[0]
      newHead = doc.getElementsByTagName('head')[0]
      oldBody = document.getElementsByTagName('body')[0]
      newBody = doc.getElementsByTagName('body')[0]

      oldHead.parentNode.replaceChild(newHead, oldHead)
      oldBody.parentNode.replaceChild(newBody, oldBody)

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

      if nodeName is 'style'
        crawler.output.iStyles.push(crawler.output.html.length + 1)

      # @FIXME scripts in the head are not having their @types processed correctly
      else if nodeName is 'script' and el.type is 'asterisk/ignore' or el.type is 'text/javascript'
        attrs = attrs.replace(' type=asterisk/ignore', '')
        attrs = attrs.replace(' type=text/javascript', '')

        if el.firstChild and el.firstChild.nodeValue
          crawler.output.iScripts.push(crawler.output.html.length + 1)

      crawler.output.html.push("<#{nodeName}#{attrs}>")

    closing: (crawler, el) ->
      nodeName = el.nodeName.toLowerCase!
      # if closing tag is not optional or forbidden
      # if nodeName.search(/^(body|colgroup|dd|dt|head|html|li|option|tbody|td|tfoot|th|thead|tr)$/) is -1 and nodeName.search(/^(img|input|br|hr|frame|area|base|basefont|col|isindex|link|meta|param)$/) is -1
      #   crawler.output.html.push("</#{nodeName}>")
      crawler.output.html.push("</#{nodeName}>")
  )

  TEXT_NODE: new ElementProcessor(
    opening: (crawler, el) ->
      value = el.nodeValue
      if value.search(/[^ ]/) isnt -1
        value = value.replace(/^\s+/, if ComputedStyleMinify.isInlineElement(el.previousSibling) then ' ' else '')
      crawler.output.html.push(value)
  )