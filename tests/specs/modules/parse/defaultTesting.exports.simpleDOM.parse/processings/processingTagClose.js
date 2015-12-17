describe('processingTagClose (defaultTesting.exports.simpleDOM.parse.processings)', function () {
    var simpleDOMNodes = require('simple-dom-parser').nodes;
    var parseExports = require('default-testing').exports.simpleDOM.parse;
    var statesExports = parseExports.states;
    var ContextOfParse = parseExports.ContextOfParse;
    var processings = parseExports.processings;
    var processingTagClose = processings.processingTagClose,
        processingText = processings.processingText,
        processingTagStart = processings.processingTagStart,
        processingTagName = processings.processingTagName;

    it('was export', function () {
        expect(processingTagClose).toBeDefined();
    });

    describe('change state', function () {
        describe('to TEXT when not \'>\' after \'/\' ', function () {
            var contextOfParse = new ContextOfParse();

            processingText(contextOfParse, 'a');
            processingText(contextOfParse, '<');
            processingTagStart(contextOfParse, 's');
            processingTagName(contextOfParse, 't');
            processingTagName(contextOfParse, '/');
            processingTagClose(contextOfParse, ' ');

            it('contextOfParse.state is TEXT', function () {
                expect(contextOfParse.state).toBe(statesExports.TEXT);
            });
            it('contextOfParse.buffer is correct', function () {
                expect(contextOfParse.buffer).toBe('a<st/ ');
            });
            it('contextOfParse.textBuffer is correct', function () {
                expect(contextOfParse.textBuffer).toBe('a<st/ ');
            });

        });

        describe('to TEXT when \'>\' after \'/\' ', function () {
            var contextOfParse = new ContextOfParse();

            processingText(contextOfParse, 'a');
            processingText(contextOfParse, '<');
            processingTagStart(contextOfParse, 's');
            processingTagName(contextOfParse, 't');
            processingTagName(contextOfParse, '/');
            processingTagClose(contextOfParse, '>');

            it('contextOfParse.state is TEXT', function () {
                expect(contextOfParse.state).toBe(statesExports.TEXT);
            });
            it('contextOfParse.buffer is correct', function () {
                expect(contextOfParse.buffer).toBe('');
            });
            it('contextOfParse.textBuffer is correct', function () {
                expect(contextOfParse.textBuffer).toBe('');
            });

            describe('textNode', function () {
                var textNode = contextOfParse.result.childNodes[0];
                it('is define', function () {
                    expect(textNode).toBeDefined();
                });
                it('is TextNode', function () {
                    expect(textNode instanceof simpleDOMNodes.Text).toBeTruthy();
                });
                it('correct textNode.text', function () {
                    expect(textNode.nodeValue).toBe('a');
                });
            });

            describe('tag', function () {
                var tag = contextOfParse.result.childNodes[1];
                it('is define', function () {
                    expect(tag).toBeDefined();
                });
                it('is Tag', function () {
                    expect(tag instanceof simpleDOMNodes.Tag).toBeTruthy();
                });
                it('correct textNode.text', function () {
                    expect(tag.tagName).toBe('st');
                });
                it('not add to contextOfParse.treeStack', function () {
                    var treeStack = contextOfParse.treeStack;
                    expect(treeStack.length).toBe(1);
                    expect(treeStack[0]).toBe(contextOfParse.result);
                });
            });

        });
    });

});