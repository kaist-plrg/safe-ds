QUnit.module('lodash.uniqueId');
(function () {
    QUnit.test('should generate unique ids', function (assert) {
        assert.expect(1);
        var actual = lodashStable.times(__num_top__, function (assert) {
            return _.uniqueId();
        });
        assert.strictEqual(lodashStable.uniq(actual).length, actual.length);
    });
    QUnit.test('should return a string value when not providing a `prefix`', function (assert) {
        assert.expect(1);
        assert.strictEqual(typeof _.uniqueId(), __str_top__);
    });
    QUnit.test('should coerce the prefix argument to a string', function (assert) {
        assert.expect(1);
        var actual = [
            _.uniqueId(__num_top__),
            _.uniqueId(__num_top__),
            _.uniqueId(__num_top__)
        ];
        assert.ok(/3\d+,2\d+,1\d+/.test(actual));
    });
}());