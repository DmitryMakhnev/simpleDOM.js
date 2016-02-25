var classyxin = require('classyxin');
var Node = require('./Node');

/**
 * 
 * @constructor
 * @extends {nodes.Node}
 */
var NodeWithChild = classyxin.createClass(
    Node,
    {
        childNodes: null,
        init: function () {
            this.childNodes = [];
        },

        /**
         *
         * @param {Node|Comment|Text} childNode
         * @return {NodeWithChild}
         */
        appendChild: function (childNode) {
            var node = this;
            childNode._processingSelfAppend(node);
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
    }
);

module.exports = NodeWithChild;