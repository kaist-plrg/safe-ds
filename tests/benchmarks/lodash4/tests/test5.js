QUnit.module('lodash.add');

(function() {
  QUnit.test('should add two numbers', function(assert) {
    assert.expect(3);

    assert.strictEqual(_.add(6, 4), 10);
    assert.strictEqual(_.add(-6, 4), -2);
    assert.strictEqual(_.add(-6, -4), -10);
  });

  QUnit.test('should not coerce arguments to numbers', function(assert) {
    assert.expect(2);

    assert.strictEqual(_.add('6', '4'), '64');
    assert.strictEqual(_.add('x', 'y'), 'xy');
  });
}());