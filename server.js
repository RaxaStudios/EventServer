const express = require('express');
const mustacheExpress = require("mustache-express");
const dataChannel = require('./data-channel');
const bodyParser = require('body-parser');
const app = express();
const request = require('request');

const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

const eventHandler = require('./eventHandler');
const messageHandler = require('./messageHandler');

exports.app = app;

server.on('connection', socket => {
  socket.on('message', message => {
    console.log(`received message from client: ${message}`);
  //  messageHandler.handleMessage(message);
    //var json = JSON.stringify(message);
    var json = message;
    console.log(`json: ${json}`);
    dataChannel.publish(json);
    server.clients.forEach(client => {
      client.send(`message sent was:${message}`);
    })
  });
  socket.send('Connected to server at 8080');
});

app.engine('html', mustacheExpress());
app.use(express.static('public'));
//app.use(express.static('./static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.set('views', './views');


app.get('/api/events', function(req, res){
  initialiseSSE(req, res);
});

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        res.render('index', {weather: weatherText, error: null});
      }
    }
  });
});

function initialiseSSE(req, res) {
	dataChannel.subscribe(function(channel, message){
    console.log(`initialize message:  ${message}`);
		var messageEvent = new ServerEvent();
		messageEvent.addData(message);
		outputSSE(req, res, messageEvent.payload());
	});

	res.set({
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		"Connection": "keep-alive",
		"Access-Control-Allow-Origin": "*"
	});

	res.write("retry: 10000\n\n");
}

function outputSSE(req, res, data) {
	res.write(data);
}

function ServerEvent() {
	this.data = "";
};

ServerEvent.prototype.addData = function(data) {
	var lines = data.split(/\n/);

	for (var i = 0; i < lines.length; i++) {
		var element = lines[i];
		this.data += "data:" + element + "\n";
	}
}

ServerEvent.prototype.payload = function() {
	var payload = "";

	payload += this.data;
	return payload + "\n";
}

app.listen(8081, function () {
  console.log('Example app listening on port 3000!');
  console.log(`Hello text: ${eventHandler.hello()}`);
  console.log(`Making event: ${eventHandler.emitEvent()}`);
  eventHandler.emitYell("first", "second");
  eventHandler.redirect();
});
