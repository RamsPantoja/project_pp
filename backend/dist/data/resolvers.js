"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _db = require("./db");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var resolvers = {
  Query: {
    getUsers: function getUsers(parent) {
      return _db.Users.find({});
    }
  },
  Mutation: {
    createUser: function () {
      var _createUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(root, _ref) {
        var input, emailAlreadyExist, newUser;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                input = _ref.input;
                _context.next = 3;
                return _db.Users.findOne({
                  email: input.email
                });

              case 3:
                emailAlreadyExist = _context.sent;

                if (!emailAlreadyExist) {
                  _context.next = 6;
                  break;
                }

                throw new Error('El email ya existe!');

              case 6:
                newUser = new _db.Users({
                  firstname: input.firstname,
                  lastname: input.lastname,
                  email: input.email,
                  img: input.email
                }).save();
                return _context.abrupt("return", "Gracias por registrarte ".concat(input.firstname, ", ya puedes iniciar sesion con tu nueva cuenta."));

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function createUser(_x, _x2) {
        return _createUser.apply(this, arguments);
      }

      return createUser;
    }()
  }
};
exports.resolvers = resolvers;