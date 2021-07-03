"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTokensFromFirebase = exports.saveTokensToFirebase = void 0;

var _admin = _interopRequireDefault(require("./admin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// import { updateLocalTokens } from '../server'
var saveTokensToFirebase = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(tokens, refresh_token) {
    var tokenUpdate;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            tokenUpdate = _objectSpread({}, tokens);
            if (refresh_token) tokenUpdate.refresh_token = refresh_token;
            _context.prev = 2;
            _context.next = 5;
            return _admin["default"].database().ref('mixdup_tokens').set(_objectSpread({}, tokenUpdate));

          case 5:
            console.log('tokens saved to database');
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](2);
            console.error('error saving tokens to database:', _context.t0);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 8]]);
  }));

  return function saveTokensToFirebase(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.saveTokensToFirebase = saveTokensToFirebase;

var getTokensFromFirebase = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var snapshot, _snapshot$val, access_token, refresh_token;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _admin["default"].database().ref().child('mixdup_tokens').get();

          case 3:
            snapshot = _context2.sent;

            if (!snapshot.exists()) {
              _context2.next = 7;
              break;
            }

            _snapshot$val = snapshot.val(), access_token = _snapshot$val.access_token, refresh_token = _snapshot$val.refresh_token;
            return _context2.abrupt("return", {
              access_token: access_token,
              refresh_token: refresh_token
            });

          case 7:
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](0);
            console.error(_context2.t0);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 9]]);
  }));

  return function getTokensFromFirebase() {
    return _ref2.apply(this, arguments);
  };
}();

exports.getTokensFromFirebase = getTokensFromFirebase;
//# sourceMappingURL=tokens.js.map