var simpleDOM = require('simple-dom');

describe('simpleDOM', function () {

    it('is defined', function () {
        expect(simpleDOM).toBeDefined();
    });

    it('is Object', function () {
        expect(simpleDOM).toEqual(jasmine.any(Object));
    });

    describe('parts', function () {

        it('nodes is define', function () {
            expect(simpleDOM.nodes).toBeDefined();
        });

        it('nodes is object', function () {
            expect(simpleDOM.nodes).toEqual(jasmine.any(Object));
        });

        it('parse is define', function () {
            expect(simpleDOM.parse).toBeDefined();
        });

        it('parse is function', function () {
            expect(simpleDOM.parse).toEqual(jasmine.any(Function));
        });

    });

});