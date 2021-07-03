"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveSubmissionToFirebase = exports.attemptSubmissionToFirebase = exports.getThisWeeksPlaylistDynamically = exports.getLastWeeksPlaylistDynamically = exports.getPlaylistsFromFirebase = exports.savePlaylistToFirebase = void 0;

var _admin = _interopRequireDefault(require("./admin"));

var _dateFns = require("date-fns");

var _spotify = require("../spotify");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var savePlaylistToFirebase = function savePlaylistToFirebase(id, name, date) {
  try {
    var playlists = _admin["default"].database().ref('playlists/');

    var newPlaylist = playlists.push();
    newPlaylist.set({
      spotify_playlist_id: id,
      name: name,
      theme: 'test_theme',
      updated_at: (0, _dateFns.format)((0, _dateFns.parseISO)(date) || new Date(), 'yyyy-MM-dd'),
      created_at: (0, _dateFns.format)((0, _dateFns.parseISO)(date) || new Date(), 'yyyy-MM-dd')
    });
  } catch (error) {
    console.error(error);
  }
};

exports.savePlaylistToFirebase = savePlaylistToFirebase;

var getPlaylistsFromFirebase = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var snapshot;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _admin["default"].database().ref().child('playlists').get();

          case 3:
            snapshot = _context.sent;
            return _context.abrupt("return", snapshot.exists() && snapshot.val());

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));

  return function getPlaylistsFromFirebase() {
    return _ref.apply(this, arguments);
  };
}();

exports.getPlaylistsFromFirebase = getPlaylistsFromFirebase;

var getLastWeeksPlaylistDynamically = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(today) {
    var parsedDate, twoSundaysAgo, playlists;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            parsedDate = (0, _dateFns.parseISO)(today);
            twoSundaysAgo = (0, _dateFns.sub)(parsedDate, {
              days: (0, _dateFns.getDay)(parsedDate) + 7
            });
            _context2.prev = 2;
            _context2.t0 = Object;
            _context2.next = 6;
            return getPlaylistsFromFirebase();

          case 6:
            _context2.t1 = _context2.sent;
            playlists = _context2.t0.values.call(_context2.t0, _context2.t1);
            return _context2.abrupt("return", playlists.find(function (_ref3) {
              var created_at = _ref3.created_at;
              var made = (0, _dateFns.parseISO)(created_at);
              return (0, _dateFns.isBefore)(made, (0, _dateFns.nextWednesday)(twoSundaysAgo)) && (0, _dateFns.isAfter)(made, twoSundaysAgo);
            }));

          case 11:
            _context2.prev = 11;
            _context2.t2 = _context2["catch"](2);
            console.error(_context2.t2.message);

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 11]]);
  }));

  return function getLastWeeksPlaylistDynamically(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getLastWeeksPlaylistDynamically = getLastWeeksPlaylistDynamically;

var getThisWeeksPlaylistDynamically = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(today, forSubmission) {
    var parsedDate, lastSunday, lastSaturday, playlists;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            parsedDate = (0, _dateFns.parseISO)(today);
            lastSunday = (0, _dateFns.sub)(parsedDate, {
              days: (0, _dateFns.getDay)(parsedDate)
            });
            lastSaturday = (0, _dateFns.sub)(lastSunday, {
              days: 1
            });
            _context3.prev = 3;
            _context3.t0 = Object;
            _context3.next = 7;
            return getPlaylistsFromFirebase();

          case 7:
            _context3.t1 = _context3.sent;
            playlists = _context3.t0.values.call(_context3.t0, _context3.t1);
            return _context3.abrupt("return", playlists.find(function (_ref5) {
              var created_at = _ref5.created_at;
              var made = (0, _dateFns.parseISO)(created_at);
              return (0, _dateFns.isAfter)(made, forSubmission ? lastSaturday : lastSunday) && (0, _dateFns.isBefore)(made, (0, _dateFns.nextWednesday)(lastSunday));
            }));

          case 12:
            _context3.prev = 12;
            _context3.t2 = _context3["catch"](3);
            console.error(_context3.t2.message);

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[3, 12]]);
  }));

  return function getThisWeeksPlaylistDynamically(_x2, _x3) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getThisWeeksPlaylistDynamically = getThisWeeksPlaylistDynamically;

