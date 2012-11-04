ajax = (url, done) ->
  xhr = new XMLHttpRequest!

  xhr.onload = (e) ->
    doc = document.implementation.createHTMLDocument('fullPage');
    doc.documentElement.innerHTML = this.responseText;
    done(doc)

  xhr.open('GET', url)
  xhr.responseType = 'text'
  xhr.send()
