var classyxin = require('classyxin');
var Node = require('./Node');

var Text = classyxin.createClass(
    Node,
    {
        type: 'text',
        init: function (textContent) {
            this.text = textContent;
        }
    }
);

module.exports = Text;