var cycle = require('default-lib').cycle;

/**
 *
 * @param {String} query
 * @constructor
 */
function Selector (query) {
    var selector = this;
    selector.query = query;

    var queries = [];
    selector.queries = queries;

    cycle(query.split(','), processingQueryPart, queries);
}

var emptyQueryPartTest = /^[\s\uFEFF\xA0]+$/;

/**
 *
 * @param {String} queryPart
 * @param {Number} index
 * @param {Array} queryParts
 * @param {Array} queries
 */
function processingQueryPart (queryPart, index, queryParts, queries) {
    if (emptyQueryPartTest.test(queryPart)) {
        var parsedQueryPart = [];
        queries.push(parsedQueryPart);
        cycle(queryPart.split(' '),  parsedQueryPart);
    }
    emptyQueryPartTest.lastIndex = 0;
}

/**
 *
 * @param {String} queryPartElement
 * @param {Number} index
 * @param {Array} queryPartElements
 * @param {Array} parsedQueryPart
 */
function processingQueryPartElements (queryPartElement, index, queryPartElements, parsedQueryPart) {
    if (queryPartElement !== '') {

    }
}

/*
 * parseSelector
 *
 *
 * */

var stateId = 0;

var START_STATE = stateId++;
var TAG_STATE = stateId++;
var ID_START_STATE = stateId++;
var ID_STATE = stateId++;
var CLASS_START_STATE = stateId++;
var CLASS_STATE = stateId++;
var ERROR_STATE = stateId++;

function ContextOfParse () {
    var contextOfParse = this;
    contextOfParse.buffer = '';
    contextOfParse.state = START_STATE;
    contextOfParse.result = {};
}

ContextOfParse.prototype.destructor = function () {
    var contextOfParse = this;
    contextOfParse.buffer = null;
    contextOfParse.state = null;
    contextOfParse.result = null;
};

/*@DTesting.exports*/
var defaultTesting = require('default-testing');
var getObjectSafely = require('default-lib').getObjectSafely;
var parseExports = getObjectSafely(defaultTesting.exports, 'simpleDOM').parseSelector = {};

parseExports.states = {
    START: START_STATE,
    TAG: TAG_STATE,
    ID_START: ID_START_STATE,
    ID: ID_STATE,
    CLASS_START: CLASS_START_STATE,
    CLASS: CLASS_STATE,
    ERROR: ERROR_STATE
};

parseExports.ContextOfParse = ContextOfParse;

var processingsExports = parseExports.processings = {};
/*@/DTesting.exports*/

var processings = [];

var charTest = /[a-z]/;

/**
 *
 * @param {ContextOfParse} contextOfParse
 * @param {String} char
 */
processings[START_STATE] = function (contextOfParse, char) {
    switch (char) {
        case '#':
            contextOfParse.state = ID_START_STATE;
            break;
        case '.':
            contextOfParse.state = CLASS_START_STATE;
            break;
        case '*':
            contextOfParse.result.tagName = '*';
            break;
        default:
            if (charTest.test(char)) {
                contextOfParse.state = TAG_STATE;
                contextOfParse.buffer = char;
            } else {
                //TODO: [dmitry.makhnev] throw error
            }
            break;
    }
};

/*@DTesting.exports*/
processingsExports.startState = processings[START_STATE];
/*@/DTesting.exports*/


/**
 *
 * @param {ContextOfParse} contextOfParse
 * @param {String} char
 */
processings[TAG_STATE] = function (contextOfParse, char) {

};

/*@DTesting.exports*/
processingsExports.tagState = processings[TAG_STATE];
/*@/DTesting.exports*/


/**
 *
 * @param {ContextOfParse} contextOfParse
 * @param {String} char
 */
processings[ID_START_STATE] = function (contextOfParse, char) {

};

/*@DTesting.exports*/
processingsExports.idStartState = processings[ID_START_STATE];
/*@/DTesting.exports*/


/**
 *
 * @param {ContextOfParse} contextOfParse
 * @param {String} char
 */
processings[ID_STATE] = function (contextOfParse, char) {

};

/*@DTesting.exports*/
processingsExports.idState = processings[ID_STATE];
/*@/DTesting.exports*/


/**
 *
 * @param {ContextOfParse} contextOfParse
 * @param {String} char
 */
processings[CLASS_START_STATE] = function (contextOfParse, char) {

};

/*@DTesting.exports*/
processingsExports.classStartState = processings[CLASS_START_STATE];
/*@/DTesting.exports*/


/**
 *
 * @param {ContextOfParse} contextOfParse
 * @param {String} char
 */
processings[CLASS_STATE] = function (contextOfParse, char) {

};

/*@DTesting.exports*/
processingsExports.classState = processings[CLASS_STATE];
/*@/DTesting.exports*/


/**
 *
 * @param {ContextOfParse} contextOfParse
 */
function processingResultState (contextOfParse) {

}

/*@DTesting.exports*/
processingsExports.processingResultState = processingResultState;
/*@/DTesting.exports*/


/**
 * 
 * @param selectorPart
 */
function parseSelector (selectorPart) {
    var contextOfParse = new ContextOfParse();
    var i = 0;
    var iMax = selectorPart.length;
    var result;

    for (; i < iMax; i += 1) {
        processings[contextOfParse.state](contextOfParse, selectorPart.charAt(i));
    }

    processingResultState(contextOfParse);
    
    result = contextOfParse.result;
    contextOfParse.destructor();
    
    return result;
}



Selector.prototype.destructor = function () {
    //TODO: [dmitry.makhnev]
};

/**
 *
 * @param {string} query
 */
module.exports = function (query) {
    return new Selector(query);
};



var error = {
    domain: 1,
    code: COMTSANTS.ERORS.AJAX,
    //[message]
};

switch (error) {
    case COMTSANTS.ERORS.AJAX:
        break;
}