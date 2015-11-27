var classyxin = require('classyxin');
var Node = require('./Node');

var Comment = classyxin.createClass(
    Node,
    {
        type: 'comment',
        init: function (commentContent) {
            this.text = commentContent;
        }
    }
);

module.exports = Comment;