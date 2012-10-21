/**
 * @fileOverview
 * @author Jamie Mason, <a href="http://twitter.com/gotnosugarbaby">@GotNoSugarBaby</a>, <a href="https://github.com/JamieMason">https://github.com/JamieMason</a>
 */
/**
 * @class    ComputedStyleMinify
 * @extends  TreeCrawler
 */
var ComputedStyleMinify;
ComputedStyleMinify = (function(superclass){
  var prototype = extend$((import$(ComputedStyleMinify, superclass).displayName = 'ComputedStyleMinify', ComputedStyleMinify), superclass).prototype, constructor = ComputedStyleMinify;
  /**
   * @extends TreeCrawler.reset
   * @memberOf ComputedStyleMinify
   */
  prototype.reset = function(){
    superclass.prototype.reset.call(this);
    return this.output = [TreeCrawler.getDocType()];
  };
  /**
   * @param  {String}  textNodeValue
   * @return {Boolean}
   * @static
   */;
  ComputedStyleMinify.isFormattingWhitespace = function(textNodeValue){
    return textNodeValue !== ' ' && textNodeValue.search(/\S/) === -1;
  };
  /**
   * @param  {String}  textNodeValue
   * @return {String}
   * @static
   */
  ComputedStyleMinify.trim = function(textNodeValue){
    var i;
    textNodeValue = textNodeValue.replace(/^\s\s*/, '');
    i = textNodeValue.length;
    do {
      i;
    } while (/\s/.test(textNodeValue.charAt(--i)));
    return textNodeValue.slice(0, i + 1);
  };
  ComputedStyleMinify.isInlineElement = function(el){
    return el !== null && window.getComputedStyle(el, null).getPropertyValue('display').indexOf('inline') !== -1;
  };
  prototype.ELEMENT_NODE = new ElementProcessor({
    opening: function(crawler, el){
      var element, attrs;
      element = el.nodeName.toLowerCase();
      attrs = DocumentSummary.outputAttrs(el);
      attrs = attrs.length !== 0 ? ' ' + attrs.join(' ') : '';
      return crawler.output.push("<" + element + attrs + ">");
    },
    closing: function(crawler, el){
      var element;
      element = el.nodeName.toLowerCase();
      if (element.search(/^(body|colgroup|dd|dt|head|html|li|option|p|tbody|td|tfoot|th|thead|tr)$/) === -1 && element.search(/^(img|input|br|hr|frame|area|base|basefont|col|isindex|link|meta|param)$/) === -1) {
        return crawler.output.push("</" + element + ">");
      }
    }
  });
  prototype.TEXT_NODE = new ElementProcessor({
    opening: function(crawler, el){
      var value;
      value = el.nodeValue;
      value = value.replace(/^\s+/, ComputedStyleMinify.isInlineElement(el.previousSibling) ? ' ' : '');
      value = value.replace(/\s+$/, ComputedStyleMinify.isInlineElement(el.nextSibling) ? ' ' : '');
      return crawler.output.push(value);
    }
  });
  function ComputedStyleMinify(){
    superclass.apply(this, arguments);
  }
  return ComputedStyleMinify;
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