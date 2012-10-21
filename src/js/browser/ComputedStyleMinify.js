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
    return this.output = {
      html: [TreeCrawler.getDocType()],
      iScripts: [],
      iStyles: []
    };
  };
  prototype.crawl = function(){
    superclass.prototype.crawl.call(this);
    return this.output = JSON.stringify(this.output);
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
      var nodeName, attrs;
      nodeName = el.nodeName.toLowerCase();
      attrs = DocumentSummary.outputAttrs(el);
      attrs = attrs.length !== 0 ? ' ' + attrs.join(' ') : '';
      crawler.output.html.push("<" + nodeName + attrs + ">");
      if (deepEq$(nodeName, 'style', '===')) {
        return crawler.output.iStyles.push(crawler.output.html.length);
      } else if (nodeName === 'script' && (!el.type || el.type === 'text/javascript') && el.firstChild && el.firstChild.nodeValue) {
        return crawler.output.iScripts.push(crawler.output.html.length);
      }
    },
    closing: function(crawler, el){
      var nodeName;
      nodeName = el.nodeName.toLowerCase();
      if (nodeName.search(/^(body|colgroup|dd|dt|head|html|li|option|p|tbody|td|tfoot|th|thead|tr)$/) === -1 && nodeName.search(/^(img|input|br|hr|frame|area|base|basefont|col|isindex|link|meta|param)$/) === -1) {
        return crawler.output.html.push("</" + nodeName + ">");
      }
    }
  });
  prototype.TEXT_NODE = new ElementProcessor({
    opening: function(crawler, el){
      var value;
      value = el.nodeValue;
      value = value.replace(/^\s+/, ComputedStyleMinify.isInlineElement(el.previousSibling) ? ' ' : '');
      value = value.replace(/\s+$/, ComputedStyleMinify.isInlineElement(el.nextSibling) ? ' ' : '');
      return crawler.output.html.push(value);
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
function deepEq$(x, y, type){
  var toString = {}.toString, hasOwnProperty = {}.hasOwnProperty,
      has = function (obj, key) { return hasOwnProperty.call(obj, key); };
  first = true;
  return eq(x, y, []);
  function eq(a, b, stack) {
    var className, length, size, result, alength, blength, r, key, ref, sizeB;
    if (a == null || b == null) { return a === b; }
    if (a.__placeholder__ || b.__placeholder__) { return true; }
    if (a === b) { return a !== 0 || 1 / a == 1 / b; }
    className = toString.call(a);
    if (toString.call(b) != className) { return false; }
    switch (className) {
      case '[object String]': return a == String(b);
      case '[object Number]':
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        return +a == +b;
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') { return false; }
    length = stack.length;
    while (length--) { if (stack[length] == a) { return true; } }
    stack.push(a);
    size = 0;
    result = true;
    if (className == '[object Array]') {
      alength = a.length;
      blength = b.length;
      if (first) { 
        switch (type) {
        case '===': result = alength === blength; break;
        case '<==': result = alength <= blength; break;
        case '<<=': result = alength < blength; break;
        }
        size = alength;
        first = false;
      } else {
        result = alength === blength;
        size = alength;
      }
      if (result) {
        while (size--) {
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))){ break; }
        }
      }
    } else {
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) {
        return false;
      }
      for (key in a) {
        if (has(a, key)) {
          size++;
          if (!(result = has(b, key) && eq(a[key], b[key], stack))) { break; }
        }
      }
      if (result) {
        sizeB = 0;
        for (key in b) {
          if (has(b, key)) { ++sizeB; }
        }
        if (first) {
          if (type === '<<=') {
            result = size < sizeB;
          } else if (type === '<==') {
            result = size <= sizeB
          } else {
            result = size === sizeB;
          }
        } else {
          first = false;
          result = size === sizeB;
        }
      }
    }
    stack.pop();
    return result;
  }
}