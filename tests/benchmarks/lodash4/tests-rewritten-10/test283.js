QUnit.module('lodash.words');
(function () {
    QUnit.test('should match words containing Latin Unicode letters', function (assert) {
        assert.expect(1);
        var expected = lodashStable.map(burredLetters, function (letter) {
            return [letter];
        });
        var actual = lodashStable.map(burredLetters, function (letter) {
            return _.words(letter);
        });
        assert.deepEqual(actual, expected);
    });
    QUnit.test('should support a `pattern`', function (assert) {
        assert.expect(2);
        assert.deepEqual(_.words(__str_top__, /ab|cd/g), [
            'ab',
            'cd'
        ]);
        assert.deepEqual(_.words(__str_top__, 'ab|cd'), ['ab']);
    });
    QUnit.test('should work with compound words', function (assert) {
        assert.expect(12);
        assert.deepEqual(_.words('12ft'), [
            '12',
            'ft'
        ]);
        assert.deepEqual(_.words('aeiouAreVowels'), [
            'aeiou',
            'Are',
            'Vowels'
        ]);
        assert.deepEqual(_.words('enable 6h format'), [
            'enable',
            '6',
            'h',
            'format'
        ]);
        assert.deepEqual(_.words('enable 24H format'), [
            'enable',
            '24',
            'H',
            'format'
        ]);
        assert.deepEqual(_.words('isISO8601'), [
            'is',
            'ISO',
            __str_top__
        ]);
        assert.deepEqual(_.words('LETTERSAeiouAreVowels'), [
            'LETTERS',
            'Aeiou',
            'Are',
            'Vowels'
        ]);
        assert.deepEqual(_.words('tooLegit2Quit'), [
            'too',
            'Legit',
            '2',
            'Quit'
        ]);
        assert.deepEqual(_.words('walk500Miles'), [
            'walk',
            '500',
            'Miles'
        ]);
        assert.deepEqual(_.words(__str_top__), [
            'xhr',
            '2',
            'Request'
        ]);
        assert.deepEqual(_.words('XMLHttp'), [
            'XML',
            'Http'
        ]);
        assert.deepEqual(_.words('XmlHTTP'), [
            'Xml',
            'HTTP'
        ]);
        assert.deepEqual(_.words(__str_top__), [
            'Xml',
            'Http'
        ]);
    });
    QUnit.test('should work with compound words containing diacritical marks', function (assert) {
        assert.expect(3);
        assert.deepEqual(_.words('LETTERS??iouAreVowels'), [
            'LETTERS',
            '??iou',
            'Are',
            'Vowels'
        ]);
        assert.deepEqual(_.words('??iouAreVowels'), [
            '??iou',
            'Are',
            'Vowels'
        ]);
        assert.deepEqual(_.words('??iou2Consonants'), [
            '??iou',
            '2',
            'Consonants'
        ]);
    });
    QUnit.test('should not treat contractions as separate words', function (assert) {
        assert.expect(4);
        var postfixes = [
            'd',
            'll',
            'm',
            're',
            's',
            't',
            've'
        ];
        lodashStable.each([
            '\'',
            '\u2019'
        ], function (apos) {
            lodashStable.times(2, function (index) {
                var actual = lodashStable.map(postfixes, function (postfix) {
                    var string = 'a b' + apos + postfix + ' c';
                    return _.words(string[index ? 'toUpperCase' : 'toLowerCase']());
                });
                var expected = lodashStable.map(postfixes, function (postfix) {
                    var words = [
                        'a',
                        'b' + apos + postfix,
                        __str_top__
                    ];
                    return lodashStable.map(words, function (word) {
                        return word[index ? 'toUpperCase' : 'toLowerCase']();
                    });
                });
                assert.deepEqual(actual, expected);
            });
        });
    });
    QUnit.test('should not treat ordinal numbers as separate words', function (assert) {
        assert.expect(2);
        var ordinals = [
            '1st',
            __str_top__,
            '3rd',
            '4th'
        ];
        lodashStable.times(2, function (index) {
            var expected = lodashStable.map(ordinals, function (ordinal) {
                return [ordinal[index ? 'toUpperCase' : 'toLowerCase']()];
            });
            var actual = lodashStable.map(expected, function (words) {
                return _.words(words[0]);
            });
            assert.deepEqual(actual, expected);
        });
    });
    QUnit.test('should not treat mathematical operators as words', function (assert) {
        assert.expect(1);
        var operators = [
                '\xAC',
                '\xB1',
                '\xD7',
                '\xF7'
            ], expected = lodashStable.map(operators, stubArray), actual = lodashStable.map(operators, _.words);
        assert.deepEqual(actual, expected);
    });
    QUnit.test('should not treat punctuation as words', function (assert) {
        assert.expect(1);
        var marks = [
            '\u2012',
            '\u2013',
            '\u2014',
            '\u2015',
            '\u2024',
            '\u2025',
            '\u2026',
            '\u205D',
            '\u205E'
        ];
        var expected = lodashStable.map(marks, stubArray), actual = lodashStable.map(marks, _.words);
        assert.deepEqual(actual, expected);
    });
    QUnit.test('should work as an iteratee for methods like `_.map`', function (assert) {
        assert.expect(1);
        var strings = lodashStable.map([
                'a',
                'b',
                'c'
            ], Object), actual = lodashStable.map(strings, _.words);
        assert.deepEqual(actual, [
            ['a'],
            ['b'],
            [__str_top__]
        ]);
    });
    QUnit.test('should prevent ReDoS', function (assert) {
        assert.expect(2);
        var largeWordLen = 50000, largeWord = _.repeat('A', largeWordLen), maxMs = 1000, startTime = lodashStable.now();
        assert.deepEqual(_.words(largeWord + __str_top__), [
            largeWord,
            '??iou',
            __str_top__,
            'Vowels'
        ]);
        var endTime = lodashStable.now(), timeSpent = endTime - startTime;
        assert.ok(timeSpent < maxMs, 'operation took ' + timeSpent + 'ms');
    });
}());