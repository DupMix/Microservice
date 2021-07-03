"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRefreshedAuth = exports.requestAccessToken = exports.constructAuthURI = void 0;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _btoa = _interopRequireDefault(require("btoa"));

var _firebase = require("../firebase");

var _server = require("../server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _process$env = process.env,
    SPOTIFY_CLIENT_ID = _process$env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET = _process$env.SPOTIFY_CLIENT_SECRET;

var combineQueryParams = function combineQueryParams(params) {
  // might better live in index
  var parameters = Object.keys(params);
  var query = parameters.map(function (parameter) {
    return "".concat(parameter, "=").concat(params[parameter]);
  }).join("&");
  return query;
};

var constructAuthURI = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(redirect) {
    var root, params;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            root = "https://accounts.spotify.com/authorize?";
            params = {
              client_id: SPOTIFY_CLIENT_ID,
              scope: ['user-read-email', 'user-read-private', 'playlist-modify-private', 'user-read-private', 'playlist-modify-public'].join(' '),
              response_type: 'code',
              redirect_uri: redirect
            };
            return _context.abrupt("return", root + combineQueryParams(params));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function constructAuthURI(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.constructAuthURI = constructAuthURI;

var requestAccessToken = function requestAccessToken(code, redirect) {
  var client = (0, _btoa["default"])("".concat(SPOTIFY_CLIENT_ID, ":").concat(SPOTIFY_CLIENT_SECRET));
  var params = {
    client_id: SPOTIFY_CLIENT_ID,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirect
  };
  return (0, _nodeFetch["default"])("https://accounts.spotify.com/api/token", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: "Basic ".concat(client)
    },
    body: combineQueryParams(params)
  }).then(function (response) {
    if (response.ok) {
      return response.text().then(function (text) {
        return JSON.parse(text);
      }).then(function (tokens) {
        console.log('Successful authentication');
        (0, _firebase.saveTokensToFirebase)(tokens);
        return _objectSpread(_objectSpread({}, tokens), {}, {
          error: ''
        });
      });
    } else {
      response.text().then(function (text) {
        return {
          error: text,
          access_token: '',
          refresh_token: ''
        };
      });
    }
  });
};

exports.requestAccessToken = requestAccessToken;

var getRefreshedAuth = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var databaseTokens, params, client;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log('spinning the wax');
            _context2.prev = 1;
            _context2.next = 4;
            return (0, _firebase.getTokensFromFirebase)();

          case 4:
            databaseTokens = _context2.sent;
            _context2.next = 7;
            return (0, _server.databaseTokensChanged)();

          case 7:
            if (!_context2.sent) {
              _context2.next = 11;
              break;
            }

            console.log('tokens changed');
            (0, _server.updateLocalTokens)(databaseTokens);
            return _context2.abrupt("return", databaseTokens);

          case 11:
            params = {
              grant_type: 'refresh_token',
              refresh_token: databaseTokens.refresh_token,
              client_id: SPOTIFY_CLIENT_ID
            };
            client = (0, _btoa["default"])("".concat(SPOTIFY_CLIENT_ID, ":").concat(SPOTIFY_CLIENT_SECRET));
            return _context2.abrupt("return", (0, _nodeFetch["default"])("https://accounts.spotify.com/api/token", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: "Basic ".concat(client)
              },
              body: combineQueryParams(params)
            }).then(function (response) {
              if (response.ok) {
                console.log('Successfully refreshed the token');
                return response.text().then(function (text) {
                  return JSON.parse(text);
                }).then(function (tokens) {
                  (0, _server.updateLocalTokens)({
                    access_token: tokens.access_token,
                    refresh_token: databaseTokens.refresh_token
                  });
                  (0, _firebase.saveTokensToFirebase)(tokens, databaseTokens.refresh_token);
                  return tokens;
                })["catch"](function (error) {
                  return {
                    error: error,
                    refresh_token: '',
                    access_token: ''
                  };
                });
              } else {
                return response.text().then(function (text) {
                  return {
                    error: text,
                    refresh_token: '',
                    access_token: ''
                  };
                });
              }
            })["catch"](function (error) {
              return console.error(error);
            }));

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](1);
            console.error(_context2.t0);

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 16]]);
  }));

  return function getRefreshedAuth() {
    return _ref2.apply(this, arguments);
  };
}();

exports.getRefreshedAuth = getRefreshedAuth;
//# sourceMappingURL=auth.js.map