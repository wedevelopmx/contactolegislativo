
var HashMap = function() {
  this.hash = {};
}

HashMap.prototype.containsKey = function(key) {
  return this.hash.hasOwnProperty(key);
}

HashMap.prototype.put = function(key, value) {
  this.hash[key] = value;
}

HashMap.prototype.get = function(key) {
  return this.hash[key];
}

module.exports = HashMap;
