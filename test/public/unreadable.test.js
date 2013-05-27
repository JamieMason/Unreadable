describe('unreadable', function() {
  it('is a namespace', function() {
    expect(unreadable).toBeObject();
  });
});

describe('unreadable.xhr', function() {
  describe('when supplied a same domain URL and handler', function() {
    it('returns the text contents of that file', function() {
      var response = -1;

      runs(function() {
        unreadable.xhr(document.location.href, function(str) {
          response = str;
        });
      });

      waitsFor(function() {
        return response !== -1;
      }, 'xhr did not respond', 10000);

      runs(function() {
        expect(response).toBeNonEmptyString();
      });
    });
  });
});
