var simpleDOMNodes = require('simple-dom-parser').nodes;

describe('simpleDOM.nodes', function () {

    describe('Fragment', function () {

        it('is define', function () {
            expect(simpleDOMNodes.Fragment).toBeDefined();
        });

        it('is constructor', function () {
            var fragment = new simpleDOMNodes.Fragment();
            expect(fragment).toEqual(jasmine.any(Object));
        });

        var fragment = new simpleDOMNodes.Fragment();

        it('type is define', function () {
            expect(fragment.type).toBeDefined();
        });

        it('type is \'fragment\'', function () {
            expect(fragment.type).toBe('fragment');
        });

        it('childNode is define', function () {
            expect(fragment.childNodes).toBeDefined();
        });

        it('childNodes is array', function () {
            expect(fragment.childNodes).toEqual(jasmine.any(Array));
        });

        it('appendChild is defined', function () {
            expect(fragment.appendChild).toBeDefined();
        });

        it('appendChild is function', function () {
            expect(fragment.appendChild).toEqual(jasmine.any(Function));
        });

        it('removeChild is defined', function () {
            expect(fragment.removeChild).toBeDefined();
        });

        it('removeChild is function', function () {
            expect(fragment.removeChild).toEqual(jasmine.any(Function));
        });

    });


    describe('Tag', function () {

        it('is define', function () {
            expect(simpleDOMNodes.Tag).toBeDefined();
        });

        it('is constructor', function () {
            var tag = new simpleDOMNodes.Tag('div', {'class': 'block'});
            expect(tag).toEqual(jasmine.any(Object));
        });

        var tag = new simpleDOMNodes.Tag('div', {'class': 'block'});

        it('type is define', function () {
            expect(tag.type).toBeDefined();
        });

        it('type is \'tag\'', function () {
            expect(tag.type).toBe('tag');
        });

        it('childNode is define', function () {
            expect(tag.childNodes).toBeDefined();
        });

        it('childNodes is array', function () {
            expect(tag.childNodes).toEqual(jasmine.any(Array));
        });

        it('name is define', function () {
            expect(tag.tagName).toBeDefined();
        });

        it('name is \'div\'', function () {
            expect(tag.tagName).toBe('div');
        });

        it('attributes is define', function () {
            expect(tag.attributes).toBeDefined();
        });

        it('attributes is Object', function () {
            expect(tag.attributes).toEqual(jasmine.any(Object));
        });

        it('parentNode is define', function () {
            expect(tag.parentNode).toBeDefined();
        });

        it('parentNode is null', function () {
            expect(tag.parentNode).toBeNull();
        });

        it('appendChild is defined', function () {
            expect(tag.appendChild).toBeDefined();
        });

        it('appendChild is function', function () {
            expect(tag.appendChild).toEqual(jasmine.any(Function));
        });

        it('removeChild is defined', function () {
            expect(tag.removeChild).toBeDefined();
        });

        it('removeChild is function', function () {
            expect(tag.removeChild).toEqual(jasmine.any(Function));
        });
    });


    describe('Text', function () {

        it('is define', function () {
            expect(simpleDOMNodes.Text).toBeDefined();
        });

        it('is constructor', function () {
            var text = new simpleDOMNodes.Text('text content');
            expect(text).toEqual(jasmine.any(Object));
        });

        var text = new simpleDOMNodes.Text('text content');

        it('type is define', function () {
            expect(text.type).toBeDefined();
        });

        it('type is \'text\'', function () {
            expect(text.type).toBe('text');
        });

        it('text is define', function () {
            expect(text.nodeValue).toBeDefined();
        });

        it('text is \'text content\'', function () {
            expect(text.nodeValue).toBe('text content');
        });

        it('parentNode is define', function () {
            expect(text.parentNode).toBeDefined();
        });

        it('parentNode is null', function () {
            expect(text.parentNode).toBeNull();
        });

    });


    describe('Comment', function () {

        it('is define', function () {
            expect(simpleDOMNodes.Comment).toBeDefined();
        });

        it('is constructor', function () {
            var comment = new simpleDOMNodes.Comment('comment text');
            expect(comment).toEqual(jasmine.any(Object));
        });

        var comment = new simpleDOMNodes.Comment('comment text');

        it('type is define', function () {
            expect(comment.type).toBeDefined();
        });

        it('type is \'comment\'', function () {
            expect(comment.type).toBe('comment');
        });

        it('text is define', function () {
            expect(comment.nodeValue).toBeDefined();
        });

        it('text is \'comment text\'', function () {
            expect(comment.nodeValue).toBe('comment text');
        });

        it('parentNode is define', function () {
            expect(comment.parentNode).toBeDefined();
        });

        it('parentNode is null', function () {
            expect(comment.parentNode).toBeNull();
        });

    });

    describe('appendChild()', function () {

        describe('appendChild() div into fragment', function () {
            var fragment = new simpleDOMNodes.Fragment(),
                div = new simpleDOMNodes.Tag('div', {'class': 'block'});

            fragment.appendChild(div);
            it('correct div position', function () {
                expect(fragment.childNodes[0]).toBe(div);
            });
            it('div.parentNode is fragment', function () {
                expect(div.parentNode).toBe(fragment);
            });

        });

        describe('appendChild() reappend div', function () {
            var div = new simpleDOMNodes.Tag('div'),
                div2 = new simpleDOMNodes.Tag('div'),
                fragment = new simpleDOMNodes.Fragment();

            div2.appendChild(div);
            fragment.appendChild(div);

            it('div correct parent node', function () {
                expect(div.parentNode).toBe(fragment);
            });

            it('div2.childNodes is correct', function () {
                expect(div2.childNodes.length).toBe(0);
            });

        });

        describe('appendChild() for fragment', function () {
            var div = new simpleDOMNodes.Tag('div'),
                div2 = new simpleDOMNodes.Tag('div'),
                div3 = new simpleDOMNodes.Tag('div'),
                fragment = new simpleDOMNodes.Fragment();

            fragment.appendChild(div2);
            fragment.appendChild(div3);
            div.appendChild(fragment);

            it('div.childNodes length is correct', function () {
                expect(div.childNodes.length).toBe(2);
            });

            it('div2.parentNode is div', function () {
                expect(div2.parentNode).toBe(div);
            });

            it('div3.parentNode is div', function () {
                expect(div3.parentNode).toBe(div);
            });

            it('fragment.childNodes is empty', function () {
                expect(fragment.childNodes.length).toBe(0);
            });
        });

    });

    describe('removeChild()', function () {

        describe('simple remove', function () {
            var div = new simpleDOMNodes.Tag('div'),
                div2 = new simpleDOMNodes.Tag('div');

            div.appendChild(div2);
            div.removeChild(div2);

            it('div.childNodes is empty', function () {
                expect(div.childNodes.length).toBe(0);
            });

            it('div2.parentNode is null', function () {
                expect(div2.parentNode).toBeNull();
            });
        });

        describe('remove second of three nodes', function () {
            var div = new simpleDOMNodes.Tag('div'),
                div1 = new simpleDOMNodes.Tag('div'),
                div2 = new simpleDOMNodes.Tag('div'),
                div3 = new simpleDOMNodes.Tag('div');

            div.appendChild(div1);
            div.appendChild(div2);
            div.appendChild(div3);
            div.removeChild(div2);

            it('div.childNodes length is 2', function () {
                expect(div.childNodes.length).toBe(2);
            });

            it('div.childNodes[0] is div1', function () {
                expect(div.childNodes[0]).toBe(div1);
            });

            it('div.childNodes[1] is div3', function () {
                expect(div.childNodes[1]).toBe(div3);
            });

            it('div2.parentNode is null', function () {
                expect(div2.parentNode).toBeNull();
            });

        });

    });

});