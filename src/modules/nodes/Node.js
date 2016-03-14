var classyxin = require('classyxin');

/**
 * @constructor
 */
var Node = classyxin.createClass({
    type: null,
    parentNode: null,

    _processingSelfAppend: function (newParentNode) {
        var node = this;
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        node.parentNode = newParentNode;
        newParentNode.childNodes.push(node);
    },
    
    wrap: function (wrappingTag) {
        var node = this;
        var parent = node.parentNode;
        var currentTagIndex = parent.childNodes.indexOf(node);
        node.parentNode = null;
        parent.childNodes[currentTagIndex] = wrappingTag;
        wrappingTag.appendChild(node);
        return node;
    }

});

module.exports = Node;