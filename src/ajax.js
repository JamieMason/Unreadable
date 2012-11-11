function ajax(url, done) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function(e) {
    var doc = document.implementation.createHTMLDocument('fullPage');
    doc.documentElement.innerHTML = this.responseText;
    return done(doc);
  };
  xhr.open('GET', url);
  xhr.responseType = 'text';
  return xhr.send();
}
