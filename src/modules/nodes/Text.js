var classyxin = require('classyxin');
var Node = require('./Node');

var Text = classyxin.createClass(
    Node,
    {
        type: 'text',
        init: function (textContent) {
            this.nodeValue = textContent;
        }
    }
);

module.exports = Text;