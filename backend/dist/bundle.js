/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/data/db.js":
/*!************************!*\
  !*** ./src/data/db.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Users\": () => (/* binding */ Users),\n/* harmony export */   \"Courses\": () => (/* binding */ Courses)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst mongoURI = 'mongodb+srv://RamsPantoja:Left4Dead2@devclosterrams.nodjj.mongodb.net/profepacoDB?retryWrites=true&w=majority';\nmongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(mongoURI, {\n  useCreateIndex: true,\n  useUnifiedTopology: true,\n  useNewUrlParser: true\n});\nconst userSchema = new (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema)({\n  firstname: String,\n  lastname: String,\n  email: String,\n  password: String,\n  img: String\n});\nuserSchema.pre('save', function (next) {\n  if (!this.isModified('password')) {\n    return next();\n  }\n\n  bcrypt__WEBPACK_IMPORTED_MODULE_1___default().genSalt(10, (err, salt) => {\n    if (err) return next(err);\n    bcrypt__WEBPACK_IMPORTED_MODULE_1___default().hash(this.password, salt, (err, hash) => {\n      if (err) return next(err);\n      this.password = hash;\n      next();\n    });\n  });\n});\nconst Users = mongoose__WEBPACK_IMPORTED_MODULE_0___default().model('Users', userSchema);\nconst courseSchema = new (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema)({\n  title: String,\n  teacher: String,\n  description: String,\n  objectives: Array,\n  conceptList: Object,\n  enrollmentLimit: Number,\n  enrollmentUsers: Array,\n  price: Number\n});\nconst Courses = mongoose__WEBPACK_IMPORTED_MODULE_0___default().model('Courses', courseSchema);\n\n//# sourceURL=webpack://backend_project_pp/./src/data/db.js?");

/***/ }),

/***/ "./src/data/resolvers.js":
/*!*******************************!*\
  !*** ./src/data/resolvers.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"resolvers\": () => (/* binding */ resolvers)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./db */ \"./src/data/db.js\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! dotenv */ \"dotenv\");\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\ndotenv__WEBPACK_IMPORTED_MODULE_4___default().config({\n  path: 'variables.env'\n});\n\nconst createUserToken = (entity, SECRET, expiresIn) => {\n  const {\n    email\n  } = entity;\n  return jsonwebtoken__WEBPACK_IMPORTED_MODULE_3___default().sign({\n    email\n  }, SECRET, {\n    expiresIn\n  });\n};\n\nconst resolvers = {\n  Query: {\n    getUsers: parent => {\n      return _db__WEBPACK_IMPORTED_MODULE_1__.Users.find({});\n    },\n    getUserAuth: async (parent, args, context) => {\n      if (!context.getUserEmail) {\n        return null;\n      }\n\n      const user = await _db__WEBPACK_IMPORTED_MODULE_1__.Users.findOne({\n        email: context.getUserEmail.email\n      });\n      return user;\n    },\n    getCourses: async parent => {\n      const courses = await _db__WEBPACK_IMPORTED_MODULE_1__.Courses.find((err, data) => {\n        if (err) {\n          throw new Error(err);\n        } else {\n          return data;\n        }\n      });\n      return courses;\n    }\n  },\n  Mutation: {\n    createUser: async (parent, {\n      input\n    }) => {\n      const emailAlreadyExist = await _db__WEBPACK_IMPORTED_MODULE_1__.Users.findOne({\n        email: input.email\n      });\n\n      if (emailAlreadyExist) {\n        throw new Error('El email ya existe!');\n      }\n\n      const newUser = await new _db__WEBPACK_IMPORTED_MODULE_1__.Users({\n        firstname: input.firstname,\n        lastname: input.lastname,\n        email: input.email,\n        password: input.password,\n        img: ''\n      }).save();\n      return `Gracias por registrarte ${input.firstname}, ya puedes iniciar sesion con tu nueva cuenta.`;\n    },\n    userAuth: async (parent, {\n      email,\n      password\n    }) => {\n      const user = await _db__WEBPACK_IMPORTED_MODULE_1__.Users.findOne({\n        email: email\n      });\n\n      if (!user) {\n        throw new Error('El email o contraseña son incorrectos');\n      } else if (user.isconfirmated === false) {\n        throw new Error('El usuario no ha sido confirmado');\n      }\n\n      const userPassword = await bcrypt__WEBPACK_IMPORTED_MODULE_2___default().compare(password, user.password);\n\n      if (!userPassword) {\n        throw new Error('El email o contraseña son incorrectos');\n      }\n\n      return {\n        token: createUserToken(user, process.env.SECRET, '1h')\n      };\n    },\n    addCourse: async (parent, {\n      input\n    }) => {\n      const newCourse = await new _db__WEBPACK_IMPORTED_MODULE_1__.Courses({\n        title: input.title,\n        teacher: input.teacher,\n        description: input.description,\n        objectives: input.objectives,\n        conceptList: input.conceptList,\n        enrollmentLimit: input.enrollmentLimit,\n        enrollmentUers: [],\n        price: input.price\n      }).save();\n      return newCourse;\n    }\n  }\n};\n\n//# sourceURL=webpack://backend_project_pp/./src/data/resolvers.js?");

