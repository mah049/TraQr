var express = require('express');
var twilio = require('twilio');
var accountSid = 'AC673fa27e32d2aea308f77bd9b020aede'; // Your Account SID from www.twilio.com/console
var authToken = '5a340b4559a11cf9d02be8bf693d5d14';   // Your Auth Token from www.twilio.com/console
var ClientCapability = require('twilio').jwt.ClientCapability;
var client = new twilio(accountSid, authToken);
var APP_SID = 'AP54d42c0ec3efc56d94be31d3db74b957';
var app = express();
var port = process.env.PORT || 3000;
var obj = require("./data.json");
const VoiceResponse = require('twilio').twiml.VoiceResponse;

var fs = require('fs');
var fileName = './data.json';
var file = require(fileName);



fs.writeFile("./data.json", JSON.stringify(file), function (err) {
  if (err) return console.log(err);
  console.log(JSON.stringify(file));
  console.log('writing to ' + fileName);
});


//location var
var location = ''

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 

const response = new VoiceResponse();
const dial = response.dial();

app.listen(port,function(){
	console.log('Listening on port',port);
});

app.get('/', function(req, res){
  res.send('This is the landing page.');
});


app.get('/token', (req, res) => { 
  const capability = new ClientCapability({
    accountSid: accountSid,
    authToken: authToken
  });
  capability.addScope(
    new ClientCapability.OutgoingClientScope({ applicationSid: APP_SID })
  );
  capability.addScope(
    new ClientCapability.IncomingClientScope('jenny')
  );
  const token = capability.toJwt();
  res.set('Content-Type', 'application/jwt');
  res.send(token);
});

app.get('/call', (req, res) => { 
  res.write("hello");
  console.log('REQUEST: ')
  console.log(req)
  client.calls.create({
    url: 'http://demo.twilio.com/docs/voice.xml',
    to: '+18583229224',  
    from: '+16159300006'
  })
  .then((call) => process.stdout.write(call.sid));
});

app.post('/call', function(req, res) {
    var user_id = req.body.user_id;
    var phone = req.body.phone;
    var geo = req.body.geo;
    client.calls.create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to: phone.toString(),  
      from: '+16159300006'
    })
    .then((call) => process.stdout.write(call.sid));

    res.write(user_id + ' ' + phone + ' ' + geo);
});

app.post('/sms', function(req, res) {
    var phone = req.body.phone;
    location = req.body.haha;
    client.messages.create({
      body: haha.toString(),
      to: phone.toString(),  // Text this number
      from: '+16159300006' // From a valid Twilio number
    }).then((message) => console.log(message.sid));
    res.write(phone);
});

app.post('/insms', (req, res) => {
  var hello = req.body.Body;
  if( hello == 'find'){
    client.messages.create({
      body: location,
      to: req.body.From,  
      from: '+16159300006' 
    }).then((message) => console.log(message.sid));
  }
  else{
      client.messages.create({
      body: "Text find to track your device",
      to: req.body.From,  
      from: '+16159300006' 
    }).then((message) => console.log(message.sid));
  }
  res.set('Content-Type', 'text/xml');
  res.send(xml("../xml/response.xml"));
});