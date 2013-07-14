var express = require('express');

var fs = require('fs');

var messageBuffer;

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send(message.toString());
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
  message = fs.readFileSync("index.html");
});