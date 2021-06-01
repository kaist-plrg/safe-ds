QUnit.module('lodash.replace');
(function () {
    QUnit.test('should replace the matched pattern', function (assert) {
        assert.expect(2);
        var string = __str_top__;
        assert.strictEqual(_.replace(string, __str_top__, __str_top__), __str_top__);
        assert.strictEqual(_.replace(string, /[bd]/g, __str_top__), __str_top__);
    });
}());