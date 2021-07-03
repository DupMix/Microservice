"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllWeekVotes = exports.userVotedThisWeek = exports.submitVotesToFirebase = void 0;

var _admin = _interopRequireDefault(require("./admin"));

var _dateFns = require("date-fns");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var submitVotesToFirebase = function submitVotesToFirebase(userId, votes, date) {
  var voteFields = Object.keys(votes);
  voteFields.forEach(function (field) {
    if (field === 'heardBefore') return votes.heardBefore.forEach(function (heard) {
      submitVoteToFirebase(userId, heard, 0, date);
    });
    submitVoteToFirebase(userId, votes[field], valueVote(field), date);
  });
};

exports.submitVotesToFirebase = submitVotesToFirebase;

var valueVote = function valueVote(field) {
  switch (field) {
    case 'first':
      return 3;

    case 'second':
      return 2;

    case 'third':
      return 1;

    default:
      return 0;
  }
};

var submitVoteToFirebase = function submitVoteToFirebase(userId, trackName, score, date) {
  try {
    var votes = _admin["default"].database().ref('vote/');

    var newVote = votes.push();
    newVote.set({
      userId: userId,
      trackName: trackName,
      score: score,
      updated_at: (0, _dateFns.format)((0, _dateFns.parseISO)(date) || new Date(), 'yyyy-MM-dd'),
      created_at: (0, _dateFns.format)((0, _dateFns.parseISO)(date) || new Date(), 'yyyy-MM-dd')
    });
  } catch (error) {
    console.error("vote submit error:", error);
  }
};

var userVotedThisWeek = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user, date) {
    var thisWeeksVotes;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return getAllWeekVotes(date);

          case 3:
            thisWeeksVotes = _context.sent;

            if (!thisWeeksVotes.some(function (_ref2) {
              var userId = _ref2.userId;
              return userId === user;
            })) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("return", true);

          case 8:
            return _context.abrupt("return", false);

          case 9:
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            console.error('checking this weeks votes error:', _context.t0);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
  }));

  return function userVotedThisWeek(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.userVotedThisWeek = userVotedThisWeek;

var getAllWeekVotes = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(date) {
    var snapshot, allVotes, parsedDate, lastSunday, votes;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _admin["default"].database().ref().child('vote').get();

          case 3:
            snapshot = _context2.sent;
            allVotes = snapshot.exists() && snapshot.val();

            if (allVotes) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return", []);

          case 7:
            parsedDate = (0, _dateFns.parseISO)(date); // today

            lastSunday = (0, _dateFns.sub)(parsedDate, {
              days: (0, _dateFns.getDay)(parsedDate)
            });
            votes = Object.values(allVotes);
            return _context2.abrupt("return", votes.filter(function (_ref4) {
              var created_at = _ref4.created_at;
              var made = (0, _dateFns.parseISO)(created_at);
              return (0, _dateFns.isAfter)(made, (0, _dateFns.nextTuesday)(lastSunday)) && (0, _dateFns.isBefore)(made, (0, _dateFns.nextSunday)(parsedDate));
            }));

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](0);
            console.log('error getting votes:', _context2.t0);

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 13]]);
  }));

  return function getAllWeekVotes(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getAllWeekVotes = getAllWeekVotes;
//# sourceMappingURL=votes.js.map