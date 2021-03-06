var defaultLib = require('default-lib');
var simpleDOMNodes = require('simple-dom-parser').nodes;
var parse = require('simple-dom-parser').parse;
var defaultTestingUtils = require('default-testing').utils;


describe('simpleDOM.parse', function () {

    it('any simpleDOMResult root is Fragment', function () {
        var simpleDOMResult = parse('');
        expect(simpleDOMResult instanceof simpleDOMNodes.Fragment).toBeTruthy();
    });

    //
    // tests helpers
    //

    function createDefaultSpan(contentItem) {
        var createTagArguments = ['span', null];
        defaultLib.cycle(arguments, function (contentItem) {
            createTagArguments.push(contentItem);
        });
        return defaultTestingUtils.createTag.apply(defaultTestingUtils, createTagArguments);
    }

    function defaultSpanTests(span) {
        it('span is parsed', function () {
            expect(span).toBeDefined();
        });

        it('span is parsed as Tag', function () {
            expect(span instanceof simpleDOMNodes.Tag).toBeTruthy();
        });

        it('correct name', function () {
            expect(span.tagName).toBe('span');
        });

        it('attributes is empty', function () {
            expect(defaultLib.getObjectLength(span.attributes)).toBe(0);
        });
    }

    function createDefaultDiv(contentItem) {
        var createTagArguments = ['div', {'class': 'block', 'data-foo': 'bar'}];
        defaultLib.cycle(arguments, function (contentItem) {
            createTagArguments.push(contentItem);
        });
        return defaultTestingUtils.createTag.apply(defaultTestingUtils, createTagArguments);
    }

    function defaultDivTests (div) {
        it ('div is parsed', function () {
            expect(div).toBeDefined();
        });

        it('div is parsed as Tag', function () {
            expect(div instanceof simpleDOMNodes.Tag).toBeTruthy();
        });

        it('correct name', function () {
            expect(div.tagName).toBe('div');
        });

        describe('correct attributes', function () {
            var attributes = div.attributes;
            it('class is block', function () {
                expect(attributes['class']).toBe('block');
            });
            it('data-foo is bar', function () {
                expect(attributes['data-foo']).toBe('bar');
            });
        });

    }

    //
    // /tests helpers
    //

    describe('parse testing helpers', function () {
        it('createDefaultDiv', function () {
            expect(createDefaultDiv()).toEqual('<div class="block" data-foo="bar"></div>');
        });
    });

    describe('one span', function () {

        var simpleDOMResult = parse(createDefaultSpan()),
            span = simpleDOMResult.childNodes[0];

        defaultSpanTests(span);

    });

    describe('one div with attributes', function () {

        var simpleDOMResult = parse(createDefaultDiv()),
            div = simpleDOMResult.childNodes[0];

        defaultDivTests(div);

    });


    describe('2 linear tags', function () {

        var simpleDOMResult = parse(createDefaultSpan() + createDefaultDiv()),
            span = simpleDOMResult.childNodes[0],
            div = simpleDOMResult.childNodes[1];

        describe('span', function () {
            defaultSpanTests(span);
        });

        describe('div', function () {
            defaultDivTests(div);
        });

    });

    describe('2 nested divs', function () {
        var simpleDOMResult = parse(createDefaultDiv(createDefaultDiv())),
            div1 = simpleDOMResult.childNodes[0],
            div2 = simpleDOMResult.childNodes[0].childNodes[0];

        describe('parent div', function () {
            defaultDivTests(div1);
        });

        describe('children div', function () {
            defaultDivTests(div2);
        });

    });

    describe('<select> with not closed <option>', function () {
        var simpleDOMResult = parse('<select><option value="1">hello<option value="2"><option value="3"></select>');
        var select = simpleDOMResult.childNodes[0];
        describe('select', function () {
            it('is define', function () {
            expect(select).toBeDefined();
            });
            it('has correct tag name', function () {
                expect(select.tagName).toBe('select');
            });
            it('select.childNodes.length is 3', function () {
                expect(select.childNodes.length).toBe(3);
            });
        });

        describe('option 1', function () {
            var option1 = select.childNodes[0];
            it('is define', function () {
                expect(option1).toBeDefined()
            });
            it('has correct tag name', function () {
                expect(option1.tagName).toBe('option');
            });
            it('has correct attribute', function () {
                expect(option1.attributes.value).toBe('1');
            });
            it('has not child', function () {
                expect(option1.childNodes.length).toBe(1);
            });
        });

        describe('option 2', function () {
            var option2 = select.childNodes[1];
            it('is define', function () {
                expect(option2).toBeDefined()
            });
            it('has correct tag name', function () {
                expect(option2.tagName).toBe('option');
            });
            it('has correct attribute', function () {
                expect(option2.attributes.value).toBe('2');
            });
        });

        describe('option 3', function () {
            var option3 = select.childNodes[2];
            it('is define', function () {
                expect(option3).toBeDefined()
            });
            it('has correct tag name', function () {
                expect(option3.tagName).toBe('option');
            });
            it('has correct attribute', function () {
                expect(option3.attributes.value).toBe('3');
            });

        });



    });

    describe('comment parse', function () {
        var simpleDOMResult = parse('a<div></div><!--CoMmEnT-->b');

        var resultFragmentChildNodes = simpleDOMResult.childNodes;

        it('correct result.childNodes length', function () {
            expect(resultFragmentChildNodes.length).toBe(4);
        });

        describe('first textNode', function () {
            var textNode = resultFragmentChildNodes[0];

            it('is define', function () {
                expect(textNode).toBeDefined();
            });

            it('is Text', function () {
                expect(textNode instanceof simpleDOMNodes.Text).toBe(true);
            });

            it('textNode.nodeValue is correct', function () {
                expect(textNode.nodeValue).toBe('a');
            });

        });

        describe('tag', function () {
            var tag = resultFragmentChildNodes[1];

            it('is define', function () {
                expect(tag).toBeDefined();
            });

            it('is Tag', function () {
                expect(tag instanceof simpleDOMNodes.Tag).toBe(true);
            });

            it('tag.tagName is correct', function () {
                expect(tag.tagName).toBe('div');
            });

        });

        describe('comment', function () {
            var comment = resultFragmentChildNodes[2];

            it('is define', function () {
                expect(comment).toBeDefined();
            });

            it('is Tag', function () {
                expect(comment instanceof simpleDOMNodes.Comment).toBe(true);
            });

            it('tag.tagName is correct', function () {
                expect(comment.nodeValue).toBe('CoMmEnT');
            });
        });

        describe('second textNode', function () {
            var textNode = resultFragmentChildNodes[3];

            it('is define', function () {
                expect(textNode).toBeDefined();
            });

            it('is Text', function () {
                expect(textNode instanceof simpleDOMNodes.Text).toBe(true);
            });

            it('textNode.nodeValue is correct', function () {
                expect(textNode.nodeValue).toBe('b');
            });

        });
    });

    describe('unfinished part', function () {
        var simpleDOMResult = parse('a<div></div><da');

        var resultFragmentChildNodes = simpleDOMResult.childNodes;

        it('correct result.childNodes length', function () {
            expect(resultFragmentChildNodes.length).toBe(3);
        });

        describe('first textNode', function () {
            var textNode = resultFragmentChildNodes[0];

            it('is define', function () {
                expect(textNode).toBeDefined();
            });

            it('is Text', function () {
                expect(textNode instanceof simpleDOMNodes.Text).toBe(true);
            });

            it('textNode.nodeValue is correct', function () {
                expect(textNode.nodeValue).toBe('a');
            });

        });

        describe('tag', function () {
            var tag = resultFragmentChildNodes[1];

            it('is define', function () {
                expect(tag).toBeDefined();
            });

            it('is Tag', function () {
                expect(tag instanceof simpleDOMNodes.Tag).toBe(true);
            });

            it('tag.tagName is correct', function () {
                expect(tag.tagName).toBe('div');
            });

        });

        describe('second textNode', function () {
            var textNode = resultFragmentChildNodes[2];

            it('is define', function () {
                expect(textNode).toBeDefined();
            });

            it('is Text', function () {
                expect(textNode instanceof simpleDOMNodes.Text).toBe(true);
            });

            it('textNode.nodeValue is correct', function () {
                expect(textNode.nodeValue).toBe('<da');
            });

        });

    });

    describe('parse with namespaces', function () {
        var simpleDOMResult = parse('<ui:if><div></div><span></span></ui:if>');
        var childNodes = simpleDOMResult.childNodes;
        var ifChilds = childNodes[0].childNodes;

        it('correct count of root childs', function () {
            expect(childNodes.length).toBe(1);
        });

        it('correct count of root childs', function () {
            expect(ifChilds.length).toBe(2);
        });

    });

    describe('parse xml input', function () {
        var simpleDomResult = parse('<div><input><ui:attr name="data-foo" value="bar" /></input></div>', {isXML: true});

        it('correct result', function () {
            expect(simpleDomResult.childNodes.length).toBe(1);
            var div = simpleDomResult.childNodes[0];
            expect(div.tagName).toBe('div');
            expect(div.childNodes.length).toBe(1);
            var input = div.childNodes[0];
            expect(input.tagName).toBe('input');
            expect(input.childNodes.length).toBe(1);
            var attr = input.childNodes[0];
            expect(attr.tagName).toBe('ui:attr');
            expect(attr.attributes.name).toBe('data-foo');
            expect(attr.attributes.value).toBe('bar');
        });
    });

});