const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', (s) => {
  console.log(`an event occurred! Msg: + ${s}`);
});
myEmitter.on('yell', (s1, s2) =>{
  console.log(`yelling ${s1} and ${s2}`);
});
myEmitter.on('redirect', () => {
console.log("redirect reached");
});
myEmitter.emit('event', "s");

module.exports = {
  hello: function(){
    return 'Hello';
  },
  emitEvent: function(){
    myEmitter.emit('event', 'test string');
    return 'Sent Event';
  },
  emitYell: function(s1, s2){
    myEmitter.emit('yell', s1, s2);
  },
  redirect: function() {
    myEmitter.emit('redirect');
  }
};
