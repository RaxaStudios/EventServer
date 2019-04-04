const server = require('./server.js');


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
  }
};
