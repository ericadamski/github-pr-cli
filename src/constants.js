const path = require("path");
const { homedir } = require("os");

const ROOT_DIR = path.join(homedir(), ".githubprcli");
const TOKEN_LOCATION = path.join(ROOT_DIR, ".github-token");
const GITHUB_API_URI = "https://api.github.com";

module.exports = {
  ROOT_DIR,
  TOKEN_LOCATION,
  GITHUB_API_URI
};
