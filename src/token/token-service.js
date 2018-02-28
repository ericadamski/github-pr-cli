const authorization = {};

module.exports.get = function get() {
  return Object.assign({}, authorization);
};

module.exports.set = function set(token, username) {
  authorization.token = token;
  authorization.username = username;
};
