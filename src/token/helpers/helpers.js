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

const { ROOT_DIR, TOKEN_LOCATION } = require("./constants");

function writeTokenToFile(source$, token) {
  return source$.switchMap(() => writeFile(TOKEN_LOCATION, token)).mapTo(token);
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

function readToken() {}

function removeToken() {}

function doesTokenDirectoryExist() {
  return access(ROOT_DIR)
    .mapTo(true)
    .catch(err => {
      if (process.env.NODE_ENV === "test") console.error(err);

      return err && Observable.of(false);
    });
}

module.exports = {
  writeToken,
  readToken,
  removeToken,
  doesTokenDirectoryExist
};
