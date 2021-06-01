QUnit.module('lodash.isNil');
(function () {
    QUnit.test('should return `true` for nullish values', function (assert) {
        assert.expect(3);
        assert.strictEqual(_.isNil(null), __bool_top__);
        assert.strictEqual(_.isNil(), __bool_top__);
        assert.strictEqual(_.isNil(undefined), __bool_top__);
    });
    QUnit.test('should return `false` for non-nullish values', function (assert) {
        assert.expect(13);
        var expected = lodashStable.map(falsey, function (value) {
            return value == null;
        });
        var actual = lodashStable.map(falsey, function (value, index) {
            return index ? _.isNil(value) : _.isNil();
        });
        assert.deepEqual(actual, expected);
        assert.strictEqual(_.isNil(args), __bool_top__);
        assert.strictEqual(_.isNil([
            __num_top__,
            __num_top__,
            __num_top__
        ]), __bool_top__);
        assert.strictEqual(_.isNil(__bool_top__), __bool_top__);
        assert.strictEqual(_.isNil(new Date()), __bool_top__);
        assert.strictEqual(_.isNil(new Error()), __bool_top__);
        assert.strictEqual(_.isNil(_), __bool_top__);
        assert.strictEqual(_.isNil(slice), __bool_top__);
        assert.strictEqual(_.isNil({ 'a': __num_top__ }), __bool_top__);
        assert.strictEqual(_.isNil(__num_top__), __bool_top__);
        assert.strictEqual(_.isNil(/x/), __bool_top__);
        assert.strictEqual(_.isNil(__str_top__), __bool_top__);
        if (Symbol) {
            assert.strictEqual(_.isNil(symbol), __bool_top__);
        } else {
            skipAssert(assert);
        }
    });
    QUnit.test('should work with nils from another realm', function (assert) {
        assert.expect(2);
        if (realm.object) {
            assert.strictEqual(_.isNil(realm.null), __bool_top__);
            assert.strictEqual(_.isNil(realm.undefined), __bool_top__);
        } else {
            skipAssert(assert, 2);
        }
    });
}());