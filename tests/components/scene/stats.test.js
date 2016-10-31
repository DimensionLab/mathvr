/* global assert, setup, suite, teardown, test */
suite('stats', function () {

  setup(function (done) {
    var el = this.sceneEl = document.createElement('a-scene');
    el.setAttribute('stats', '');
    document.body.appendChild(el);
    done();
  });

  teardown(function () {
    var el = this.sceneEl;
    el.parentNode.removeChild(el);
  });

  test('Stats are not created when query string "stats" is "false"', function () {
    assert.equal(document.querySelector('.rs-base'), null);
  });
});
