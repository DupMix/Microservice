"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkTokens = exports.databaseTokensChanged = exports.updateLocalTokens = void 0;

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _dateFns = require("date-fns");

var _users = require("./users");

var _spotify = _interopRequireWildcard(require("./spotify"));

var _firebase = require("./firebase");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require('dotenv').config();

var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.locals = {
  access_token: '',
  refresh_token: ''
};
var port = process.env.PORT || 8000;
var baseUrl = process.env.NODE_ENV === 'developement' ? 'https://mixdup-microservice.herokuapp.com/' : 'http://localhost:8000';

var updateLocalTokens = function updateLocalTokens(_ref) {
  var access_token = _ref.access_token,
      refresh_token = _ref.refresh_token;
  app.locals.access_token = access_token;
  app.locals.refresh_token = refresh_token;
};

exports.updateLocalTokens = updateLocalTokens;

var databaseTokensChanged = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var databaseTokens;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _firebase.getTokensFromFirebase)();

          case 2:
            databaseTokens = _context.sent;
            return _context.abrupt("return", app.locals.access_token !== databaseTokens.access_token);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function databaseTokensChanged() {
    return _ref2.apply(this, arguments);
  };
}();

exports.databaseTokensChanged = databaseTokensChanged;
app.get('/', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(request, response) {
    var authUri;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!app.locals.access_token) {
              _context2.next = 4;
              break;
            }

            response.send("Welcome to Mixdup. ".concat(app.locals.access_token && 'I am powered by Spotify.')).set('Access-Control-Allow-Origin', '*');
            _context2.next = 8;
            break;

          case 4:
            _context2.next = 6;
            return (0, _spotify.constructAuthURI)("".concat(baseUrl, "/authorize"));

          case 6:
            authUri = _context2.sent;
            return _context2.abrupt("return", authUri ? response.redirect(authUri) : response.send('something went wrong').set('Access-Control-Allow-Origin', '*'));

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x, _x2) {
    return _ref3.apply(this, arguments);
  };
}());
app.get('/authorize', /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(request, response) {
    var code, tokens;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            code = request.query.code;
            _context3.next = 3;
            return (0, _spotify.requestAccessToken)(code, "".concat(baseUrl, "/authorize"));

          case 3:
            tokens = _context3.sent;

            if (tokens && tokens.access_token && tokens.refresh_token) {
              updateLocalTokens(tokens);
              (0, _firebase.saveTokensToFirebase)(tokens);
              response.redirect(baseUrl);
            } else {
              response.redirect(baseUrl); // would be nice if there was some handling
            }

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}());
app.post('/search-spotify', _users.checkIfAuthenticated, function (request, response) {
  console.log('searching...');
  var query = request.body.query;
  return (0, _spotify["default"])(_spotify.searchSpotify, query, response);
});
app.post('/contest-playlist', /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(request, response) {
    var date, playlist;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            date = request.body.date;
            if (!date) response.status(403).json('You must provide a date to get a playlist').set('Access-Control-Allow-Origin', '*');
            _context4.prev = 2;

            if (!((0, _dateFns.getDay)((0, _dateFns.parseISO)(date)) >= 3)) {
              _context4.next = 9;
              break;
            }

            _context4.next = 6;
            return (0, _firebase.getThisWeeksPlaylistDynamically)(date);

          case 6:
            _context4.t0 = _context4.sent;
            _context4.next = 12;
            break;

          case 9:
            _context4.next = 11;
            return (0, _firebase.getLastWeeksPlaylistDynamically)(date);

          case 11:
            _context4.t0 = _context4.sent;

          case 12:
            playlist = _context4.t0;
            playlist ? (0, _spotify["default"])(_spotify.getPlaylist, playlist.spotify_playlist_id, response) : response.status(404).set('Access-Control-Allow-Origin', '*');
            _context4.next = 20;
            break;

          case 16:
            _context4.prev = 16;
            _context4.t1 = _context4["catch"](2);
            console.error(_context4.t1);
            response.status(_context4.t1.status || 500).json({
              error: _context4.t1
            }).set('Access-Control-Allow-Origin', '*');

          case 20:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 16]]);
  }));

  return function (_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}());
