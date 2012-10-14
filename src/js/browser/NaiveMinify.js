/**
 * @fileOverview
 * @author Jamie Mason, <a href="http://twitter.com/gotnosugarbaby">@GotNoSugarBaby</a>, <a href="https://github.com/JamieMason">https://github.com/JamieMason</a>
 */
/**
 * @class    NaiveMinify
 * @extends  TreeCrawler
 */
var NaiveMinify;
NaiveMinify = (function(superclass){
  var prototype = extend$((import$(NaiveMinify, superclass).displayName = 'NaiveMinify', NaiveMinify), superclass).prototype, constructor = NaiveMinify;
  /**
   * @see TreeCrawler#reset
   * @memberOf NaiveMinify.prototype
   */
  prototype.reset = function(){
    superclass.prototype.reset.call(this);
    return this.output = [];
  };
  /**
   * @param  {String}  x
   * @return {Boolean}
   * @static
   */;
  NaiveMinify.isFormattingWhitespace = function(x){
    return x !== ' ' && x.search(/\S/) === -1;
  };
  NaiveMinify.trim = function(x){
    var i;
    x = x.replace(/^\s\s*/, '');
    i = x.length;
    do {
      i;
    } while (/\s/.test(x.charAt(--i)));
    return x.slice(0, i + 1);
  };
  prototype.ELEMENT_NODE = {
    /**
     *
     * @return {String}
     * @see TreeCrawler.prototype#opening
     * @memberOf NaiveMinify.prototype
     */
    opening: function(crawler, el){
      var element, attrs;
      element = el.nodeName.toLowerCase();
      attrs = DocumentSummary.outputAttrs(el);
      attrs = attrs.length !== 0 ? ' ' + attrs.join(' ') : '';
      return crawler.output.push("<" + element + attrs + ">");
    }
    /**
     *
     * @return {String}
     * @see TreeCrawler.prototype#closing
     * @memberOf NaiveMinify.prototype
     */,
    closing: function(crawler, el){
      var element;
      element = el.nodeName.toLowerCase();
      return crawler.output.push("</" + element + ">");
    }
  };
  prototype.TEXT_NODE = {
    /**
     *
     * @return {String}
     * @see TreeCrawler.prototype#opening
     * @memberOf NaiveMinify.prototype
     */
    opening: function(crawler, el){
      var value;
      value = el.nodeValue;
      if (!NaiveMinify.isFormattingWhitespace(value)) {
        return crawler.output.push(NaiveMinify.trim(value));
      }
    },
    closing: function(){}
  };
  function NaiveMinify(){
    superclass.apply(this, arguments);
  }
  return NaiveMinify;
}(TreeCrawler));
function extend$(sub, sup){
  function fun(){} fun.prototype = (sub.superclass = sup).prototype;
  (sub.prototype = new fun).constructor = sub;
  if (typeof sup.extended == 'function') sup.extended(sub);
  return sub;
}
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}