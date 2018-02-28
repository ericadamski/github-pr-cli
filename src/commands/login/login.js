const inquire = require("inquirer");
const { Observable } = require("rxjs/Observable");
require("rxjs/add/observable/fromPromise");
require("rxjs/add/observable/empty");
require("rxjs/add/observable/concat");
require("rxjs/add/operator/switchMap");
require("rxjs/add/operator/partition");
require("rxjs/add/operator/map");
require("rxjs/add/operator/do");

const { createAuthorization } = require("../github-helpers");
const { isAuthorized } = require("../../token/is-authorized");
const { writeToken } = require("../../token/helpers/helpers");
const TokenService = require("../../token/token-service");

/* https://developer.github.com/v3/auth/#working-with-two-factor-authentication */

module.exports = function login() {
  const userInput$ = Observable.fromPromise(
    inquire.prompt([
      {
        type: "input",
        name: "username",
        message: "Please enter your github username:"
      },
      {
        type: "password",
        name: "password",
        message: "Please enter your github password:"
      }
    ])
  ).zip(
    isAuthorized().map(content => {
      if (content && content.includes("{")) return JSON.parse(content);
    })
  );

  const [authorized$, needsAuthorization$] = userInput$.partition(
    ([{ username }, file]) => file && file.username === username
  );

  console.log(authorized$, needsAuthorization$);

  return Observable.concat(
    authorized$.map(([{ username }, { token }]) =>
      TokenService.set(token, username)
    ),
    needsAuthorization$
      .switchMap(([{ username, password }]) =>
        createAuthorization(username, password)
          .map(({ token }) => ({ token, username }))
          .catch(err => {
            err && console.error(err);

            return Observable.empty();
          })
      )
      .switchMap(({ token, username }) =>
        writeToken(JSON.stringify({ token, username })).mapTo({
          token,
          username
        })
      )
  ).map(({ token, username }) => TokenService.set(token, username));
};
