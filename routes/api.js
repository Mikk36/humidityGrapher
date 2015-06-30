/**
 * Created by mikk on 15.06.2015.
 */
var express = require('express');
var router = express.Router();
var util = require("util");

router.get('/reportData', function (req, res) {
  if (req.query.id !== undefined) {
    //util.log(req.query.id + ": " + req.query.temperature + " | " + req.query.humidity + " | " + req.query.dewpoint);
    var id = parseInt(req.query.id, 10);
    var temperature = parseFloat(req.query.temperature);
    var humidity = parseFloat(req.query.humidity);
    req.app.get("mongo").logHumidity(id, temperature, humidity);
  } else {
    util.log("No Data");
  }
  res.end();
});

module.exports = router;
