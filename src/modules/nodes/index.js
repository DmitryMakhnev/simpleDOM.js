var nodes = {};

nodes.Node = require('./Node');
nodes.NodeWithChild = require('./NodeWithChild');

nodes.Tag = require('./Tag');
nodes.Fragment = require('./Fragment');

nodes.Comment = require('./Comment');
nodes.Text = require('./Text');

module.exports = nodes;