"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require('dotenv').config();

var _process$env = process.env,
    APP_CREDENTIALS_TYPE = _process$env.APP_CREDENTIALS_TYPE,
    APP_CREDENTIALS_PROJECT_ID = _process$env.APP_CREDENTIALS_PROJECT_ID,
    APP_CREDENTIALS_PRIVATE_KEY_ID = _process$env.APP_CREDENTIALS_PRIVATE_KEY_ID,
    APP_CREDENTIALS_PRIVATE_KEY = _process$env.APP_CREDENTIALS_PRIVATE_KEY,
    APP_CREDENTIALS_CLIENT_EMAIL = _process$env.APP_CREDENTIALS_CLIENT_EMAIL,
    APP_CREDENTIALS_CLIENT_ID = _process$env.APP_CREDENTIALS_CLIENT_ID,
    APP_CREDENTIALS_AUTH_URI = _process$env.APP_CREDENTIALS_AUTH_URI,
    APP_CREDENTIALS_TOKEN_URI = _process$env.APP_CREDENTIALS_TOKEN_URI,
    APP_CREDENTIALS_AUTH_PROVIDER = _process$env.APP_CREDENTIALS_AUTH_PROVIDER,
    APP_CREDENTIALS_CLIENT_CERT_URL = _process$env.APP_CREDENTIALS_CLIENT_CERT_URL;
var GOOGLE_CREDENTIALS = {
  type: APP_CREDENTIALS_TYPE,
  project_id: APP_CREDENTIALS_PROJECT_ID,
  private_key_id: APP_CREDENTIALS_PRIVATE_KEY_ID,
  private_key: APP_CREDENTIALS_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: APP_CREDENTIALS_CLIENT_EMAIL,
  client_id: APP_CREDENTIALS_CLIENT_ID,
  auth_uri: APP_CREDENTIALS_AUTH_URI,
  token_uri: APP_CREDENTIALS_TOKEN_URI,
  auth_provider_x509_cert_url: APP_CREDENTIALS_AUTH_PROVIDER,
  client_x509_cert_url: APP_CREDENTIALS_CLIENT_CERT_URL
};
var _default = GOOGLE_CREDENTIALS;
exports["default"] = _default;
//# sourceMappingURL=google_credentials.js.map