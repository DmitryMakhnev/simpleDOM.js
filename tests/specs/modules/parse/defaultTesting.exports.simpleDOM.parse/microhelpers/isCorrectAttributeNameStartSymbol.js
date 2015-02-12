describe('isCorrectAttributeNameStartSymbol (defaultTesting.exports.simpleDOM.parse.microhelpers)', function () {
    var simpleDOMNodes = require('simple-dom');
    var parseExports = require('default-testing').exports.simpleDOM.parse;
    var isCorrectAttributeNameStartSymbol = parseExports.microehelpers.isCorrectAttributeNameStartSymbol;

    it('was exported', function () {
        expect(isCorrectAttributeNameStartSymbol).toBeDefined();
    });

    it('is isCorrectTagNameStartSymbol', function () {
        expect(isCorrectAttributeNameStartSymbol).toBe(parseExports.microehelpers.isCorrectTagNameStartSymbol);
    })
});