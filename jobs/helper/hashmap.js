
var HashMap = function() {
  this.hash = {};
}

HashMap.prototype.containsKey = function(key) {
  return this.hash.hasOwnProperty(value);
}

HashMap.prototype.put = function(key, value) {
  this.hash[key] = value;
}

module.exports = HashMap;
