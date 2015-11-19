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
      error: params.error || '[unknown error'
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
  // wie im artikel
});

router.get('/status/playlist', function(req, res, next) {
  // req.query.start
  // req.query.end

  // responds with all tracks in that range
})

module.exports = router;