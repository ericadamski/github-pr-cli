const { listPullRequests } = require("../github-helpers");

module.exports = function list(repo) {
  return listPullRequests(repo);
};
