


module.exports  = function() {
  var sequence = { ids:[] };

  process.argv.forEach(function (val, index, array) {
    regex = /(\w+)=(\d+)/.exec(val);
    if(regex != null && regex != undefined) {
      param = regex[1];
      value = parseInt(regex[2]);
      sequence[param] = value;
    }
  });

  while(sequence.ids.length <= sequence.to - sequence.from)
    sequence.ids.push(sequence.from + sequence.ids.length);

  return sequence;
};
