/**
 * @fileOverview
 * @author Jamie Mason, <a href="http://twitter.com/gotnosugarbaby">@GotNoSugarBaby</a>, <a href="https://github.com/JamieMason">https://github.com/JamieMason</a>
 */

/**
 * @class    ElementProcessor
 */
class ElementProcessor

  /**
   * @constructor
   * @param  {Object}  opts
   */
  (opts = {}) ->
    if opts.opening then @opening = opts.opening
    if opts.closing then @closing = opts.closing

  /**
   * Default no-op element processor intended to be overridden
   * @param  {TreeCrawler}  crawler  Instance of TreeCrawler or one of it's subclasses
   * @param  {HTMLElement}  el
   * @param  {String}       type     "ELEMENT_NODE", "COMMENT_NODE" etc
   * @memberOf TreeCrawler
   */
  opening: (crawler, el, type) ->

  /**
   * Default no-op element processor intended to be overridden
   * @param  {TreeCrawler}  crawler  Instance of TreeCrawler or one of it's subclasses
   * @param  {HTMLElement}  el
   * @param  {String}       type     "ELEMENT_NODE", "COMMENT_NODE" etc
   * @memberOf TreeCrawler
   */
  closing: (crawler, el, type) ->
