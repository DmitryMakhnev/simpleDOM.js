describe('isCorrectAttributeNameSymbol (defaultTesting.exports.simpleDOM.parse.microhelpers)', function () {
    var simpleDOMNodes = require('simple-dom');
    var parseExports = require('default-testing').exports.simpleDOM.parse;
    var isCorrectAttributeNameSymbol = parseExports.microehelpers.isCorrectAttributeNameSymbol;

    it('was exported', function () {
        expect(isCorrectAttributeNameSymbol).toBeDefined();
    });

    it('is isCorrectTagNameStartSymbol', function () {
        expect(isCorrectAttributeNameSymbol).toBe(parseExports.microehelpers.isCorrectTagNameSymbol);
    })
});