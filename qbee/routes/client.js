
var logger = require('../shared/logger');
var eventHandler = require('../server/event-handler');
var queueManager = require('../server/queue-manager');
var express = require('express');
var router = express.Router();


function generateResponse(params) {
  if (params.status) {
    return {
      successful: true,
      track: params.track || '[unknown]'
    };
  } else {
    return {
      successful: false,
      query: params.query,
      error: params.error || '[unknown error]'
    };
  }
}

router.get('/add/soundcloud', function(req, res, next) {
  res.send(generateResponse({
    error: 'adding soundcloud currently not supported'
  }));
});

router.get('/add/youtube', function(req, res, next) {
  res.send(generateResponse({
    error: 'adding youtube currently not supported'
  }));
});

router.get('/add/spotify', function(req, res, next) {
  logger.log('kasjdkljas');
  res.send(generateResponse({
    error: 'adding spotify currently not supported'
  }));
});

router.get('/add/local', function(req, res, next) {
  res.send(generateResponse({
    error: 'adding local currently not supported'
  }));
});

router.post('/add/external', function(req, res, next) {
  res.send(generateResponse({
    error: 'adding uploaded files currently not supported'
  }));
});

router.get('/connect', function(req, res, next) {
  // inspired by http://www.smartjava.org/content/html5-server-sent-events-angularjs-nodejs-and-expressjs
  // set timeout as high as possible
  req.socket.setTimeout(Infinity);

  // send headers for event-stream connection
  // see spec for more information
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n');

  // push this res object to our global variable
  eventHandler.addClient(res);

  // When the request is closed, e.g. the browser window
  // is closed. We search through the open connections
  // array and remove this connection.
  req.on("close", function() {
    eventHandler.removeClient(res);
  });
});

router.get('/status/playlist', function(req, res, next) {
  // req.query.start
  // req.query.end

  // responds with all tracks in that range
});

module.exports = router;