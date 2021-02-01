"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeDefs = void 0;

var _apolloServerExpress = require("apollo-server-express");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    type User {\n        id: ID\n        firstname: String\n        lastname: String\n        email: String\n        password: String\n        img: String\n    }\n\n    input inputUser {\n        id: ID\n        firstname: String!\n        lastname: String!\n        email: String!\n        password: String!\n        img: String\n    }\n\n    type Query {\n        getUsers: [User]\n    }\n\n    type Mutation {\n        createUser(input: inputUser) : String\n    }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var typeDefs = (0, _apolloServerExpress.gql)(_templateObject());
exports.typeDefs = typeDefs;