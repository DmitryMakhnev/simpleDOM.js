var classyxin = require('classyxin');
var NodeWithChild = require('./NodeWithChild');
var cycle = require('default-lib').cycle;

function fragmentAppendChildNodesProcessing (fragmentChildNode, index, childNodes, nodeTo) {
    fragmentChildNode.parentNode = nodeTo;
    nodeTo.childNodes.push(fragmentChildNode);
}

var Fragment = classyxin.createClass(
    NodeWithChild,
    {
        type: 'fragment',
        _processingSelfAppend: function (newParentNode) {
            var fragment = this;
            var childNodes = fragment.childNodes;
            cycle(
                childNodes,
                fragmentAppendChildNodesProcessing,
                newParentNode
            );
            childNodes.length = 0;
            return fragment;
        }

    }
);

module.exports = Fragment;