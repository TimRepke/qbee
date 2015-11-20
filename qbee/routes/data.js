
var logger = require('../shared/logger');
var express = require('express');
var router = express.Router();

var openConnections = [];

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
    openConnections.push(res);
    logger.log('opened connection; now open: ' + openConnections.length);

    // When the request is closed, e.g. the browser window
    // is closed. We search through the open connections
    // array and remove this connection.
    req.on("close", function() {
        var toRemove;
        for (var j =0 ; j < openConnections.length ; j++) {
            if (openConnections[j] == res) {
                toRemove =j;
                break;
            }
        }
        openConnections.splice(j,1);
        logger.log('closed connection; still open: ' + openConnections.length);
    });
});

router.get('/status/playlist', function(req, res, next) {
    // req.query.start
    // req.query.end

    // responds with all tracks in that range
});

module.exports = router;