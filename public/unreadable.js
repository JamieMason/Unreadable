var unreadable  =  {};

// wrap window.getComputedStyle so it can be mocked in tests
unreadable.getComputedStyle = function (element, pseudoElement) {
  return window.getComputedStyle(element, pseudoElement || null);
};

// wrap XMLHttpRequest so it can be mocked in tests
unreadable.xhr = function (url, handler) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    handler(xhr.responseText);
  };
  xhr.open('GET', url);
  xhr.responseType = 'text';
  xhr.send();
};
