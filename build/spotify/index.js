"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "getRefreshedAuth", {
  enumerable: true,
  get: function get() {
    return _auth.getRefreshedAuth;
  }
});
Object.defineProperty(exports, "constructAuthURI", {
  enumerable: true,
  get: function get() {
    return _auth.constructAuthURI;
  }
});
Object.defineProperty(exports, "requestAccessToken", {
  enumerable: true,
  get: function get() {
    return _auth.requestAccessToken;
  }
});
Object.defineProperty(exports, "makePlaylist", {
  enumerable: true,
  get: function get() {
    return _playlists.makePlaylist;
  }
});
Object.defineProperty(exports, "getPlaylist", {
  enumerable: true,
  get: function get() {
    return _playlists.getPlaylist;
  }
});
Object.defineProperty(exports, "submitToPlaylist", {
  enumerable: true,
  get: function get() {
    return _playlists.submitToPlaylist;
  }
});
exports["default"] = exports.searchSpotify = exports.useSpotify = void 0;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _auth = require("./auth");

var _server = require("../server");

var _playlists = require("./playlists");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var useSpotify = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(spotifyAction, query) {
    var _yield$checkTokens, access_token, _ref2, _access_token, new_error;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _server.checkTokens)();

          case 2:
            _yield$checkTokens = _context.sent;
            access_token = _yield$checkTokens.access_token;
            _context.prev = 4;
            _context.next = 7;
            return spotifyAction(access_token, query);

          case 7:
            return _context.abrupt("return", _context.sent);

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](4);
            _context.t1 = _context.t0.status === 401;

            if (!_context.t1) {
              _context.next = 17;
              break;
            }

            _context.next = 16;
            return (0, _auth.getRefreshedAuth)();

          case 16:
            _context.t1 = _context.sent;

          case 17:
            _ref2 = _context.t1;
            _access_token = _ref2.access_token;
            new_error = _ref2.error;
            return _context.abrupt("return", _access_token ? spotifyAction(_access_token, query) : console.error(new_error));

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 10]]);
  }));

  return function useSpotify(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.useSpotify = useSpotify;

var performAuthorizedSpotifyAction = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(spotifyAction, query, res) {
    var _yield$checkTokens2, access_token;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _server.checkTokens)();

          case 2:
            _yield$checkTokens2 = _context2.sent;
            access_token = _yield$checkTokens2.access_token;
            return _context2.abrupt("return", spotifyAction(access_token, query).then(function (response) {
              if (response !== null && response !== void 0 && response.ok) {
                console.log('Successfully completed Spotify action');
                return response.text().then(function (text) {
                  res && res.send(text).set('Access-Control-Allow-Origin', '*');
                  return text;
                })["catch"](function (error) {
                  return console.error(error);
                });
              } else if (response.status === 401) {
                return (0, _auth.getRefreshedAuth)().then(function (_ref4) {
                  var new_Access = _ref4.access_token,
                      error = _ref4.error;

                  if (new_Access) {
                    console.log('Refreshed Authentication');
                    return spotifyAction(new_Access, query).then(function (secondResponse) {
                      console.log('Rerunning the spotify task...');

                      if (secondResponse.ok) {
                        secondResponse.text().then(function (text) {
                          res.send(text).set('Access-Control-Allow-Origin', '*');
                          return text;
                        })["catch"](function (error) {
                          return console.error(error);
                        });
                        return secondResponse;
                      } else {
                        console.error('Something went wrong the second time we attempted the Spotify action');
                        secondResponse.text().then(function (text) {
                          return console.error(JSON.parse(text));
                        })["catch"](function (error) {
                          return console.error(error);
                        });
                        return secondResponse;
                      }
                    });
                  } else {
                    console.error(error);
                  }
                });
              } else {
                response.text().then(function (text) {
                  return console.error(JSON.parse(text));
                })["catch"](function (error) {
                  return console.error(error);
                });
                return response;
              }
            })["catch"](function (error) {
              return console.error(error);
            }));

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function performAuthorizedSpotifyAction(_x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

var searchSpotify = function searchSpotify(accessSpotify, query) {
  var bearer = "Bearer ".concat(accessSpotify);
  return (0, _nodeFetch["default"])("https://api.spotify.com/v1/search?q=".concat(query, "&type=track"), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer
    }
  }).then(function (response) {
    return response;
  });
};

exports.searchSpotify = searchSpotify;
var _default = performAuthorizedSpotifyAction;
exports["default"] = _default;
//# sourceMappingURL=index.js.map