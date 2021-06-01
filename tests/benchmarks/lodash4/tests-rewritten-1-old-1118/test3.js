QUnit.module('map caches');
(function () {
    var keys = [
        null,
        undefined,
        false,
        true,
        1,
        -Infinity,
        NaN,
        {},
        'a',
        symbol || noop
    ];
    var pairs = lodashStable.map(keys, function (key, index) {
        var lastIndex = keys.length - 1;
        return [
            key,
            keys[lastIndex - index]
        ];
    });
    function createCaches(pairs) {
        var largeStack = new mapCaches.Stack(pairs), length = pairs ? pairs.length : 0;
        lodashStable.times(LARGE_ARRAY_SIZE - length, function () {
            largeStack.set({}, {});
        });
        return {
            'hashes': new mapCaches.Hash(pairs),
            'list caches': new mapCaches.ListCache(pairs),
            'map caches': new mapCaches.MapCache(pairs),
            'stack caches': new mapCaches.Stack(pairs),
            'large stacks': largeStack
        };
    }
    lodashStable.forOwn(createCaches(pairs), function (cache, kind) {
        var isLarge = /^large/.test(kind);
        QUnit.test('should implement a `Map` interface for ' + kind, function (assert) {
            assert.expect(83);
            lodashStable.each(keys, function (key, index) {
                var value = pairs[index][1];
                assert.deepEqual(cache.get(key), value);
                assert.strictEqual(cache.has(key), true);
                assert.strictEqual(cache.delete(key), true);
                assert.strictEqual(cache.has(key), false);
                assert.strictEqual(cache.get(key), undefined);
                assert.strictEqual(cache.delete(key), false);
                assert.strictEqual(cache.set(key, value), cache);
                assert.strictEqual(cache.has(key), true);
            });
            assert.strictEqual(cache.size, isLarge ? LARGE_ARRAY_SIZE : keys.length);
            assert.strictEqual(cache.clear(), undefined);
            assert.ok(lodashStable.every(keys, function (key) {
                return !cache.has(key);
            }));
        });
    });
    lodashStable.forOwn(createCaches(), function (cache, kind) {
        QUnit.test('should support changing values of ' + kind, function (assert) {
            assert.expect(10);
            lodashStable.each(keys, function (key) {
                cache.set(key, 1).set(key, __num_top__);
                assert.strictEqual(cache.get(key), 2);
            });
        });
    });
}());