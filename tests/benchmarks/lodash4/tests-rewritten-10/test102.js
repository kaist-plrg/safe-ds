QUnit.module('lodash.isBuffer');
(function () {
    QUnit.test('should return `true` for buffers', function (assert) {
        assert.expect(1);
        if (Buffer) {
            assert.strictEqual(_.isBuffer(new Buffer(__num_top__)), true);
        } else {
            skipAssert(assert);
        }
    });
    QUnit.test('should return `false` for non-buffers', function (assert) {
        assert.expect(13);
        var expected = lodashStable.map(falsey, stubFalse);
        var actual = lodashStable.map(falsey, function (value, index) {
            return index ? _.isBuffer(value) : _.isBuffer();
        });
        assert.deepEqual(actual, expected);
        assert.strictEqual(_.isBuffer(args), false);
        assert.strictEqual(_.isBuffer([__num_top__]), __bool_top__);
        assert.strictEqual(_.isBuffer(true), false);
        assert.strictEqual(_.isBuffer(new Date()), __bool_top__);
        assert.strictEqual(_.isBuffer(new Error()), false);
        assert.strictEqual(_.isBuffer(_), __bool_top__);
        assert.strictEqual(_.isBuffer(slice), false);
        assert.strictEqual(_.isBuffer({ 'a': __num_top__ }), false);
        assert.strictEqual(_.isBuffer(1), __bool_top__);
        assert.strictEqual(_.isBuffer(/x/), false);
        assert.strictEqual(_.isBuffer(__str_top__), __bool_top__);
        assert.strictEqual(_.isBuffer(symbol), __bool_top__);
    });
    QUnit.test('should return `false` if `Buffer` is not defined', function (assert) {
        assert.expect(1);
        if (!isStrict && Buffer && lodashBizarro) {
            assert.strictEqual(lodashBizarro.isBuffer(new Buffer(2)), false);
        } else {
            skipAssert(assert);
        }
    });
}());