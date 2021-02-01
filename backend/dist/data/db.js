"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Users = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var mongoURI = 'mongodb+srv://RamsPantoja:Left4Dead2@devclosterrams.nodjj.mongodb.net/profepacoDB?retryWrites=true&w=majority';

_mongoose["default"].connect(mongoURI, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true
});

var userSchema = _mongoose["default"].Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  img: String
});

var Users = _mongoose["default"].model('Users', userSchema);

exports.Users = Users;