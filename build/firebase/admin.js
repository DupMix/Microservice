"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.auth = void 0;

var admin = _interopRequireWildcard(require("firebase-admin"));

var _storage = require("@google-cloud/storage");

var _google_credentials = _interopRequireDefault(require("../google_credentials"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

require('dotenv').config();

var _process$env = process.env,
    FIRE_DATABASE_URL = _process$env.FIRE_DATABASE_URL,
    FIRE_PROJECT_ID = _process$env.FIRE_PROJECT_ID,
    GOOGLE_APPLICATION_CREDENTIALS = _process$env.GOOGLE_APPLICATION_CREDENTIALS; // const storage = new Storage({ FIRE_PROJECT_ID, GOOGLE_APPLICATION_CREDENTIALS })

admin.initializeApp({
  credential: admin.credential.cert(_google_credentials["default"]),
  databaseURL: FIRE_DATABASE_URL
});
var auth = admin.auth();
exports.auth = auth;
var _default = admin;
exports["default"] = _default;
//# sourceMappingURL=admin.js.map