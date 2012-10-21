/**
 * @fileOverview
 * @author Jamie Mason, <a href="http://twitter.com/gotnosugarbaby">@GotNoSugarBaby</a>, <a href="https://github.com/JamieMason">https://github.com/JamieMason</a>
 */
/**
 * @class    ElementProcessor
 */
var ElementProcessor;
ElementProcessor = (function(){
  /**
   * @constructor
   * @param  {Object}  opts
   */
  ElementProcessor.displayName = 'ElementProcessor';
  var prototype = ElementProcessor.prototype, constructor = ElementProcessor;
  function ElementProcessor(opts){
    opts == null && (opts = {});
    if (opts.opening) {
      this.opening = opts.opening;
    }
    if (opts.closing) {
      this.closing = opts.closing;
    }
  }
  /**
   * Default no-op element processor intended to be overridden
   * @param  {TreeCrawler}  crawler  Instance of TreeCrawler or one of it's subclasses
   * @param  {HTMLElement}  el
   * @param  {String}       type     "ELEMENT_NODE", "COMMENT_NODE" etc
   * @memberOf TreeCrawler
   */
  prototype.opening = function(crawler, el, type){};
  /**
   * Default no-op element processor intended to be overridden
   * @param  {TreeCrawler}  crawler  Instance of TreeCrawler or one of it's subclasses
   * @param  {HTMLElement}  el
   * @param  {String}       type     "ELEMENT_NODE", "COMMENT_NODE" etc
   * @memberOf TreeCrawler
   */
  prototype.closing = function(crawler, el, type){};
  return ElementProcessor;
}());