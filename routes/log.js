/**
 * Created by mikk on 15.06.2015.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(req.app.get("humidity").getData());
});

module.exports = router;
