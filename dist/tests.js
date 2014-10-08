    //
    describe("Test C3 graphs", function() {
        var C3 = d3.ext.C3;

        it("Check basic properties", function() {
            var c3 = new C3();
            expect(c3 instanceof d3.ext.Viz).toBe(true);
            expect(c3 instanceof C3).toBe(true);
            expect(c3.element instanceof Array).toBe(true);
        });

        it("Check sizing", function() {
            var c3 = new C3({height: 100});
            expect(c3.attrs.height).toBe(100);
            expect(c3.element instanceof Array).toBe(true);
        });

    });
    //
    describe("Test Class", function() {
        var Class = d3.ext.Class;

        it("Check basic properties", function() {
            expect(typeof(Class)).toBe('function');
            expect(typeof(Class.__class__)).toBe('function');
            //
            var TestClass = Class.extend({
                hi: function () {
                    return "I'm a test";
                }
            });
            var TestClass2 = TestClass.extend({
                init: function (name) {
                    this.name = name;
                },
                hi: function () {
                    return this._super() + " 2";
                },
                toString: function () {
                    return this.name;
                }
            });
            //
            // class method
            TestClass2.create2 = function () {
                var instance = new TestClass2('create2');
                return instance;
            };
            //
            var test1 = new TestClass(),
                test2 = new TestClass2('luca');
            //
            expect(test1 instanceof TestClass).toBe(true);
            expect(test1 instanceof Class).toBe(true);
            expect(test1 instanceof TestClass2).toBe(false);
            expect(test2 instanceof TestClass).toBe(true);
            expect(test2 instanceof Class).toBe(true);
            expect(test2 instanceof TestClass2).toBe(true);
            //
            expect(test1.hi()).toBe("I'm a test");
            expect(test2.hi()).toBe("I'm a test 2");
            //
            // Test he class method
            expect(typeof(TestClass2.create2), 'function', 'TestClass2.create2 is an function');
            var test3 = TestClass2.create2();
            expect(test3 instanceof TestClass, 'test3 is instance of TestClass');
            expect(test3 instanceof Class, 'test3 is instance of Class');
            expect(test3 instanceof TestClass2, 'test3 is an instance of TestClass2');
            //
            var TestClass3 = TestClass2.extend({
                test: TestClass2,
                init: function (name, surname) {
                    this._super(name);
                    this.surname = surname;
                }
            });
            //
            var t3 = new TestClass3('luca', 'sbardella');
            expect(t3.test).toBe(TestClass2);
            expect(t3.name).toBe('luca');
            expect(t3.surname).toBe('sbardella');
            expect(t3.test).toBe(TestClass2);
        });
    });
    //
    describe("Test extension object", function() {
        var d3ext = d3.ext;

        it("Check basic properties", function() {
            expect(typeof(d3ext)).toBe('object');
            expect(typeof(d3ext.version)).toBe('string');
        });

        it("Check phantom", function() {
            expect(typeof(phantom)).toBe('object');
        });
    });
    //
    describe("Test Sunburst", function() {
        var SunBurst = d3.ext.SunBurst,
            src = "https://gist.githubusercontent.com/lsbardel/f3d21f35a685a96706bf/raw";

        it("Check basic properties", function() {
            var sunb = new SunBurst();
            expect(sunb instanceof d3.ext.Viz).toBe(true);
            expect(sunb instanceof SunBurst).toBe(true);
            expect(sunb.element instanceof Array).toBe(true);
            expect(sunb.attrs.padding).toBe(10);
        });

        it("Check agile development src", function() {
            var sunb = new SunBurst({
                    padding: '30',
                    src: src
                });
            expect(sunb.attrs.padding).toBe('30');
            expect(sunb.attrs.src).toBe(src);
            expect(sunb.attrs.resize).toBe(false);
        });

        it("Check agile development build", function(done) {
            var sunb = new SunBurst({
                    padding: '30',
                    src: src
                }),
                check = function (o) {
                    expect(o).toBe(sunb);
                    //expect(typeof(o.attrs.data)).toBe('object');
                    done();
                };
            sunb.on('build', check);
            sunb.build();
        });

    });