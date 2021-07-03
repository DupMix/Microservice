"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkIfAuthenticated = void 0;

var _admin = _interopRequireDefault(require("../firebase/admin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getAuthToken = function getAuthToken(request, response, next) {
  var authorization = request.headers.authorization;
  var authParts = authorization ? authorization.split(' ') : [];

  if (authParts[0] === 'Bearer') {
    request.authToken = authParts[1];
  } else {
    request.authToken = null;
  }

  next();
};

var checkIfAuthenticated = function checkIfAuthenticated(request, response, next) {
  getAuthToken(request, response, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var authToken, userInfo;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            authToken = request.authToken;
            _context.next = 4;
            return _admin["default"].auth().verifyIdToken(authToken);

          case 4:
            userInfo = _context.sent;
            request.authId = userInfo.uid;
            return _context.abrupt("return", next());

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", response.status(401).send({
              error: 'You are not authorized to make this request'
            }));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 9]]);
  })));
};

exports.checkIfAuthenticated = checkIfAuthenticated;
//# sourceMappingURL=index.js.map