    //
    describe("Test lodash utilities", function() {
        var _ = d3.giotto._;

        it("Check pick", function() {
            var picked = _.pick({a: 1, b: null, c: 'ciao'}, function (value, key) {
                if (key !== 'c')
                    return value;
            });

            expect(picked.a).toBe(1);
            expect(picked.b).toBe(null);
            expect(picked.c).toBe(undefined);
        });

        it("Check type functions", function () {
            expect(_.isObject({})).toBe(true);
            expect(_.isObject('ciao')).toBe(false);
            expect(_.isObject([])).toBe(false);
            expect(_.isObject(function () {})).toBe(false);
        });

        it("Check size", function () {
            expect(_.size()).toBe(0);
            expect(_.size(null)).toBe(0);
            expect(_.size(undefined)).toBe(0);
            expect(_.size({})).toBe(0);
            expect(_.size([])).toBe(0);
            expect(_.size('')).toBe(0);
            expect(_.size([3, 4])).toBe(2);
            expect(_.size('ciao')).toBe(4);
            expect(_.size({a:1, b:3})).toBe(2);
            expect(_.size(78)).toBe(0);
        });

        it("Check keys", function () {
            expect(_.keys({}).length).toBe(0);
            expect(_.keys({bla: 'foo'}).length).toBe(1);
        });

        it("Check deep extend", function () {
            expect(_.extend(true)).toBe(undefined);

            var o = {bla: 3};
            _.extend(true, o, {bla: 5, foo: 6});
            expect(o.bla).toBe(5);
            expect(o.foo).toBe(6);

            o = {bla: {foo: 5}, key: {bla: 5, a: 'c'}};
            var b = {bla: 6, key: {bla: 7, b: 'd'}, c: {a: 'hello'}};
            _.extend(true, o, b);
            expect(_.size(o), 3)
            expect(o.bla).toBe(6);
            expect(o.key.bla).toBe(7);
            expect(o.key.a).toBe('c');
            expect(o.key.b).toBe('d');
            expect(o.c).not.toBe(b.c);
            expect(_.size(o.c)).toBe(1);
            expect(o.c.a).toBe('hello');
        });
    });