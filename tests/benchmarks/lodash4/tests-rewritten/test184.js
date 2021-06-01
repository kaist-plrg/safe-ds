QUnit.module('lodash.partialRight');
(function () {
    QUnit.test('should work as a deep `_.defaults`', function (assert) {
        assert.expect(1);
        var object = { 'a': { 'b': __num_top__ } }, source = {
                'a': {
                    'b': __num_top__,
                    'c': __num_top__
                }
            }, expected = {
                'a': {
                    'b': __num_top__,
                    'c': __num_top__
                }
            };
        var defaultsDeep = _.partialRight(_.mergeWith, function deep(value, other) {
            return lodashStable.isObject(value) ? _.mergeWith(value, other, deep) : value;
        });
        assert.deepEqual(defaultsDeep(object, source), expected);
    });
}());