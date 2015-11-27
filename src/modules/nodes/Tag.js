var classyxin = require('classyxin');
var NodeWithChild = require('./NodeWithChild');

var Tag = classyxin.createClass(
    NodeWithChild,
    {
        type: 'tag',
        init: function (name, attributes) {
            var tag = this;
            tag.name = name;
            //TODO: [dmitry.makhnev] todo void attributes
            tag.attributes = attributes || {};
        }
    }
);

module.exports = Tag;