/**
 * @class    ComputedStyleMinify
 * @extends  TreeCrawler
 */
var DocumentSummary = TreeCrawler.extend({

  /**
   * @see TreeCrawler.reset
   * @memberOf DocumentSummary
   */
  reset: function() {
    this._super();
    this.output = [];
  },

  ELEMENT_NODE_OPEN: function(el) {
    var indentation = new Array((this.depth * 2) + 1).join(' ');
    var element = el.nodeName.toLowerCase();
    var attrs = this.attrsToHtml(el);
    attrs = attrs.length ? ' ' + attrs.join(' ') : ' ';
    this.output.push(indentation + element + attrs + '\n');
  }

});