app.post('/submit-song', _users.checkIfAuthenticated, /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(request, response) {
    var _request$body, user_id, submission_uri, trackName, date, playlist_id;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _request$body = request.body, user_id = _request$body.user_id, submission_uri = _request$body.submission_uri, trackName = _request$body.trackName, date = _request$body.date;
            _context5.next = 4;
            return (0, _firebase.attemptSubmissionToFirebase)(user_id, submission_uri, trackName, date, response);

          case 4:
            playlist_id = _context5.sent;
            _context5.t0 = playlist_id;

            if (!_context5.t0) {
              _context5.next = 9;
              break;
            }

            _context5.next = 9;
            return (0, _spotify.useSpotify)(_spotify.submitToPlaylist, {
              playlist_id: playlist_id,
              submission_uri: submission_uri
            });

          case 9:
            response.status(200).set('Access-Control-Allow-Origin', '*').send();
            _context5.next = 15;
            break;

          case 12:
            _context5.prev = 12;
            _context5.t1 = _context5["catch"](0);
            console.error('submit-song-endpoint:', _context5.t1);

          case 15:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 12]]);
  }));

  return function (_x7, _x8) {
    return _ref6.apply(this, arguments);
  };
}());
app.post('/submit-votes', _users.checkIfAuthenticated, /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(request, response) {
    var _request$body2, user_id, votes, date;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _request$body2 = request.body, user_id = _request$body2.user_id, votes = _request$body2.votes, date = _request$body2.date;
            _context6.next = 4;
            return (0, _firebase.userVotedThisWeek)(user_id, date);

          case 4:
            if (!_context6.sent) {
              _context6.next = 6;
              break;
            }

            return _context6.abrupt("return", response.status(429).set('Access-Control-Allow-Origin', '*').send());

          case 6:
            (0, _firebase.submitVotesToFirebase)(user_id, votes, date);
            response.status(201).set('Access-Control-Allow-Origin', '*').send();
            _context6.next = 14;
            break;

          case 10:
            _context6.prev = 10;
            _context6.t0 = _context6["catch"](0);
            console.error(_context6.t0);
            response.status(_context6.t0.status || 500).json({
              error: _context6.t0
            }).set('Access-Control-Allow-Origin', '*');

          case 14:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 10]]);
  }));

  return function (_x9, _x10) {
    return _ref7.apply(this, arguments);
  };
}());

var checkTokens = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var tokens;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            console.log('Checking for Spotify tokens');

            if (!(app.locals.access_token !== '' && app.locals.refresh_token !== '')) {
              _context7.next = 4;
              break;
            }

            console.log('Found local tokens');
            return _context7.abrupt("return", {
              access_token: app.locals.access_token
            });

          case 4:
            _context7.next = 6;
            return (0, _firebase.getTokensFromFirebase)();

          case 6:
            tokens = _context7.sent;

            if (!(tokens !== null && tokens !== void 0 && tokens.access_token && tokens !== null && tokens !== void 0 && tokens.refresh_token)) {
              _context7.next = 13;
              break;
            }

            console.log('Tokens retrieved from the database');
            updateLocalTokens(tokens);
            return _context7.abrupt("return", tokens.access_token);

          case 13:
            console.error('The server needs to be authorized for Spotify.');

          case 14:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function checkTokens() {
    return _ref8.apply(this, arguments);
  };
}();

exports.checkTokens = checkTokens;
app.listen(port, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
  return regeneratorRuntime.wrap(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          console.log("The Mixdup server is running on http://localhost:".concat(port));
          checkTokens();

        case 2:
        case "end":
          return _context8.stop();
      }
    }
  }, _callee8);
})));
//# sourceMappingURL=server.js.map