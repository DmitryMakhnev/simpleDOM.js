describe('processingDeclarationStart (defaultTesting.exports.simpleDOM.parse.processings)', function () {
    var simpleDOMNodes = require('simple-dom-parser').nodes;
    var parseExports = require('default-testing').exports.simpleDOM.parse;
    var statesExports = parseExports.states;
    var ContextOfParse = parseExports.ContextOfParse;
    var processings = parseExports.processings;
    var processingDeclarationStart = processings.processingDeclarationStart,
        processingText = processings.processingText,
        processingTagStart = processings.processingTagStart;

    it('is define', function () {
        expect(processingDeclarationStart).toBeDefined();
    });

    describe('change state', function () {

        describe('to TEXT', function () {
            var contextOfParse = new ContextOfParse();
            processingText(contextOfParse, '<');
            processingTagStart(contextOfParse, '!');
            processingDeclarationStart(contextOfParse, ' ');

            it('contextOfParse.state is TEXT', function () {
                expect(contextOfParse.state).toBe(statesExports.TEXT);
            });

            it('contextOfParse.buffer is correct', function () {
                expect(contextOfParse.buffer).toBe('<! ');
            });

            it('contextOfParse.textBuffer is correct', function () {
                expect(contextOfParse.textBuffer).toBe('<! ');
            });

        });

        describe('to COMMENT_START', function () {
            var contextOfParse = new ContextOfParse();
            processingText(contextOfParse, '<');
            processingTagStart(contextOfParse, '!');
            processingDeclarationStart(contextOfParse, '-');

            it('contextOfParse.state is COMMENT_START', function () {
                expect(contextOfParse.state).toBe(statesExports.COMMENT_START);
            });

            it('contextOfParse.buffer is correct', function () {
                expect(contextOfParse.buffer).toBe('<!-');
            });

        });

    });

});