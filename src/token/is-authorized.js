const { readToken } = require("./helpers/helpers");

function isAuthorized() {
  return readToken();
}

module.exports = {
  isAuthorized
};
