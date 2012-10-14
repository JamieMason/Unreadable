/**
 * @fileOverview
 * @author Jamie Mason, <a href="http://twitter.com/gotnosugarbaby">@GotNoSugarBaby</a>, <a href="https://github.com/JamieMason">https://github.com/JamieMason</a>
 */
/**
 * @class    DocumentSummary
 * @extends  TreeCrawler
 */
var DocumentSummary;
DocumentSummary = (function(superclass){
  var prototype = extend$((import$(DocumentSummary, superclass).displayName = 'DocumentSummary', DocumentSummary), superclass).prototype, constructor = DocumentSummary;
  /**
   * @see TreeCrawler#reset
   * @memberOf DocumentSummary.prototype
   */
  prototype.reset = function(){
    superclass.prototype.reset.call(this);
    return this.output = [];
  };
  /**
   * Return a list of the element's attributes and values
   * @param  {HTMLElement} el
   * @return {String[]}
   * @static
   */;
  DocumentSummary.outputAttrs = function(el){
    return TreeCrawler.processAttrs(el, function(name, value, isEmpty, hasSpaces){
      if (isEmpty) {
        return name;
      }
      if (hasSpaces) {
        value = "\"" + value + "\"";
      }
      return name + "=" + value;
    });
  };
  prototype.ELEMENT_NODE = {
    /**
     * Return a more legible summary of the HTML document
     * @return {String}
     * @see TreeCrawler.prototype#opening
     * @memberOf DocumentSummary.prototype
     */
    opening: function(crawler, el){
      var indentation, element, attrs;
      indentation = repeatString$(' ', crawler.depth * 2);
      element = el.nodeName.toLowerCase();
      attrs = DocumentSummary.outputAttrs(el);
      attrs = attrs.length !== 0 ? ' ' + attrs.join(' ') : '';
      return crawler.output.push(indentation + "" + element + attrs + "\n");
    },
    closing: function(){}
  };
  function DocumentSummary(){
    superclass.apply(this, arguments);
  }
  return DocumentSummary;
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
function repeatString$(str, n){
  for (var r = ''; n > 0; (n >>= 1) && (str += str)) if (n & 1) r += str;
  return r;
}