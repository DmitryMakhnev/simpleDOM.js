(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["simpleDOM"] = factory();
	else
		root["simpleDOM"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var simpleDOM = {};

	simpleDOM.nodes = __webpack_require__(1);
	simpleDOM.parse = __webpack_require__(2);
	//simpleDOM.parseSelector = require('./modules/parseSelector');

	module.exports = simpleDOM;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Nodes
	 *
	 * DOM nodes
	 * */

	var simpleDOMNodes = {};
	var classyxin = __webpack_require__(3);
	var cycle = __webpack_require__(4).cycle;

	function fragmentChildNodesProcessing (fragmentChildNode, index, childNodes, nodeTo) {
	    fragmentChildNode.parentNode = nodeTo;
	    nodeTo.childNodes.push(fragmentChildNode);
	}

	var NodeWithChild = classyxin.createClass({
	    childNodes: null,
	    init: function () {
	        this.childNodes = [];
	    },

	    /**
	     *
	     * @param {NodeWithChild|Comment|Text} childNode
	     * @return {NodeWithChild}
	     */
	    appendChild: function (childNode) {
	        var node = this;
	        if (classyxin.instanceOf(childNode, Fragment)) {
	            //TODO: [dmitry.makhnev] [optional] rewrite to native if need optimizations
	            cycle(
	                childNode.childNodes,
	                fragmentChildNodesProcessing,
	                node
	            );
	            childNode.childNodes.length = 0;
	        } else {
	            if (childNode.parentNode) {
	                childNode.parentNode.removeChild(childNode);
	            }
	            childNode.parentNode = node;
	            node.childNodes.push(childNode);
	        }
	        return node;
	    },

	    /**
	     *
	     * @param {NodeWithChild|Comment|Text} removedNode
	     * @return {NodeWithChild}
	     */
	    removeChild: function (removedNode) {
	        var node = this;
	        if (removedNode.parentNode === node) {
	            node.childNodes.splice(node.childNodes.indexOf(removedNode), 1);
	            removedNode.parentNode = null;
	        }
	        return node;
	    }
	});

	//
	// Fragment
	//

	var Fragment = classyxin.createClass(
	    NodeWithChild,
	    {
	        type: 'fragment'
	    }
	);

	simpleDOMNodes.Fragment = Fragment;

	//
	// Tag
	//

	var Tag = classyxin.createClass(
	    NodeWithChild,
	    {
	        type: 'tag',
	        parentNode: null,
	        init: function (name, attributes) {
	            var tag = this;
	            tag.name = name;
	            tag.attributes = attributes || {};
	        }
	    }
	);

	simpleDOMNodes.Tag = Tag;

	//
	// Text
	//

	function Text (textContent) {
	    var text = this;
	    text.type = 'text';
	    text.text = textContent;
	    text.parentNode = null;

	}

	simpleDOMNodes.Text = Text;

	//
	// Comment
	//

	function Comment (commentContent) {
	    var comment = this;
	    comment.type = 'comment';
	    comment.text = commentContent;
	    comment.parentNode = null;
	}

	simpleDOMNodes.Comment = Comment;

	/*
	 * /Nodes
	 */

	module.exports = simpleDOMNodes;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * parse
	 *
	 * parse components
	 * */

	var simpleDOMNodes = __webpack_require__(1);
	var reversiveCycle = __webpack_require__(4).reversiveCycle;

	/*@DTesting.exports*/
	var defaultTesting = __webpack_require__(5);
	var getObjectSafely = __webpack_require__(4).getObjectSafely;
	var parseExports = getObjectSafely(defaultTesting.exports, 'simpleDOM').parse = {};
	/*@/DTesting.exports*/

	//
	// states
	//

	var stateId = 0,

	    TEXT = stateId++,

	    TAG_START = stateId++,
	    TAG_NAME = stateId++,
	    TAG_BODY = stateId++,
	    TAG_CLOSE = stateId++,

	    TAG_ATTRIBUTE_NAME = stateId++,
	    TAG_ATTRIBUTE_TO_VALUE = stateId++,
	    TAG_ATTRIBUTE_VALUE = stateId++,
	    TAG_ATTRIBUTE_VALUE_END = stateId++,

	    CLOSED_TAG_START = stateId++,
	    CLOSED_TAG_NAME = stateId++,
	    CLOSED_TAG_BODY = stateId++,

	    DECLARATION_START = stateId++,
	    COMMENT_START = stateId++,
	    COMMENT_BODY = stateId++,
	    COMMENT_END = stateId++,
	    COMMENT_CLOSE = stateId++;

	/*@DTesting.exports*/
	parseExports.states = {
	    TEXT: TEXT,

	    TAG_START: TAG_START,
	    TAG_NAME: TAG_NAME,
	    TAG_BODY: TAG_BODY,
	    TAG_CLOSE: TAG_CLOSE,

	    TAG_ATTRIBUTE_NAME: TAG_ATTRIBUTE_NAME,
	    TAG_ATTRIBUTE_TO_VALUE: TAG_ATTRIBUTE_TO_VALUE,
	    TAG_ATTRIBUTE_VALUE: TAG_ATTRIBUTE_VALUE,
	    TAG_ATTRIBUTE_VALUE_END: TAG_ATTRIBUTE_VALUE_END,

	    CLOSED_TAG_START: CLOSED_TAG_START,
	    CLOSED_TAG_NAME: CLOSED_TAG_NAME,
	    CLOSED_TAG_BODY: CLOSED_TAG_BODY,

	    DECLARATION_START: DECLARATION_START,

	    COMMENT_START: COMMENT_START,
	    COMMENT_BODY: COMMENT_BODY,
	    COMMENT_END: COMMENT_END,
	    COMMENT_CLOSE: COMMENT_CLOSE
	};
	/*@/DTesting.exports*/

	//
	// /states
	//

	//
	// ContextOfParse
	//
	/**
	 *
	 * @param {object} [settings]
	 *     @param {Boolean} [settings.isXML] XML mode flag
	 * @constructor
	 */
	function ContextOfParse (settings) {
	    var contextOfParse = this,
	        root = new simpleDOMNodes.Fragment(),
	        isXMLMode = false;

	    contextOfParse.treeStack = [root];
	    contextOfParse.result = root;

	    contextOfParse.state = TEXT;

	    contextOfParse.buffer = '';

	    contextOfParse.textBuffer = '';

	    contextOfParse.tagName = '';

	    contextOfParse.attributeName = '';
	    contextOfParse.attributeValueSeparator = '';
	    contextOfParse.attributeValue = '';

	    contextOfParse.attributes = null;

	    contextOfParse.commentBuffer = '';
	    contextOfParse.commentToken = '';

	    if (settings) {
	        if (settings.isXML) {
	            isXMLMode = true;
	        }
	    }

	    contextOfParse.isXMLMode = isXMLMode;
	}

	ContextOfParse.prototype.destructor = function () {
	    var contextOfParse = this;
	    contextOfParse.treeStack = null;
	    contextOfParse.result = null;
	    contextOfParse.state = null;
	    contextOfParse.buffer = null;
	    contextOfParse.textBuffer = null;
	    contextOfParse.tagName = null;
	    contextOfParse.attributeName = null;
	    contextOfParse.attributeValueSeparator = null;
	    contextOfParse.attributeValue = null;
	    contextOfParse.attributes = null;
	    contextOfParse.commentBuffer = null;
	    contextOfParse.commentToken = null;
	};

	/*@DTesting.exports*/
	parseExports.ContextOfParse = ContextOfParse;
	/*@/DTesting.exports*/

	//
	// /ContextOfParse
	//


	//
	// microhelpers
	//

	var letterTestRegExp = /[A-Za-z]/;

	/**
	 *
	 * @param {String} char
	 * @return {boolean}
	 */
	function isCorrectTagNameStartSymbol (char) {
	    return letterTestRegExp.test(char);
	}


	var tagNameCorrectSymbolRegExp = /\w|-|:/;

	/**
	 *
	 * @param {String} char
	 * @return {boolean}
	 */
	function isCorrectTagNameSymbol (char) {
	    return tagNameCorrectSymbolRegExp.test(char);
	}


	var whiteSpaceRegExp = /\s/;

	/**
	 *
	 * @param {String} char
	 * @return {boolean}
	 */
	function isWhiteSpace (char) {
	    return whiteSpaceRegExp.test(char);
	}

	var singletonHTMLTags = ['img', 'input', 'br', 'hr', 'link', 'meta', 'source', 'area', 'embed', 'param', 'base', 'col', 'command'];

	/**
	 *
	 * @param {String} tagName
	 * @return {Boolean}
	 */
	function isSingletonHTMLTag(tagName) {
	    return singletonHTMLTags.indexOf(tagName) !== -1;
	}


	var isCorrectAttributeNameStartSymbol = isCorrectTagNameStartSymbol;

	var isCorrectAttributeNameSymbol = isCorrectTagNameSymbol;


	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} char
	 */
	function addCharForBuffer (contextOfParse, char) {
	    contextOfParse.buffer += char;
	}

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 */
	function clearForTextState (contextOfParse) {
	    contextOfParse.textBuffer = contextOfParse.buffer;
	    contextOfParse.state = TEXT;
	}

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} [attributeValue]
	 */
	function addAttribute (contextOfParse, attributeValue) {
	    var attributes = contextOfParse.attributes,
	        u;
	    if (!attributes) {
	        contextOfParse.attributes = attributes = {};
	    }

	    attributes[contextOfParse.attributeName] = attributeValue !== u ?
	        attributeValue
	        : contextOfParse.attributeValue;

	}


	/*@DTesting.exports*/

	var microhelpersExports = parseExports.microehelpers = {};

	microhelpersExports.isCorrectTagNameStartSymbol = isCorrectTagNameStartSymbol;
	microhelpersExports.isCorrectTagNameSymbol = isCorrectTagNameSymbol;
	microhelpersExports.isWhiteSpace = isWhiteSpace;
	microhelpersExports.isSingletonHTMLTag = isSingletonHTMLTag;
	microhelpersExports.isCorrectAttributeNameStartSymbol = isCorrectAttributeNameStartSymbol;
	microhelpersExports.isCorrectAttributeNameSymbol = isCorrectAttributeNameSymbol;
	microhelpersExports.addCharForBuffer = addCharForBuffer;
	microhelpersExports.clearForTextState = clearForTextState;
	microhelpersExports.addAttribute = addAttribute;

	/*@/DTesting.exports*/

	//
	// /microhelpers
	//


	//
	// builders
	//

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 */
	function buildText (contextOfParse) {
	    var contextOfParseTreeStack,
	        newText;
	    if (contextOfParse.textBuffer) {
	        contextOfParseTreeStack = contextOfParse.treeStack;
	        newText = new simpleDOMNodes.Text(contextOfParse.textBuffer);
	        contextOfParseTreeStack[contextOfParseTreeStack.length - 1].appendChild(newText);
	        contextOfParse.textBuffer = '';
	    }
	    contextOfParse.buffer = '';

	}

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {Boolean} [isClosedTag]
	 */
	function buildTag (contextOfParse , isClosedTag) {
	    var contextOfParseTreeStack = contextOfParse.treeStack,
	        newTag,
	        tagName = contextOfParse.tagName;

	    buildText(contextOfParse);

	    newTag = new simpleDOMNodes.Tag(tagName, contextOfParse.attributes);

	    contextOfParseTreeStack[contextOfParseTreeStack.length - 1].appendChild(newTag);

	    if (
	        !isClosedTag
	        && (contextOfParse.isXMLMode || !isSingletonHTMLTag(tagName))
	    ) {
	        contextOfParseTreeStack.push(newTag);
	    }

	    contextOfParse.state = TEXT;

	}


	function closeTagNotClosedTagsCollectionProcessing (notClosedTag, index, notClosedTagsCollection, lastTreeStackTag) {
	    lastTreeStackTag.appendChild(notClosedTag);
	}

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 */
	function closeTag (contextOfParse) {
	    var tagName = contextOfParse.tagName,
	        treeStack = contextOfParse.treeStack,
	        lastTreeStackTag,
	        isHasCollection = false,
	        notClosedTagsCollection;

	    buildText(contextOfParse);

	    while (
	        (treeStack.length !== 1)
	        && ((lastTreeStackTag = treeStack.pop()).name !== tagName)
	    ) {
	        if (!isHasCollection) {
	            isHasCollection = true;
	            notClosedTagsCollection = [];
	        }

	        notClosedTagsCollection.push(lastTreeStackTag);
	    }

	    if (isHasCollection) {
	        //TODO: [dmitry.makhnev] [optional] rewrite to native if need optimizations
	        reversiveCycle(
	            notClosedTagsCollection,
	            closeTagNotClosedTagsCollectionProcessing,
	            lastTreeStackTag
	        );
	    }

	    contextOfParse.state = TEXT;
	}

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 */
	function buildComment (contextOfParse) {
	    var contextOfParseTreeStack = contextOfParse.treeStack,
	        newComment;

	    buildText(contextOfParse);

	    newComment = new simpleDOMNodes.Comment(contextOfParse.commentBuffer);

	    contextOfParseTreeStack[contextOfParseTreeStack.length - 1].appendChild(newComment);

	    contextOfParse.state = TEXT;
	}

	/*@DTesting.exports*/

	var buildersExports = parseExports.builders = {};
	buildersExports.buildText = buildText;
	buildersExports.buildTag = buildTag;
	buildersExports.closeTag = closeTag;
	buildersExports.buildComment = buildComment;

	/*@/DTesting.exports*/



	//
	// /builders
	//



	//
	// processings
	//

	var processings = [];

	/*@DTesting.exports*/

	var processingsExport = parseExports.processings = {};

	/*@/DTesting.exports*/

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} char
	 */
	processings[TEXT] = function (contextOfParse, char) {
	    addCharForBuffer(contextOfParse, char);

	    switch (char) {
	        case '<':
	            contextOfParse.state = TAG_START;
	            break;
	        default:
	            contextOfParse.textBuffer += char;
	    }
	};

	/*@DTesting.exports*/
	processingsExport.processingText = processings[TEXT];
	/*@/DTesting.exports*/

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} char
	 */
	processings[TAG_START] = function (contextOfParse, char) {
	    addCharForBuffer(contextOfParse, char);

	    if (isCorrectTagNameStartSymbol(char)) {
	        contextOfParse.state = TAG_NAME;
	        contextOfParse.tagName = char;
	        contextOfParse.attributes = null;
	    } else {
	        switch (char) {
	            case '/':
	                contextOfParse.state = CLOSED_TAG_START;
	                break;
	            case '!':
	                contextOfParse.state = DECLARATION_START;
	                break;
	            default:
	                clearForTextState(contextOfParse);
	        }
	    }
	};

	/*@DTesting.exports*/
	processingsExport.processingTagStart = processings[TAG_START];
	/*@/DTesting.exports*/

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} char
	 */
	processings[TAG_NAME] = function (contextOfParse, char) {
	    addCharForBuffer(contextOfParse, char);

	    if (isCorrectTagNameSymbol(char)) {
	        contextOfParse.tagName += char;
	    } else if (isWhiteSpace(char)) {
	        contextOfParse.state = TAG_BODY;
	    } else {
	        switch (char) {
	            case '/':
	                contextOfParse.state = TAG_CLOSE;
	                break;
	            case '>':
	                contextOfParse.state = TEXT;
	                buildTag(contextOfParse);
	                break;
	            default:
	                clearForTextState(contextOfParse);
	        }

	    }
	};

	/*@DTesting.exports*/
	processingsExport.processingTagName = processings[TAG_NAME];
	/*@/DTesting.exports*/

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} char
	 */
	processings[TAG_BODY] = function (contextOfParse, char) {
	    addCharForBuffer(contextOfParse, char);

	    if (!isWhiteSpace(char)) {
	        if (isCorrectAttributeNameStartSymbol(char)) {
	            contextOfParse.state = TAG_ATTRIBUTE_NAME;
	            contextOfParse.attributeName = char;
	        } else {
	            switch (char) {
	                case '/':
	                    contextOfParse.state = TAG_CLOSE;
	                    break;
	                case '>':
	                    buildTag(contextOfParse);
	                    break;
	                default:
	                    clearForTextState(contextOfParse);
	            }
	        }
	    }

	};

	/*@DTesting.exports*/
	processingsExport.processingTagBody = processings[TAG_BODY];
	/*@/DTesting.exports*/

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} char
	 */
	processings[TAG_ATTRIBUTE_NAME] = function (contextOfParse, char) {
	    addCharForBuffer(contextOfParse, char);

	    switch (char) {
	        case '=':
	            contextOfParse.state = TAG_ATTRIBUTE_TO_VALUE;
	            break;
	        case '>':
	            addAttribute(contextOfParse, '');
	            buildTag(contextOfParse);
	            break;
	        case '/':
	            addAttribute(contextOfParse, '');
	            contextOfParse.state = TAG_CLOSE;
	            break;
	        default:
	            if (isCorrectAttributeNameSymbol(char)) {
	                contextOfParse.attributeName += char;
	            } else if (isWhiteSpace(char)) {
	                addAttribute(contextOfParse, '');
	                contextOfParse.state = TAG_BODY;
	            } else {
	                clearForTextState(contextOfParse);
	            }
	    }
	};

	/*@DTesting.exports*/
	processingsExport.processingTagAttributeName = processings[TAG_ATTRIBUTE_NAME];
	/*@/DTesting.exports*/

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} char
	 */
	processings[TAG_ATTRIBUTE_TO_VALUE] = function (contextOfParse, char) {
	    addCharForBuffer(contextOfParse, char);

	    switch (char) {
	        case '\'':
	        case '"':
	            contextOfParse.state = TAG_ATTRIBUTE_VALUE;
	            contextOfParse.attributeValueSeparator = char;
	            contextOfParse.attributeValue = '';
	            break;
	        default:
	            clearForTextState(contextOfParse);
	    }
	};

	/*@DTesting.exports*/
	processingsExport.processingTagAttributeToValue = processings[TAG_ATTRIBUTE_TO_VALUE];
	/*@/DTesting.exports*/

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} char
	 */
	processings[TAG_ATTRIBUTE_VALUE] = function (contextOfParse, char) {
	    addCharForBuffer(contextOfParse, char);

	    if (char === contextOfParse.attributeValueSeparator) {
	        contextOfParse.state = TAG_ATTRIBUTE_VALUE_END;
	        addAttribute(contextOfParse);
	    } else {
	        contextOfParse.attributeValue += char;
	    }
	};

	/*@DTesting.exports*/
	processingsExport.processingTagAttributeValue = processings[TAG_ATTRIBUTE_VALUE];
	/*@/DTesting.exports*/

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} char
	 */
	processings[TAG_ATTRIBUTE_VALUE_END] = function (contextOfParse, char) {
	    addCharForBuffer(contextOfParse, char);

	    switch (char){
	        case '/':
	            contextOfParse.state = TAG_CLOSE;
	            break;
	        case '>':
	            buildTag(contextOfParse);
	            clearForTextState(contextOfParse);
	            break;
	        default:
	            if (isWhiteSpace(char)) {
	                contextOfParse.state = TAG_BODY;
	            } else {
	                clearForTextState(contextOfParse);
	            }
	    }
	};

	/*@DTesting.exports*/
	processingsExport.processingAttributeValueEnd = processings[TAG_ATTRIBUTE_VALUE_END];
	/*@/DTesting.exports*/

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} char
	 */
	processings[TAG_CLOSE] = function (contextOfParse, char) {
	    if (char === '>') {
	        buildTag(contextOfParse, true);
	    } else {
	        addCharForBuffer(contextOfParse, char);
	        clearForTextState(contextOfParse);
	    }
	};

	/*@DTesting.exports*/
	processingsExport.processingTagClose = processings[TAG_CLOSE];
	/*@/DTesting.exports*/

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} char
	 */
	processings[CLOSED_TAG_START] = function (contextOfParse, char) {
	    addCharForBuffer(contextOfParse, char);

	    if (isCorrectTagNameStartSymbol(char)) {
	        contextOfParse.tagName = char;
	        contextOfParse.state = CLOSED_TAG_NAME;
	    } else {
	        clearForTextState(contextOfParse);
	    }
	};

	/*@DTesting.exports*/
	processingsExport.processingClosedTagStart = processings[CLOSED_TAG_START];
	/*@/DTesting.exports*/

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} char
	 */
	processings[CLOSED_TAG_NAME] = function processingClosedTagName (contextOfParse, char) {
	    addCharForBuffer(contextOfParse, char);

	    if (isCorrectTagNameStartSymbol(char)) {
	        contextOfParse.tagName += char;
	    } else if (char === '>') {
	        closeTag(contextOfParse);
	    } else if (isWhiteSpace(char)) {
	        contextOfParse.state = CLOSED_TAG_BODY;
	    } else {
	        clearForTextState(contextOfParse);
	    }
	};

	/*@DTesting.exports*/
	processingsExport.processingClosedTagName = processings[CLOSED_TAG_NAME];
	/*@/DTesting.exports*/

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} char
	 */
	processings[CLOSED_TAG_BODY] = function (contextOfParse, char) {
	    addCharForBuffer(contextOfParse, char);

	    if (char === '>') {
	        closeTag(contextOfParse);
	    } else if (!isWhiteSpace(char)) {
	        clearForTextState(contextOfParse);
	    }
	};

	/*@DTesting.exports*/
	processingsExport.processingClosedTagBody = processings[CLOSED_TAG_BODY];
	/*@/DTesting.exports*/

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} char
	 */
	processings[DECLARATION_START] = function (contextOfParse, char) {
	    addCharForBuffer(contextOfParse, char);

	    if (char === '-') {
	        contextOfParse.state = COMMENT_START;
	    } else {
	        clearForTextState(contextOfParse);
	    }
	};

	/*@DTesting.exports*/
	processingsExport.processingDeclarationStart = processings[DECLARATION_START];
	/*@/DTesting.exports*/

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} char
	 */
	processings[COMMENT_START] = function (contextOfParse, char) {
	    addCharForBuffer(contextOfParse, char);

	    if (char === '-') {
	        contextOfParse.state = COMMENT_BODY;
	        contextOfParse.commentBuffer = '';
	    } else {
	        clearForTextState(contextOfParse);
	    }

	};

	/*@DTesting.exports*/
	processingsExport.processingCommentStart = processings[COMMENT_START];
	/*@/DTesting.exports*/


	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} char
	 */
	processings[COMMENT_BODY] = function (contextOfParse, char) {
	    addCharForBuffer(contextOfParse, char);

	    if (char === '-') {
	        contextOfParse.state = COMMENT_END;
	        contextOfParse.commentToken = char;
	    } else {
	        contextOfParse.commentBuffer += char;
	    }
	};

	/*@DTesting.exports*/
	processingsExport.processingCommentBody = processings[COMMENT_BODY];
	/*@/DTesting.exports*/

	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} char
	 */
	processings[COMMENT_END] = function (contextOfParse, char) {
	    addCharForBuffer(contextOfParse, char);

	    if (char === '-') {
	        contextOfParse.state = COMMENT_CLOSE;
	        contextOfParse.commentToken += char;
	    } else {
	        contextOfParse.state = COMMENT_BODY;
	        contextOfParse.commentBuffer += contextOfParse.commentToken + char;
	    }

	};

	/*@DTesting.exports*/
	processingsExport.processingCommentEnd = processings[COMMENT_END];
	/*@/DTesting.exports*/


	/**
	 *
	 * @param {ContextOfParse} contextOfParse
	 * @param {String} char
	 */
	processings[COMMENT_CLOSE] = function processingCommentClose (contextOfParse, char) {

	    if (char === '>') {
	        buildComment(contextOfParse);
	    } else {
	        addCharForBuffer(contextOfParse, char);
	        contextOfParse.state = COMMENT_BODY;
	        contextOfParse.commentBuffer += contextOfParse.commentToken + char;
	    }

	};

	/*@DTesting.exports*/
	processingsExport.processingCommentClose = processings[COMMENT_CLOSE];
	/*@/DTesting.exports*/

	function processingResultState (contextOfParse) {
	    if (contextOfParse.buffer !== '') {
	        contextOfParse.textBuffer = contextOfParse.buffer;
	        buildText(contextOfParse);
	    }
	}

	/*@DTesting.exports*/
	processingsExport.processingResultState = processingResultState;
	/*@/DTesting.exports*/

	//
	// /processings
	//



	/**
	 *
	 * @param {String} xml
	 * @return {Object} simpleDOM
	 */
	module.exports = function (xml) {
	    var contextOfParse = new ContextOfParse();
	    var i = 0;
	    var iMax = xml.length;
	    var result;

	    //Info Comment [dmitry.makhnev] use native cycle because this is bottleneck
	    for (; i < iMax; i += 1) {
	        processings[contextOfParse.state](contextOfParse, xml.charAt(i));
	    }

	    processingResultState(contextOfParse);

	    result = contextOfParse.result;
	    contextOfParse.destructor();

	    return result;
	};

	/*
	 * /parse
	 */


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var index = 1;

	//utils

	/**
	 *
	 * @param {Object} objectForm
	 * @param {Object} objectTo
	 * @param {Function} [filter]
	 * @return {Object} objectTo
	 */
	function mergeObject (objectForm, objectTo, filter) {
	    for (var p in objectForm) {
	        if (objectForm.hasOwnProperty(p)
	            && (!filter || filter(p))) {
	            objectTo[p] = objectForm[p];
	        }
	    }
	    return objectTo
	}


	/**
	 *
	 * @param {String} property
	 * @return {Boolean}
	 */
	function mergePrototypesFilter (property) {
	    switch (property){
	        case 'init':
	        case 'destructor':
	        case '__Constructor':
	        case 'construct':
	            return false;
	    }
	    return true;
	}

	/**
	 *
	 * @param {Array} arrayFrom
	 * @param {Array} arrayTo
	 * @return {Array} arrayTo
	 */
	function mergeArrays (arrayFrom, arrayTo) {
	    for (var i = 0, iMax = arrayFrom.length; i < iMax; i += 1) {
	        arrayTo.push(arrayFrom[i]);
	    }
	    return arrayTo;
	}


	/**
	 *
	 * @param {Array} collections
	 * @return {Boolean}
	 */
	function collectionContainsElements (collections) {
	    return collections.length !== 0;
	}

	var isArray;

	if (Array.isArray) {
	    isArray = Array.isArray;
	} else {
	    var toString = Object.prototype.toString;

	    /**
	    *
	    * @param {*} verifiable
	    * @return {boolean}
	    */
	    isArray = function (verifiable) {
	        return toString.call(verifiable) === '[object Array]';
	    }
	}

	/**
	 *
	 * @return {ClassConstructor}
	 */
	function createClassConstructor () {
	    function ClassConstructor () {
	        var self = this;
	        var initCollection = self.__Constructor.__inits;

	        if (initCollection) {
	            var i = 0;
	            var iMax = initCollection.length;

	            for (; i < iMax; i += 1) {
	                initCollection[i].apply(self, arguments);
	            }
	        }

	        if (self.construct) {
	            self.construct.apply(self, arguments);
	        }

	        return self;
	    }

	    ClassConstructor.__cmId = index;
	    ClassConstructor.prototype.__Constructor = ClassConstructor;
	    index += 1;

	    return ClassConstructor;
	}

	function commonDestructor () {
	    var self = this;
	    var destructorCollection = self.__Constructor.__destructors;

	    if (destructorCollection) {
	        var i = destructorCollection.length;
	        while (i--) {
	            destructorCollection[i].apply(self, arguments);
	        }
	    }
	}

	/**
	 *
	 * @param {ClassConstructor} ClassConstructor
	 * @param {Object} settings
	 * @param {Boolean} [notAutoDestruct]
	 * @constructor
	 */
	function ParentConfigurator (ClassConstructor, settings, notAutoDestruct) {
	    var parentConfigurator = this;
	    parentConfigurator.parent = ClassConstructor;
	    parentConfigurator.settings = settings;
	    parentConfigurator.notAutoDestruct = notAutoDestruct || false;
	}

	ParentConfigurator.prototype.destructor = function () {
	    var parentConfigurator = this;
	    parentConfigurator.parent = null;
	    parentConfigurator.settings = null;
	};

	/**
	 *
	 * @param {Object} base
	 * @constructor
	 */
	function Mixin (base) {
	    var mixin = this;
	    mixin.base = base;
	    mixin.__mixinId = index;
	    index += 1;
	}

	Mixin.prototype.destructor = function () {
	    var mixin = this;
	    mixin.base = null;
	    mixin.__mixinId = null;
	};


	//parts detectors

	/**
	 *
	 * @param {*} verifiable
	 * @return {boolean}
	 */
	function isParent (verifiable) {
	    return typeof verifiable === 'function';
	}

	/**
	 *
	 * @param {*} verifiable
	 * @return {boolean}
	 */
	function isParentConfiguration (verifiable) {
	    return verifiable instanceof ParentConfigurator;
	}

	/**
	 *
	 * @param {*} verifiable
	 * @return {boolean}
	 */
	function isMixin (verifiable) {
	    return verifiable instanceof Mixin;
	}

	/**
	 *
	 * @param {*} verifiable
	 * @return {boolean}
	 */
	function isClassPrototype (verifiable) {
	    return !isParent(verifiable)
	        && !isParentConfiguration(verifiable)
	        && !isMixin(verifiable);
	}

	var classyxin = {
	    /**
	     *
	     * @return {ClassConstructor}
	     */
	    createClassConstructor: createClassConstructor,

	    //export ParentConfigurator constructor
	    ParentConfigurator: ParentConfigurator,

	    /**
	     *
	     * @param {ClassConstructor} Parent
	     * @param {Object} settings
	     * @param {Boolean} [notAutoDestruct]
	     * @return {ParentConfigurator}
	     */
	    configureParent: function (Parent, settings, notAutoDestruct) {
	        return new ParentConfigurator(Parent, settings, notAutoDestruct);
	    },

	    //export Mixin constructor
	    Mixin: Mixin,

	    /**
	     *
	     * @param {Object} base
	     * @return {Mixin}
	     */
	    createMixin: function (base) {
	        return new Mixin(base);
	    },

	    /**
	     *
	     * @param {ClassConstructor} [ParentConstructor...]
	     * @param {ParentConfigurator} [ParentConfigurator...]
	     * @param {Mixin} [Mixin...]
	     * @param {Object} [prototypePart]
	     * @return {ClassConstructor}
	     */
	    createClass: function () {

	        //parse arguments
	        var args = arguments;
	        var classPrototype;
	        var lastArgument;

	        if (args.length > 0) {
	            lastArgument = args[args.length - 1];

	            if (isClassPrototype(lastArgument)) {
	                classPrototype = lastArgument;
	            }
	        }

	        var prototypeExtend;
	        var prototypeExtendPart = null;

	        var classesIds = [];
	        var mixinsIds = [];
	        var inits = [];
	        var destructors = [];

	        function processingParent (parent, parentSettings) {
	            //add parent parents ids
	            if (parent.__classesIds) {
	                mergeArrays(parent.__classesIds, classesIds);
	            }
	            //add parent id
	            if (parent.__cmId) {
	                classesIds.push(parent.__cmId);
	            }

	            //add parent inits
	            if (parent.__inits) {
	                mergeArrays(parent.__inits, inits);
	            }

	            //check need parent init
	            if (parent.prototype.init
	                && parentSettings
	                && (parentSettings.needInit === false)) {
	                inits.pop();
	            }

	            //add parent mixins ids
	            if (parent.__mixinsIds) {
	                mergeArrays(parent.__mixinsIds, mixinsIds);
	            }

	            //add parent destructors
	            if (parent.__destructors) {
	                mergeArrays(parent.__destructors, destructors);
	            }

	            //check need parent init
	            if (parent.prototype.destructor
	                && parentSettings
	                && (parentSettings.needDestructor === false)) {
	                destructors.pop();
	            }


	            prototypeExtendPart = parent.prototype;
	        }

	        var i;
	        var iMax;
	        var argument;

	        for (i = 0, iMax = args.length; i < iMax; i += 1) {
	            argument = args[i];

	            if (isParent(argument)) {
	                processingParent(argument);

	            } else if (isParentConfiguration(argument)) {
	                processingParent(argument.parent, argument.settings);
	                if (!argument.notAutoDestruct) {
	                    argument.destructor();
	                }

	            } else if (isMixin(argument)) {
	                mixinsIds.push(argument.__mixinId);
	                prototypeExtendPart = argument.base;
	            }

	            if (prototypeExtendPart) {
	                if (!prototypeExtend) {
	                    prototypeExtend = {};
	                }

	                mergeObject(
	                    prototypeExtendPart,
	                    prototypeExtend,
	                    mergePrototypesFilter
	                );

	                prototypeExtendPart = null;
	            }
	        }

	        //processing prototype
	        if (prototypeExtend) {
	            if (classPrototype) {
	                mergeObject(classPrototype, prototypeExtend);
	            }
	            classPrototype = prototypeExtend;
	        }

	        //create class constructor
	        var ClassConstructor = createClassConstructor();

	        if (classPrototype) {
	            ClassConstructor.prototype = classPrototype;
	        }

	        var ClassConstructorPrototype = ClassConstructor.prototype;

	        ClassConstructorPrototype.__Constructor = ClassConstructor;

	        //extend class data from class
	        classesIds.push(ClassConstructor.__cmId);

	        if (ClassConstructorPrototype.destructor) {
	            destructors.push(ClassConstructorPrototype.destructor);
	        }

	        if (ClassConstructorPrototype.init) {
	            inits.push(ClassConstructorPrototype.init);
	        }

	        //extend class constructors
	        ClassConstructor.__classesIds = classesIds;

	        if (collectionContainsElements(mixinsIds)) {
	            ClassConstructor.__mixinsIds = mixinsIds;
	        }

	        if (collectionContainsElements(inits)) {
	            ClassConstructor.__inits = inits;
	        }

	        if (collectionContainsElements(destructors)) {
	            ClassConstructor.__destructors = destructors;
	        }


	        ClassConstructorPrototype.destructor = commonDestructor;

	        return ClassConstructor;
	    },

	    /**
	     *
	     * @param {Object} instance
	     * @param {ClassConstructor} VerifiableConstructor
	     * @return {boolean}
	     */
	    instanceOf: function (instance, VerifiableConstructor) {
	        var Constructor = instance.__Constructor;
	        if (Constructor) {
	            var classesIds = Constructor.__classesIds;
	            if (classesIds) {
	                return classesIds.indexOf(VerifiableConstructor.__cmId) !== -1;
	            }
	        }
	        return false;
	    },

	    /**
	     *
	     * @param {Object} mixInstance
	     * @param {Mixin} mixin
	     * @return {boolean}
	     */
	    hasMixin: function (mixInstance, mixin) {
	        var Constructor = mixInstance.__Constructor;
	        if (Constructor) {
	            var mixinsIds = Constructor.__mixinsIds;
	            if (mixinsIds) {
	                return mixinsIds.indexOf(mixin.__mixinId) !== -1;
	            }
	        }
	        return false;
	    },

	    /**
	     *
	     * @param {Object} instance
	     * @param {ClassConstructor} ParentClass
	     * @param {*|Array} [param...]
	     * @return {Object} instance
	     */
	    callConstruct: function (instance, ParentClass, param) {
	        var constructor = ParentClass.prototype.construct;
	        if (constructor) {
	            if (isArray(param)) {
	                constructor.apply(instance, param);
	            } else {
	                constructor.call(instance, param);
	            }
	        }
	        return instance;
	    }
	};

	module.exports = classyxin;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var defaultLib = {};

	defaultLib.getGlobal = __webpack_require__(6);
	defaultLib.typesDetection = __webpack_require__(7);

	defaultLib.getObjectKeys = __webpack_require__(8);
	defaultLib.getObjectLength = __webpack_require__(9);
	defaultLib.getObjectSafely = __webpack_require__(10);
	defaultLib.getObjectFiled = __webpack_require__(11);

	defaultLib.cycleKeys = __webpack_require__(12);
	defaultLib.cycle = __webpack_require__(13);
	defaultLib.reversiveCycle = __webpack_require__(14);

	defaultLib.customEvents = __webpack_require__(15);

	defaultLib.onload = __webpack_require__(16);

	module.exports = defaultLib;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var defaultTesting = {};

	defaultTesting.exports = {};
	defaultTesting.utils = {};
	defaultTesting.utils.createTag = __webpack_require__(17);

	module.exports = defaultTesting;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var _global = this.window || global;

	/**
	 *
	 * @return {Window|Object}
	 */
	module.exports = function () {
	    return _global;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	
	var typesDetection = {},
	    toString = Object.prototype.toString;

	typesDetection.isArray = Array.isArray || function (verifiable) {
	    return toString.call(verifiable) === '[object Array]';
	};

	typesDetection.isNodesCollection = function (verifiable) {
	    return document
	        && ((verifiable instanceof HTMLCollection)
	            || (verifiable instanceof NodeList));
	};

	var types = ['Object', 'Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Boolean'],
	    i = types.length;

	function createTypeDetector (typeName) {
	    return function (verifiable) {
	        return toString.call(verifiable) === '[object ' + typeName + ']';
	    }
	}

	for (; i-- ;){
	    typesDetection['is' + types[i]] = createTypeDetector(types[i]);
	}

	typesDetection.isCollection = function (verifiable) {
	    return typesDetection.isArray(verifiable)
	        || typesDetection.isNodesCollection(verifiable)
	        || typesDetection.isArguments(verifiable);
	};

	module.exports = typesDetection;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var getObjectKeys;
	if (Object.keys) {
	    /**
	     *
	     * @param {Object} object
	     * @return {Array}
	     */
	    getObjectKeys = function (object) {
	        return Object.keys(object);
	    };
	} else {
	    /**
	     *
	     * @param {Object} object
	     * @return {Array}
	     */
	    getObjectKeys = function (object) {
	        var p,
	            keys = [];

	        for (p in object) {
	            if (object.hasOwnProperty(p)) {
	                keys.push(p);
	            }
	        }

	        return keys;
	    };
	}

	module.exports = getObjectKeys;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var getObjectKeys = __webpack_require__(8);

	/**
	 *
	 * @param {Object} object
	 * @return {Number}
	 */
	module.exports = function (object) {
	    return getObjectKeys(object).length;
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var typesDetection = __webpack_require__(7);
	var cycleKeys = __webpack_require__(12);
	var cycle = __webpack_require__(13);

	/**
	 *
	 * @param {Object} object
	 * @param {String|...} [property]
	 * @return {Object|null} result
	 */
	module.exports = function (object, property) {
	    cycle(arguments, function (property) {
	        if (!object.hasOwnProperty(property)) {
	            object[property] = {}
	        } else if (!typesDetection.isObject(object[property])) {
	            object = null;
	            return cycleKeys.stopKey;
	        }
	        object = object[property];
	    }, null, null, 1, 1);

	    return object;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * безоасно получить значение сквозь вложенные объекты
	 * @param {Object} object
	 * @param {String|Number|Array} [key] object keys
	 * @returns {*} result || null
	 */
	module.exports = function(object, key){
	    var keyTypeof = typeof key;
	    var i;
	    var iMax;
	    var keysList;
	    var cache;
	    var result;
	    var undefined;

	    if (object){
	        if ((keyTypeof !== 'string')
	            && (keyTypeof !== 'number')){
	            keysList = key;
	            i = 0;
	        } else{
	            keysList = arguments;
	            i = 1;
	        }
	        iMax = keysList.length - 1;
	        for (; i < iMax; i += 1){
	            cache = object[keysList[i]];
	            if (cache === undefined){
	                return null;
	            } else{
	                object = cache;
	            }
	        }
	        result = object[keysList[i]];
	        if (result !== undefined){
	            return result;
	        }
	    }
	    return null;
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	function CycleStopKey () {}
	    function CycleStopObject () {
	    this.result = null;
	}
	CycleStopObject.prototype = new CycleStopKey();

	module.exports = {
	    StopKey: CycleStopKey,
	    stopKey: new CycleStopKey(),

	    StopObject: CycleStopObject,
	    stopObject: new CycleStopObject()
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var getGlobal = __webpack_require__(6);
	var cycleKeys = __webpack_require__(12);
	var typesDetection = __webpack_require__(7);
	var getObjectKeys = __webpack_require__(8);


	/**
	 *
	 * @param {Array|Object|String} cycleable
	 * @param {Function} fn
	 * @param {*} [fnData]
	 * @param {*} [ctx]
	 * @param {Number} [step]
	 * @param {Number} [start]
	 * @returns {*}
	 */
	module.exports = function(cycleable, fn, fnData, ctx, step, start){
	    var i,
	        iMax,
	        propertyName,
	        fnResult,
	        keys,
	        result;
	    if (cycleable){
	        //TODO: [dmitry.makhnev]
	        ctx = ctx || getGlobal();
	        step = step || 1;
	        i = start || 0;
	        if (typesDetection.isString(cycleable)) {
	            for (iMax = cycleable.length; i < iMax; i += step) {
	                fnResult = fn.call(ctx, cycleable.charAt(i), i, cycleable, fnData);
	                if (fnResult instanceof cycleKeys.StopKey) {
	                    break;
	                }
	            }
	        } else if (typesDetection.isCollection(cycleable)) {
	            for (iMax = cycleable.length; i < iMax; i += step) {
	                fnResult = fn.call(ctx, cycleable[i], i, cycleable, fnData);
	                if (fnResult instanceof cycleKeys.StopKey) {
	                    break;
	                }
	            }
	        } else if (typesDetection.isObject(cycleable)){
	            //if simple rules use for in
	            if ((i === 0) && (step === 1)) {
	                for (propertyName in cycleable) {
	                    if (cycleable.hasOwnProperty(propertyName)) {
	                        fnResult = fn.call(ctx, cycleable[propertyName], propertyName, cycleable, fnData);
	                        if (fnResult instanceof cycleKeys.StopKey) {
	                            break;
	                        }
	                    }
	                }
	            } else {
	                keys = getObjectKeys(cycleable);
	                for (iMax = keys.length; i < iMax; i += step) {
	                    propertyName = keys[i];
	                    fnResult = fn.call(ctx, cycleable[propertyName], propertyName, cycleable, fnData);
	                    if (fnResult instanceof cycleKeys.StopKey) {
	                        break;
	                    }
	                }
	            }
	        }
	    }
	    if (fnResult === cycleKeys.stopObject) {
	        result = fnResult.result;
	        fnResult.result = null;
	        return result;
	    }
	    return cycleable;
	};



/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var getGlobal = __webpack_require__(6);
	var cycleKeys = __webpack_require__(12);
	var typesDetection = __webpack_require__(7);
	var getObjectKeys = __webpack_require__(8);

	/**
	 *
	 * @param {Array|Object|String} cycleable
	 * @param {Function} fn
	 * @param {*} [fnData]
	 * @param {*} [ctx]
	 * @param {Number} [step]
	 * @param {Number} [start]
	 * @returns {Array|Object|String} cycleable
	 */
	module.exports = function (cycleable, fn, fnData, ctx, step, start) {
	    var i,
	        propertyName,
	        fnResult,
	        keys,
	        result;
	    if (cycleable) {
	        //TODO: [dmitry.makhnev] 
	        ctx = ctx || getGlobal();
	        step = step || 1;
	        if (typesDetection.isString(cycleable)) {
	            for (i = start || (cycleable.length - 1); i >= 0; i -= step) {
	                fnResult = fn.call(ctx, cycleable.charAt(i), i, cycleable, fnData);
	                if (fnResult instanceof cycleKeys.StopKey) {
	                    break;
	                }
	            }
	        } else if (typesDetection.isCollection(cycleable)) {
	            for (i = start || (cycleable.length - 1); i >= 0; i -= step) {
	                fnResult = fn.call(ctx, cycleable[i], i, cycleable, fnData);
	                if (fnResult instanceof cycleKeys.StopKey) {
	                    break;
	                }
	            }
	        } else if (typesDetection.isObject(cycleable)) {
	            keys = getObjectKeys(cycleable);
	            for (i = start || (keys.length - 1); i >= 0; i -= step) {
	                propertyName = keys[i];
	                fnResult = fn.call(ctx, cycleable[propertyName], propertyName, cycleable, fnData);
	                if (fnResult instanceof cycleKeys.StopKey) {
	                    break;
	                }
	            }
	        }
	    }
	    if (fnResult === cycleKeys.stopObject) {
	        result = fnResult.result;
	        fnResult.result = null;
	        return result;
	    }
	    return cycleable;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var cycleKeys = __webpack_require__(12);
	var cycle = __webpack_require__(13);
	var targets = [];
	var targetsEvents = [];

	/**
	 *
	 * @param {Object} eventData
	 * @param {Function} handler
	 * @param {*} ctx
	 * @param {*} data
	 */
	function addEvent (eventData, handler, ctx, data) {
	    eventData.handlersData.push(handler, ctx, data);
	}

	/**
	 *
	 * @param {Object} eventData
	 * @param {Function} handler
	 * @param {*} ctx
	 * @param {Number} targetIndex
	 * @param {String} eventName
	 */
	function removeHandlerEvent (eventData, handler, ctx, targetIndex, eventName) {
	    var handlersData = eventData.handlersData;
	    //find and remove handler
	    cycle(
	        handlersData,
	        detectAndRemoveHandler,
	        {
	            handler: handler,
	            ctx: ctx
	        },
	        null,
	        3
	    );
	    //check data for removing
	    if (handlersData.length === 0) {
	        removeEvent(targetIndex, eventName);
	    }
	}

	/**
	 *
	 * @param {Number} targetIndex
	 * @param {String} eventName
	 */
	function removeEvent (targetIndex, eventName) {
	    var targetEvents = targetsEvents[targetIndex];
	    if (targetEvents[eventName]) {
	        targetEvents[eventName] = null;
	        targetEvents._quantity -= 1;
	        if (targetEvents._quantity === 0) {
	            clearTarget(targetIndex)
	        }
	    }
	}

	/**
	 *
	 * @param {Number} targetIndex
	 */
	function clearTarget (targetIndex) {
	    targets.splice(targetIndex, 1);
	    targetsEvents.splice(targetIndex, 1);
	}

	/**
	 *
	 * @param {Function} handler
	 * @param {Number} index
	 * @param {Array} handlersDataList
	 * @param {Object} removed
	 * @return {exports.stopKey|*}
	 */
	function detectAndRemoveHandler (handler, index, handlersDataList, removed) {
	    if ((handler === removed.handler)
	        && (handlersDataList[index + 1] === removed.ctx)) {
	        handlersDataList.splice(index, 3);
	        return cycleKeys.stopKey;
	    }
	}

	//this === target
	/**
	 *
	 * @param {Function} handler
	 * @param {Number} index
	 * @param {Array} handlersDataList
	 * @param {Array} parameters
	 */
	function handlersDispatchProcessingIteration (handler, index, handlersDataList, parameters) {
	    var data = handlersDataList[index + 2],
	        ctx = handlersDataList[index + 1] || this;
	    if (parameters){
	        if (data) {
	            parameters.unshift(data);
	            handler.apply(ctx, parameters);
	            parameters.shift();
	        } else{
	            handler.apply(ctx, parameters);
	        }
	    } else{
	        handler.call(ctx, data);
	    }
	}

	/**
	 *
	 * @param {Function} handler
	 * @param {Number} index
	 * @param {Array} turn
	 * @param {Object} eventData
	 */
	function turnForAddingProcessingIteration (handler, index, turn, eventData) {
	    addEvent(
	        eventData,
	        handler,
	        turn[index + 1],
	        turn[index + 2]
	    );
	}

	/**
	 *
	 * @param {Function} handler
	 * @param {Number} index
	 * @param {Array} turn
	 * @param {Object} turnForRemovingData
	 */
	function turnForRemovingProcessingIteration (handler, index, turn, turnForRemovingData) {
	    removeHandlerEvent(
	        turnForRemovingData.eventData,
	        handler,
	        turn[index + 1],
	        turnForRemovingData.targetIndex,
	        turnForRemovingData.eventName
	    );
	}

	module.exports = {
	    /**
	     *
	     * @param {*} target
	     * @param {String} eventName
	     * @param {Function} handler
	     * @param {Object|Array} [ctx]
	     * @param {*} [data]
	     * @returns {*} target
	     */
	    add: function (target, eventName, handler, ctx, data) {
	        var index = targets.indexOf(target),
	            targetEvents,
	            eventData;

	        if (index === -1) {
	            index = targets.push(target);
	            index -= 1;

	            targetEvents = {
	                //events size cache: performance optimisation for check remove targetEvents and target
	                _quantity: 0
	            };
	            targetsEvents[index] = targetEvents;
	        } else {
	            targetEvents = targetsEvents[index];
	        }

	        eventData = targetEvents[eventName];

	        if (eventData) {
	            if (eventData.isDispatching) {
	                eventData.turnForAdding.push(handler, ctx, data);
	            } else {
	                addEvent(eventData, handler, ctx, data);
	            }
	        } else {
	            targetEvents[eventName] = {
	                isDispatching: false,
	                handlersData: [handler, ctx, data],
	                turnForAdding: [],
	                turnForRemoving: []
	            };
	            targetEvents._quantity += 1
	        }

	        return target;

	    },

	    /**
	     *
	     * @param {*} target
	     * @param {String} eventName
	     * @param {Function} handler
	     * @param {Object|Array} [ctx]
	     * @returns {*} target
	     */
	    remove: function (target, eventName, handler, ctx) {
	        var index = targets.indexOf(target),
	            eventData;

	        if (index !== -1){
	            eventData = targetsEvents[index][eventName];
	            if (eventData.isDispatching) {
	                eventData.turnForRemoving.push(handler, ctx);
	            } else {
	                removeHandlerEvent(eventData, handler, ctx, index, eventName);
	            }
	        }

	        return target;
	    },

	    /**
	     *
	     * @param {*} target
	     * @param {String} eventName
	     * @param {*|...} [parameter]
	     * @returns {*} target
	     */
	    dispatch: function (target, eventName, parameter) {
	        var index = targets.indexOf(target),
	            eventData,
	            parameters;

	        if (index !== -1) {
	            eventData = targetsEvents[index][eventName];
	            if (eventData && !eventData.isDispatching) {
	                //check parameters
	                if (arguments.length !== 2) {
	                    parameters = Array.prototype.slice.call(arguments, 2);
	                }

	                eventData.isDispatching = true;

	                cycle(
	                    eventData.handlersData,
	                    handlersDispatchProcessingIteration,
	                    parameters,
	                    target,
	                    3
	                );

	                eventData.isDispatching = false;

	                if (eventData.turnForAdding.length !== 0) {
	                    cycle(
	                        eventData.turnForAdding,
	                        turnForAddingProcessingIteration,
	                        eventData,
	                        null,
	                        3
	                    );
	                    eventData.turnForAdding.length = 0;
	                }

	                if (eventData.turnForRemoving.length !== 0) {
	                    cycle(
	                        eventData.turnForRemoving,
	                        turnForRemovingProcessingIteration,
	                        {
	                            eventData: eventData,
	                            eventName: eventName,
	                            targetIndex: index
	                        },
	                        null,
	                        2
	                    );
	                    eventData.turnForRemoving.length = 0;
	                }
	            }
	        }

	        return target;
	    },

	    /**
	     *
	     * @param {*} target
	     * @param {String} [eventName]
	     * @returns {*} target
	     */
	    removeAll: function (target, eventName) {
	        var index = targets.indexOf(target);
	        if (index !== -1) {
	            if (eventName){
	                removeEvent(index, eventName);
	            } else {
	                clearTarget(index);
	            }
	        }
	        return target;
	    }
	};

	//data structure
	//list target objects
	//[HTMLElement, ...]
	//list events on target by index
	//[{
	//    click: {
	//        isDispatching: false,
	//        handlersData: [handler, ctx, data, handler, ctx, data, handler, ctx, data],
	//        turnForAdding: [handler, ctx, data],
	//        turnForRemoving: [handler, ctx]
	//    },
	//    change: {
	//        isDispatching: false,
	//        handlersData: [handler, ctx, data],
	//        turnForAdding: [],
	//        turnForRemoving: []
	//    },
	//    //events size cache: performance optimisation for check remove targetEvents and target
	//    _quantity: 2
	//},...]


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 *
	 * @param callback
	 */
	module.exports = function (callback) {
	    callback();
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var cycle = __webpack_require__(4).cycle;
	var singletonHTMLTags = ['img', 'input', 'br', 'hr', 'link', 'meta', 'source', 'area', 'embed', 'param', 'base', 'col', 'command'];

	/**
	 *
	 * @param {String} tagName
	 * @param {Object} attributes
	 * @param {String} contentItem html text
	 * @return {String} html text
	 */
	module.exports = function (tagName, attributes, contentItem) {
	    var attributesString = '',
	        content = '',
	        result;
	    if (attributes) {
	        cycle(attributes, function (value, key) {
	            attributesString += ' ' + key + '="' + value + '"';
	        });
	    }
	    if (singletonHTMLTags.indexOf(tagName) === -1) {
	        if (contentItem) {
	            cycle(arguments, function (contentItem) {
	                content += contentItem;
	            }, null, null, 1, 2);
	        }
	        result = '<' + tagName + attributesString + '>' + content + '</' + tagName + '>';
	    } else {
	        result = '<' + tagName + attributesString + ' />';
	    }

	    return result;
	};

/***/ }
/******/ ])
});
;