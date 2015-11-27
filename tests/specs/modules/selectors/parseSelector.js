var parseSelector = require('simple-dom-parser').parseSelector;


var defaultTesting = require('default-testing');
var parseSelectorExports = defaultTesting.exports.simpleDOM.parseSelector;

var statesExports = parseSelectorExports.states;
var ContextOfParseExports = parseSelectorExports.ContextOfParse;
var processingsExports = parseSelectorExports.processings;

describe('parseSelector exports', function () {

    describe('states', function () {
        it('was exported', function () {
            expect(statesExports).toBeDefined();
        });
        it('is object', function () {
            expect(statesExports).toEqual(jasmine.any(Object));
        });
    });

    describe('ContextOfParse', function () {

        it('was exported', function () {
            expect(ContextOfParseExports).toBeDefined();
        });
        it('is constructor', function () {
            expect(ContextOfParseExports).toEqual(jasmine.any(Function));
        });

        describe('correct init', function () {
            var contextOfParseInstance = new ContextOfParseExports();
            it('correct buffer', function () {
                expect(contextOfParseInstance.buffer).toBe('');
            });
            it('correct state', function () {
                expect(contextOfParseInstance.state).toBe(statesExports.START);
            });
            it('correct result', function () {
                expect(contextOfParseInstance.result).toEqual(jasmine.any(Object));
            });
        });

        describe('correct destruct', function () {
            var contextOfParseInstance = new ContextOfParseExports();
            contextOfParseInstance.destructor();
            it('correct buffer', function () {
                expect(contextOfParseInstance.buffer).toBe(null);
            });
            it('correct state', function () {
                expect(contextOfParseInstance.state).toBe(null);
            });
            it('correct result', function () {
                expect(contextOfParseInstance.result).toBe(null);
            });
        });
    });

    describe('processings', function () {

        it('was exported', function () {
            expect(processingsExports).toBeDefined();
        });

        it('is object', function () {
            expect(processingsExports).toEqual(jasmine.any(Object));
        });

        describe('processings.startState', function () {
            var processingsStartState = processingsExports.startState;

            it('was exported', function () {
                expect(processingsStartState).toBeDefined();
            });
            
            it('is function', function () {
                expect(processingsStartState).toEqual(jasmine.any(Function));
            });

            describe('to TAG', function () {
                var contextOfParse = new ContextOfParseExports();

                processingsStartState(contextOfParse, 'a');

                it('state is TAG', function () {
                    expect(contextOfParse.state).toBe(statesExports.TAG);
                });

                it('correct buffer', function () {
                    expect(contextOfParse.buffer).toBe('a');
                });

            });

            describe('to ID_START', function () {
                var contextOfParse = new ContextOfParseExports();

                processingsStartState(contextOfParse, '#');

                it('state is ID_START', function () {
                    expect(contextOfParse.state).toBe(statesExports.ID_START);
                });

                it('correct buffer', function () {
                    expect(contextOfParse.buffer).toBe('');
                });

            });

            describe('to CLASS_START', function () {
                var contextOfParse = new ContextOfParseExports();

                processingsStartState(contextOfParse, '.');

                it('state is CLASS_START', function () {
                    expect(contextOfParse.state).toBe(statesExports.CLASS_START);
                });

                it('correct buffer', function () {
                    expect(contextOfParse.buffer).toBe('');
                });

            });

            describe('to START', function () {
                var contextOfParse = new ContextOfParseExports();

                processingsStartState(contextOfParse, '*');

                it('state is START', function () {
                    expect(contextOfParse.state).toBe(statesExports.START);
                });

                it('correct buffer', function () {
                    expect(contextOfParse.buffer).toBe('');
                });

                it('correct result', function () {
                    expect(contextOfParse.result.tagName).toBe('*');
                });
            });
            
            describe('to ERROR', function () {
                var contextOfParse = new ContextOfParseExports();
                processingsStartState(contextOfParse, '-');
                
                it('state is ERROR', function () {
                    expect(contextOfParse.state).toBe(statesExports.ERROR);
                });
                
                it('', function () {
                    
                });
            });
        });

        describe('processings.tagState', function () {
            var processingsStartState = processingsExports.startState;
            var processingsTagState = processingsExports.tagState;

            it('was exported', function () {
                expect(processingsTagState).toBeDefined();
            });
            it('is function', function () {
                expect(processingsTagState).toEqual(jasmine.any(Function));
            });

            describe('to CLASS_START', function () {
                var contextOfParse = new ContextOfParseExports();
                processingsStartState(contextOfParse, 'd');
                processingsTagState(contextOfParse, 'i');
                processingsTagState(contextOfParse, 'v');
            });
            
            describe('to ID_START', function () {
                var contextOfParse = new ContextOfParseExports();
                processingsStartState(contextOfParse, 'd');
                processingsTagState(contextOfParse, 'i');
                processingsTagState(contextOfParse, 'v');
            });
            
            describe('to ERROR', function () {
                
            });
            
            //describe()

        });

    });
});

describe('parseSelector', function () {
    it('is define', function () {
        expect(parseSelector).toBeDefined();
    });

    it('is function', function () {
        expect(parseSelector).toEqual(jasmine.any(Function));
    });

    it('tag name', function () {
        var parseSelectorResult = parseSelector('div');
        var queryItem = parseSelectorResult.queries[0][0];
        expect(queryItem.tagName).toBe('div');
    });

    it('id', function () {
        var parseSelectorResult = parseSelector('#id');
        var queryItem = parseSelectorResult.queries[0][0];
        expect(queryItem.id).toBe('id');
    });

    it('class', function () {
        var parseSelectorResult = parseSelector('.class');
        var queryItem = parseSelectorResult.queries[0][0];
        expect(queryItem.classNames[0]).toBe('class');
    });

    describe('one composite selector rule', function () {
        var parseSelectorResult = parseSelector('div#id.class');
        var queryItem = parseSelectorResult.queries[0][0];
        it('tag name', function () {
            expect(queryItem.tagName).toBe('div');
        });

        it('id', function () {
            expect(queryItem.id).toBe('id');
        });

        it('class', function () {
            expect(queryItem.classNames[0]).toBe('class');
        });
    });

    describe('cascading selector rule', function () {
        var parseSelectorResult = parseSelector('a#aId.a-class.a-class-2 div#id.class');
        var firstQueryItem = parseSelectorResult.queries[0][0];
        var secondQueryItem = parseSelectorResult.queries[0][1];

        it('div tag name', function () {
            expect(firstQueryItem.tagName).toBe('div');
        });

        it('div id', function () {
            expect(firstQueryItem.id).toBe('id');
        });

        it('div class', function () {
            expect(firstQueryItem.classNames[0]).toBe('class');
        });

        it('a tag name', function () {
            expect(secondQueryItem.tagName).toBe('a');
        });

        it('a id', function () {
            expect(secondQueryItem.id).toBe('aId');
        });

        it('a first class', function () {
            expect(secondQueryItem.classNames[0]).toBe('a-class');
        });

        it('a second class', function () {
            expect(secondQueryItem.classNames[1]).toBe('a-class-2');
        });
    });

    describe('second element selector', function () {
        var parseSelectorResult = parseSelector('a#aId.a-class, div#id.class');

    })
});