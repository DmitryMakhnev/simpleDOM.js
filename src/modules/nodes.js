/*
 * Nodes
 *
 * DOM nodes
 * */

var simpleDOMNodes = {};
var classyxin = require('classyxin');
var cycle = require('default-lib').cycle;

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
