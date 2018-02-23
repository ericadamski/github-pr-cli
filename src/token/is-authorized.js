const fs = require("fs");
const path = require("path");
const { homedir } = require("os");

const { Observable } = require("rxjs/Observable");
require("rxjs/add/observable/bindNodeCallback");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/do");

const access = Observable.bindNodeCallback(fs.access);

const ROOT_DIR = path.join(homedir(), ".githubprcli");

const TOKEN_LOCATION = path.join(ROOT_DIR, ".github-token");

function isAuthorized() {
  return access(ROOT_DIR)
    .switchMap(() => access(TOKEN_LOCATION))
    .catch(err => err && Observable.of(undefined))
    .do(console.log);
}

module.exports = {
  isAuthorized,
  ROOT_DIR,
  TOKEN_LOCATION
};
