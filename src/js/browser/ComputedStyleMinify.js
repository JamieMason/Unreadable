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
  prototype.reset = function(doc){
    superclass.prototype.reset.call(this);
    return this.output = {
      html: [TreeCrawler.getDocType(doc) + '\n'],
      iScripts: [],
      iStyles: [],
      logs: []
    };
  };
  prototype.crawl = function(done){
    var _self, _super;
    _self = this;
    _super = superclass.prototype.crawl;
    return TreeCrawler.getNonJsMarkup(function(doc){
      var oldHead, newHead, oldBody, newBody;
      oldHead = document.getElementsByTagName('head')[0];
      newHead = doc.getElementsByTagName('head')[0];
      oldBody = document.getElementsByTagName('body')[0];
      newBody = doc.getElementsByTagName('body')[0];
      oldHead.parentNode.replaceChild(newHead, oldHead);
      oldBody.parentNode.replaceChild(newBody, oldBody);
      return _super.call(_self, function(output){
        _self.output = JSON.stringify(output);
        return done(_self.output);
      });
    });
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
    var computedStyle;
    if (el === null) {
      return false;
    }
    computedStyle = window.getComputedStyle(el, null);
    if (!computedStyle) {
      return false;
    }
    return computedStyle.getPropertyValue('display').indexOf('inline') !== -1;
  };
  prototype.ELEMENT_NODE = new ElementProcessor({
    opening: function(crawler, el){
      var nodeName, attrs;
      nodeName = el.nodeName.toLowerCase();
      attrs = DocumentSummary.outputAttrs(el);
      attrs = attrs.length !== 0 ? ' ' + attrs.join(' ') : '';
      if (nodeName === 'style') {
        crawler.output.iStyles.push(crawler.output.html.length + 1);
      } else if (nodeName === 'script' && el.type === 'asterisk/ignore' || el.type === 'text/javascript') {
        attrs = attrs.replace(' type=asterisk/ignore', '');
        attrs = attrs.replace(' type=text/javascript', '');
        if (el.firstChild && el.firstChild.nodeValue) {
          crawler.output.iScripts.push(crawler.output.html.length + 1);
        }
      }
      return crawler.output.html.push("<" + nodeName + attrs + ">");
    },
    closing: function(crawler, el){
      var nodeName;
      nodeName = el.nodeName.toLowerCase();
      return crawler.output.html.push("</" + nodeName + ">");
    }
  });
  prototype.TEXT_NODE = new ElementProcessor({
    opening: function(crawler, el){
      var value;
      value = el.nodeValue;
      if (value.search(/[^ ]/) !== -1) {
        value = value.replace(/^\s+/, ComputedStyleMinify.isInlineElement(el.previousSibling) ? ' ' : '');
      }
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