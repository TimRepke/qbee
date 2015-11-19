var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/push/megasound', function(req, res, next) {
  res.send({
    added: 'megasound'
  });
});

router.get('/stats/', function(req, res, next) {
  res.send({
    connections: {
      count: 42,
      ips: ['141.22.20.1', '141.22.20.2']
    }
  });
});
module.exports = router;
