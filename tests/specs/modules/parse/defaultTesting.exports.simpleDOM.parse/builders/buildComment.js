describe('buildComment (defaultTesting.exports.simpleDOM.parse.builders)', function () {
    var simpleDOMNodes = require('simple-dom-parser').nodes;
    var parseExports = require('default-testing').exports.simpleDOM.parse;
    var ContextOfParse = parseExports.ContextOfParse;
    var buildComment = parseExports.builders.buildComment;

    it('is define', function () {
        expect(buildComment).toBeDefined();
    });

    it('is function', function () {
        expect(buildComment).toEqual(jasmine.any(Function));
    });

    describe('build', function () {
        var contextOfParse = new ContextOfParse();
        contextOfParse.buffer = 'a<!--hello--';
        contextOfParse.textBuffer = 'a';
        contextOfParse.commentBuffer = 'hello';
        buildComment(contextOfParse);

        describe('contextOfParse', function () {
            it('contextOfParse.buffer is correct', function () {
                expect(contextOfParse.buffer).toBe('');
            });
            it('contextOfParse.textBuffer is correct', function () {
                expect(contextOfParse.buffer).toBe('');
            });
        });

        describe('TextNode', function () {
            var textNode = contextOfParse.result.childNodes[0];

            it('is define', function () {
                expect(textNode).toBeDefined();
            });

            it('is Text', function () {
                expect(textNode instanceof simpleDOMNodes.Text).toBeTruthy();
            });

            it('textNode.nodeValue is correct', function () {
                expect(textNode.nodeValue).toBe('a');
            });
        });

        describe('Comment', function () {
            var comment = contextOfParse.result.childNodes[1];

            it('is define', function () {
                expect(comment).toBeDefined();
            });

            it('is Comment', function () {
                expect(comment instanceof simpleDOMNodes.Comment).toBeTruthy();
            });

            it('comment.nodeValue is correct', function () {
                expect(comment.nodeValue).toBe('hello');
            });
        });

    });
});