var getAllSubmissions = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var snapshot;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _admin["default"].database().ref().child('submission').get();

          case 3:
            snapshot = _context4.sent;
            return _context4.abrupt("return", snapshot.exists() && snapshot.val());

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            console.error(_context4.t0);

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 7]]);
  }));

  return function getAllSubmissions() {
    return _ref6.apply(this, arguments);
  };
}();

var checkForExistingSubmission = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(user, playlist_id) {
    var submissionList, submissions, playlistRelevantSubmissions;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return getAllSubmissions();

          case 3:
            submissionList = _context5.sent;
            submissions = Object.values(submissionList);
            playlistRelevantSubmissions = submissions.filter(function (_ref8) {
              var spotify_playlist_id = _ref8.spotify_playlist_id;
              return spotify_playlist_id === playlist_id;
            });

            if (!playlistRelevantSubmissions.some(function (_ref9) {
              var userId = _ref9.userId;
              return userId === user;
            })) {
              _context5.next = 8;
              break;
            }

            return _context5.abrupt("return", true);

          case 8:
            _context5.next = 13;
            break;

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](0);
            console.error(_context5.t0);

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 10]]);
  }));

  return function checkForExistingSubmission(_x4, _x5) {
    return _ref7.apply(this, arguments);
  };
}(); // submission: userId, submission_uri, created_at, spotify_playlist_id


var attemptSubmissionToFirebase = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(userId, submission_uri, trackName, date, response) {
    var newId, thisWeeksPlaylist, exists, playlist;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return getThisWeeksPlaylistDynamically(date, true);

          case 3:
            thisWeeksPlaylist = _context6.sent;

            if (thisWeeksPlaylist) {
              _context6.next = 10;
              break;
            }

            _context6.next = 7;
            return (0, _spotify.useSpotify)(_spotify.makePlaylist, date);

          case 7:
            newId = _context6.sent;
            _context6.next = 15;
            break;

          case 10:
            _context6.next = 12;
            return checkForExistingSubmission(userId, thisWeeksPlaylist === null || thisWeeksPlaylist === void 0 ? void 0 : thisWeeksPlaylist.spotify_playlist_id);

          case 12:
            exists = _context6.sent;

            if (!exists) {
              _context6.next = 15;
              break;
            }

            return _context6.abrupt("return", response.status(429).send());

          case 15:
            playlist = thisWeeksPlaylist ? thisWeeksPlaylist.spotify_playlist_id : newId;
            _context6.next = 18;
            return saveSubmissionToFirebase(playlist, userId, submission_uri, trackName, date);

          case 18:
            return _context6.abrupt("return", playlist);

          case 21:
            _context6.prev = 21;
            _context6.t0 = _context6["catch"](0);
            console.error('firebase-submission-error:', _context6.t0);

          case 24:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 21]]);
  }));

  return function attemptSubmissionToFirebase(_x6, _x7, _x8, _x9, _x10) {
    return _ref10.apply(this, arguments);
  };
}();

exports.attemptSubmissionToFirebase = attemptSubmissionToFirebase;

var saveSubmissionToFirebase = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(spotify_playlist_id, userId, submission_uri, trackName, date) {
    var newSubmission;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return _admin["default"].database().ref('submission/').push();

          case 3:
            newSubmission = _context7.sent;
            newSubmission.set({
              spotify_playlist_id: spotify_playlist_id,
              userId: userId,
              trackName: trackName,
              submission_uri: submission_uri,
              created_at: (0, _dateFns.format)((0, _dateFns.parseISO)(date), 'yyyy-MM-dd')
            });
            _context7.next = 10;
            break;

          case 7:
            _context7.prev = 7;
            _context7.t0 = _context7["catch"](0);
            console.error(_context7.t0);

          case 10:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 7]]);
  }));

  return function saveSubmissionToFirebase(_x11, _x12, _x13, _x14, _x15) {
    return _ref11.apply(this, arguments);
  };
}();

exports.saveSubmissionToFirebase = saveSubmissionToFirebase;
//# sourceMappingURL=playlists.js.map