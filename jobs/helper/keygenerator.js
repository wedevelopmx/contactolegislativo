
module.exports  = function() {
  this.hash = {};
  this.hashRecord = [];

  this.normalize = function(r) {
    // var r = s.toLowerCase();
    r = r.replace(new RegExp(/[àáâãäå]/g),"a");
    r = r.replace(new RegExp(/[èéêë]/g),"e");
    r = r.replace(new RegExp(/[ìíîï]/g),"i");
    r = r.replace(new RegExp(/[òóôõö]/g),"o");
    r = r.replace(new RegExp(/[ùúûü]/g),"u");
    return r;
  }

  this.nextKey = function() {
    return Object.keys(this.hash).length + 1;
  }

  this.generateKey = function(value) {
    value = this.normalize(value.toLowerCase());
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
    names = term.replace(/  +/g, ' ').split(split);
    for(i in names) {
      key *= this.generateKey(names[i].trim());
    }
    return key;
  }

};
