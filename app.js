var http = require('http');
var WebSocketServer = require('ws').Server;
var express = require('express');
var bodyParser = require('body-parser');
var split = require('split');

var CLI_URL_RE = /^\/user\/([A-Za-z0-9_\-]+)$/;
var PORT = process.env.PORT || 3000;
var ORIGIN = process.env.ORIGIN || 'http://localhost:' + PORT;
var HEARTBEAT_INTERVAL = 30000;
var VERSION = 1;

var app = express();
var currSession = {
  id: null,
  domain: null
};
var cliClients = {};
var browserClients = [];

function handleBrowserClient(ws) {
  browserClients.push(ws);
  ws.on('message', function(data, flags) {
    if (flags.binary) return;
    console.log("MESSAGE", data);
  });
  ws.on('close', function() {
    var index = browserClients.indexOf(ws);
    if (index == -1) throw new Error('socket not in browserClients');
    browserClients.splice(index, 1);
  });
}

function handleCliClient(ws) {
  var user = ws.upgradeReq.url.match(CLI_URL_RE)[1];

  if (user in cliClients) {
    console.log(user, 'is already connected, denying connection attempt.');
    return ws.close();
  }

  cliClients[user] = ws;

  var interval = setInterval(function() {
    ws.send(JSON.stringify({
      version: VERSION,
      type: 'heartbeat'
    }));
  }, HEARTBEAT_INTERVAL);
  console.log(user, 'connected', ws.upgradeReq.headers);
  /*
  ws.send(JSON.stringify({
    version: VERSION,
    hostname: 'google.com',
    postURL: ORIGIN + '/trace/google.com'
  }));*/
  ws.on('close', function() {
    delete cliClients[user];
    console.log(user, 'disconnected');
    clearInterval(interval);
  });
}

app.use(express.static(__dirname + '/static'));
app.post('/trace', bodyParser.urlencoded({
  extended: false
}), function(req, res, next) {
  console.log('trace request received');
  currSession.id = Date.now();
  currSession.domain = req.body.domain;
  console.log(currSession);
  Object.keys(cliClients).forEach(function(user) {
    cliClients[user].send(JSON.stringify({
      version: VERSION,
      hostname: currSession.domain,
      postURL: ORIGIN + '/trace/' + user + '/' + currSession.id
    }));
  });
  return res.redirect('/');
});
app.post('/trace/:user/:id', function(req, res, next) {
  var id = parseInt(req.param('id'));
  var user = req.param('user');
  console.log(req.headers);
  req.pipe(split()).on('data', function(line) {
    if (id != currSession.id) return;
    browserClients.forEach(function(ws) {
      ws.send(JSON.stringify({
        user: user,
        id: id,
        domain: currSession.domain,
        content: line
      }));
    });
    console.log("LINE", line);
  });
  req.on('end', function() {
    console.log('done');
    return res.send('thanks buddy');
  });
});

var server = http.createServer(app);
server.listen(PORT, function() {
  console.log('listening at', ORIGIN);
});

var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
  var url = ws.upgradeReq.url;
  if (CLI_URL_RE.test(url))
    return handleCliClient(ws);
  if (url == '/')
    return handleBrowserClient(ws);
  ws.close();
});
