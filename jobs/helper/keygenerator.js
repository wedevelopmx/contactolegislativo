
module.exports  = function() {
  this.hash = {};
  this.hashRecord = [];

  this.nextKey = function() {
    return Object.keys(this.hash).length + 1;
  }

  this.generateKey = function(value) {

    if(!this.hash.hasOwnProperty(value)) {
      this.loadPair(value, this.nextKey());
    }

    return this.hash[value];
  }

  this.loadPair  = function(value, key) {
    this.hash[value] = key;
    this.hashRecord.push({ value: value, key: key});
  }

  this.generateKeyForTerm = function(term, split) {
    key = 1;
    names = term.split(split);
    for(i in names) {
      key *= this.generateKey(names[i].trim());
    }
    return key;
  }

};
