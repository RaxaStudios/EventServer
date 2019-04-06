const server = require('./server.js');
const dataChannel = require('./data-channel');


var array = new Array();
const Queue = require('better-queue');
/* create and initialize queue and function fu*/
function fu (json, cb) {
  // take in json
  // send to dataChannel
  dataChannel.publish(json);
  cb(null, json);
}
var q = new Queue(fu);
q.push('{"update":"Initial push test", "number":"3"}', function(err, result){
  console.log(err);
  console.log(result);
});
q.on('drain', function(){
  console.log('Drain complete');
});
setTimeout(function(){q.push('{"update":"Delayed push test", "number":"9"}', function(err, result){
  console.log(err);
  console.log(result);
    });
  }, 3000);

setInterval(function(){
  q.push(array.pop(), function(err, result){
    console.log(`result in interval: ${result}`);
    console.log(`array: ${array}`);
  });
}, 6000);


module.exports = {
  handleMessage: function(message){
    console.log(`message from client in handleMessage: ${message}`);
  },
  emitEvent: function(){
    myEmitter.emit('event', 'test string');
    return 'Sent Event';
  },
  emitYell: function(s1, s2){
    myEmitter.emit('yell', s1, s2);
  },
  array:array
};