/***/ }),

/***/ "./src/data/schema.js":
/*!****************************!*\
  !*** ./src/data/schema.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"typeDefs\": () => (/* binding */ typeDefs)\n/* harmony export */ });\n/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! apollo-server-express */ \"apollo-server-express\");\n/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_0__);\n\nconst typeDefs = apollo_server_express__WEBPACK_IMPORTED_MODULE_0__.gql`\n    type User {\n        id: ID\n        firstname: String\n        lastname: String\n        email: String\n        password: String\n        img: String\n    }\n\n    type Course {\n        id: ID\n        title: String\n        teacher: String\n        description: String\n        objectives: [String]\n        conceptList: [Concept]\n        enrollmentLimit: Int\n        enrollmentUsers: [User]\n        price: Int\n    }\n\n    type Concept {\n        concept: String\n        subConceptList: [String]\n    }\n\n    input inputUser {\n        id: ID\n        firstname: String!\n        lastname: String!\n        email: String!\n        password: String!\n        img: String\n    }\n\n    type Token {\n        token: String!\n    }\n    type Query {\n        getUsers: [User]\n        getUserAuth: User\n        getCourses: [Course]\n    }\n\n    input inputConcept {\n        concept: String!\n        subConceptList: [String!]\n    }\n\n    input inputCourse {\n        id: ID\n        title: String!\n        teacher: String!\n        description: String!\n        objectives: [String!]\n        conceptList: [inputConcept!]\n        enrollmentLimit: Int!\n        price: Int!\n    }\n\n    type Mutation {\n        createUser(input: inputUser) : String\n        userAuth(email: String!, password: String!) : Token\n        addCourse(input: inputCourse) : Course\n    }\n`;\n\n//# sourceURL=webpack://backend_project_pp/./src/data/schema.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/polyfill */ \"@babel/polyfill\");\n/* harmony import */ var _babel_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_polyfill__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! apollo-server-express */ \"apollo-server-express\");\n/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _data_resolvers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./data/resolvers */ \"./src/data/resolvers.js\");\n/* harmony import */ var _data_schema__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./data/schema */ \"./src/data/schema.js\");\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! dotenv */ \"dotenv\");\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _data_db__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./data/db */ \"./src/data/db.js\");\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! cors */ \"cors\");\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! body-parser */ \"body-parser\");\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_9__);\n\n\n\n\n\n\n\n\n\n\ndotenv__WEBPACK_IMPORTED_MODULE_5___default().config({\n  path: 'variables.env'\n});\nconst app = express__WEBPACK_IMPORTED_MODULE_1___default()();\nvar corsOptions = {\n  origin: 'http://localhost:3000',\n  credentials: true // <-- REQUIRED backend setting\n\n};\napp.use(cors__WEBPACK_IMPORTED_MODULE_8___default()(corsOptions));\nconst server = new apollo_server_express__WEBPACK_IMPORTED_MODULE_2__.ApolloServer({\n  typeDefs: _data_schema__WEBPACK_IMPORTED_MODULE_4__.typeDefs,\n  resolvers: _data_resolvers__WEBPACK_IMPORTED_MODULE_3__.resolvers,\n  context: async ({\n    req\n  }) => {\n    const token = req.headers.authorization || '';\n\n    if (token !== \"null\") {\n      try {\n        const getUserEmail = await jsonwebtoken__WEBPACK_IMPORTED_MODULE_6___default().verify(token, process.env.SECRET);\n        req.getUserEmail = getUserEmail;\n        console.log(getUserEmail);\n        return {\n          getUserEmail\n        };\n      } catch (error) {\n        console.log(error);\n      }\n    }\n  }\n});\nserver.applyMiddleware({\n  app\n});\napp.get('/', (req, res) => {\n  res.status(200).send('Hello Ramir0');\n});\napp.get('/courses', async (req, res) => {\n  await _data_db__WEBPACK_IMPORTED_MODULE_7__.Courses.find((err, data) => {\n    if (err) {\n      res.status(500).send(err);\n    } else {\n      let courses = [];\n      data.map(item => {\n        const courseId = {\n          id: item._id,\n          title: item.title\n        };\n        courses.push(courseId);\n      });\n      return res.status(200).send(courses);\n    }\n  });\n});\napp.listen({\n  port: 4200\n}, () => console.log(`🚀 Server is running`));\n\n//# sourceURL=webpack://backend_project_pp/./src/index.js?");

/***/ }),

/***/ "@babel/polyfill":
/*!**********************************!*\
  !*** external "@babel/polyfill" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@babel/polyfill");;

/***/ }),

/***/ "apollo-server-express":
/*!****************************************!*\
  !*** external "apollo-server-express" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("apollo-server-express");;

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");;

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("body-parser");;

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");;

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");;

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");;

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");;

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;