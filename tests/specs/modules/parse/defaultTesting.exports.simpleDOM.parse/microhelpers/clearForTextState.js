describe('clearForTextState (defaultTesting.exports.simpleDOM.parse.microhelpers)', function () {
    var simpleDOMNodes = require('simple-dom-parser');
    var parseExports = require('default-testing').exports.simpleDOM.parse;
    var ContextOfParse = parseExports.ContextOfParse;
    var clearForTextState = parseExports.microehelpers.clearForTextState;

    it('was exported', function () {
        expect(clearForTextState).toBeDefined();
    });

    var contextOfParse = new ContextOfParse();
    contextOfParse.buffer = 'a<div class="asd"\\';
    contextOfParse.textBuffer = 'a';
    contextOfParse.tagName = 'div';
    contextOfParse.attributes = {
        'class': 'asd'
    };

    clearForTextState(contextOfParse);

    it('contextOfParse.buffer is correct', function () {
        expect(contextOfParse.buffer).toBe('a<div class="asd"\\');
    });

    it('contextOfParse.textBuffer is correct', function () {
        expect(contextOfParse.textBuffer).toBe('a<div class="asd"\\');
    });

    //TODO: [dmitry.makhnev] think about other properties

});