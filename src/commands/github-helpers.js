const fetch = require("node-fetch");

const { Observable } = require("rxjs/Observable");
require("rxjs/add/observable/fromPromise");
require("rxjs/add/operator/switchMap");
require("rxjs/add/operator/map");
require("rxjs/add/operator/do");

const { readToken } = require("../token/helpers/helpers");
const { GITHUB_API_URI } = require("../constants");

function getJSONFromResponse(source$) {
  return source$.switchMap(res => res.json());
}

module.exports.createAuthorization = function createAuthorization(
  username,
  password
) {
  return getJSONFromResponse(
    Observable.fromPromise(
      fetch(`${GITHUB_API_URI}/authorizations`, {
        method: "POST",
        body: JSON.stringify({
          scopes: ["repo"],
          note: "Review Pull Requests from your terminal"
        }),
        headers: createAuthorizationHeader(
          new Buffer(username + ":" + password).toString("base64"),
          "Bearer"
        )
      })
    )
  );
};

function createAuthorizationHeader(token, type = "token") {
  return {
    Authorization: `${type} ${token}`
  };
}

function breakdownUsernameAndToken() {
  return readToken().map(content => {
    if (!content)
      throw new Error("Please login to github by running the `login` command.");

    return JSON.parse(content);
  });
}

function listRepositories() {
  return breakdownUsernameAndToken().switchMap(({ username, token }) =>
    getJSONFromResponse(
      Observable.fromPromise(
        fetch(`${GITHUB_API_URI}/user/repos`, {
          headers: createAuthorizationHeader(token)
        })
      )
    )
      .switch()
      .map(({ id, name, full_name, description }) => ({
        id,
        name,
        full_name,
        description
      }))
  );
}

module.exports.listPullRequests = function listPullRequests(repo) {
  // list all repos if repo is `all`
  if (repo === "all")
    return listRepositories().do(({ full_name, description }) =>
      console.log(`${full_name}: ${description || ""}`)
    );
  // return Observable.fromPromise(fetch(`${GITHUB_API_URI}/repos`));
  return listRepositories();
};
