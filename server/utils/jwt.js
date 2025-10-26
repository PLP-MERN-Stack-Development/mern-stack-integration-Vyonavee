const jwt = require('jsonwebtoken');
function sign(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
}
function verify(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
module.exports = { sign, verify };
