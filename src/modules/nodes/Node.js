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
    }

});

module.exports = Node;