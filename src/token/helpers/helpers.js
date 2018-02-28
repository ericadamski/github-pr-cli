const { EOL } = require("os");
const fs = require("fs");
const { Observable } = require("rxjs/Observable");
require("rxjs/add/observable/bindNodeCallback");
require("rxjs/add/observable/concat");
require("rxjs/add/operator/mapTo");
require("rxjs/add/operator/switchMap");
require("rxjs/add/operator/partition");

const access = Observable.bindNodeCallback(fs.access);
const mkdir = Observable.bindNodeCallback(fs.mkdir);
const writeFile = Observable.bindNodeCallback(fs.writeFile);
const readFile = Observable.bindNodeCallback(fs.readFile);
const unlink = Observable.bindNodeCallback(fs.unlink);

const { ROOT_DIR, TOKEN_LOCATION } = require("../../constants");

function writeTokenToFile(source$, token) {
  return source$
    .switchMap(() => writeFile(TOKEN_LOCATION, `${token}${EOL}`))
    .mapTo(token);
}

function writeToken(token) {
  const [hasDirectory$, noDirectory$] = doesTokenDirectoryExist().partition(
    value => value
  );

  return Observable.concat(
    writeTokenToFile(noDirectory$.switchMap(() => mkdir(ROOT_DIR)), token),
    writeTokenToFile(hasDirectory$, token)
  );
}

function readToken() {
  return readFile(TOKEN_LOCATION, { encoding: "utf8" }).catch(
    err => err && Observable.of(false)
  );
}

function removeToken() {
  return access(TOKEN_LOCATION)
    .catch(err => err && Observable.of(undefined))
    .switchMap(() => unlink(TOKEN_LOCATION));
}

function doesTokenDirectoryExist() {
  return access(ROOT_DIR)
    .mapTo(true)
    .catch(err => err && Observable.of(false));
}

module.exports = {
  writeToken,
  readToken,
  removeToken,
  doesTokenDirectoryExist
};
