"use strict";

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _apolloServerExpress = require("apollo-server-express");

var _resolvers = require("./data/resolvers");

var _schema = require("./data/schema");

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config({
  path: 'variables.env'
});

var app = (0, _express["default"])();
var server = new _apolloServerExpress.ApolloServer({
  typeDefs: _schema.typeDefs,
  resolvers: _resolvers.resolvers
});
server.applyMiddleware({
  app: app
});
app.get('/', function (req, res) {
  res.status(200).send('Hello world');
});
app.listen({
  port: 4200
}, function () {
  return console.log("\uD83D\uDE80 Server is running");
});