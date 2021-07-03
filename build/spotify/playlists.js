"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.submitToPlaylist = exports.getPlaylist = exports.makePlaylist = void 0;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _dateFns = require("date-fns");

var _firebase = require("../firebase");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getName = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var data, text, names;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _nodeFetch["default"])("https://random-word-api.herokuapp.com/word?number=".concat(Math.trunc(Math.random() * (4 - 2) + 2), "&swear=0"));

          case 3:
            data = _context.sent;
            _context.next = 6;
            return data.text();

          case 6:
            text = _context.sent;
            names = JSON.parse(text);
            return _context.abrupt("return", names.join(' '));

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0);
            return _context.abrupt("return", 'J. Doe');

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
  }));

  return function getName() {
    return _ref.apply(this, arguments);
  };
}(); // const getTheme = async () => {
//   try {
//     const data = await fetch (`https://api.quotable.io/random`)  
//     console.log(data)
//     return data.content
//   } catch (error) {
//     console.error(error)
//     return 'Error generating theme'
//   }
// }


var makePlaylist = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(access_token, date) {
    var name, data;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getName();

          case 2:
            name = _context2.sent;
            _context2.prev = 3;
            _context2.next = 6;
            return (0, _nodeFetch["default"])('https://api.spotify.com/v1/users/e7ermk7v6qi3y0mbqibh5do2k/playlists', {
              method: 'POST',
              headers: {
                Authorization: "Bearer ".concat(access_token),
                'content-type': 'application/json' // this was .json for a second and didn't have issues?

              },
              body: JSON.stringify({
                name: name,
                description: 'test theme'
              })
            });

          case 6:
            data = _context2.sent;
            return _context2.abrupt("return", data.ok && data.text().then(function (text) {
              return JSON.parse(text);
            }).then(function (data) {
              (0, _firebase.savePlaylistToFirebase)(data.id, data.name, date);
              return data.id;
            }));

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](3);
            console.error('make-playlist-error', _context2.t0);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 10]]);
  }));

  return function makePlaylist(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.makePlaylist = makePlaylist;

var getPlaylist = function getPlaylist(access_token, playlist_id) {
  return (0, _nodeFetch["default"])("https://api.spotify.com/v1/playlists/".concat(playlist_id), {
    headers: {
      Authorization: "Bearer ".concat(access_token),
      'content-type': 'application/json' // this was .json for a second and didn't have issues?

    }
  }).then(function (response) {
    return response;
  })["catch"](function (error) {
    return console.error(error);
  });
};

exports.getPlaylist = getPlaylist;

var submitToPlaylist = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(access_token, _ref3) {
    var playlist_id, submission_uri;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            playlist_id = _ref3.playlist_id, submission_uri = _ref3.submission_uri;
            _context3.prev = 1;
            _context3.next = 4;
            return (0, _nodeFetch["default"])("https://api.spotify.com/v1/playlists/".concat(playlist_id, "/tracks"), {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                Authorization: "Bearer ".concat(access_token)
              },
              body: JSON.stringify({
                uris: [submission_uri]
              })
            });

          case 4:
            return _context3.abrupt("return", _context3.sent);

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](1);
            console.error('submit-to-spotify-playlist:', _context3.t0);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 7]]);
  }));

  return function submitToPlaylist(_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}(); // determine last weeks playlist
// get all playlists 
// sort and find the most recent one that's over a week old
// addSongs to this weeks playlist
// get all playlists


exports.submitToPlaylist = submitToPlaylist;
//# sourceMappingURL=playlists.js.map