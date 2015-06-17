/**
 * Created by mikk on 15.06.2015.
 */
var express = require('express');
var router = express.Router();

/* GET log */
router.get('/', function (req, res, next) {
  var fromDate = new Date();
  fromDate.setHours(fromDate.getHours() - 1);
  var from = new Date(fromDate);
  var to = new Date();
  req.app.get("mongo").getHumidityPromise(0, from, to).then(function (data) {
    res.send(data);
  });
  //res.send(req.app.get("humidity").getData());
});

module.exports = router;
