/**
 * Created by mikk on 15.06.2015.
 */
var express = require('express');
var router = express.Router();

/* GET log */
router.get('/', function (req, res) {
  var from = new Date();
  from.setHours(from.getHours() - 1);
  var to = new Date();
  req.app.get("mongo").getHumidityPromise(0, from, to).then(function (data) {
    res.send(data);
  });
  //res.send(req.app.get("humidity").getData());
});

router.get("/minuteAverageWeek", function (req, res) {
  var from = new Date();
  from.setDate(from.getDate() - 7);
  var to = new Date();
  req.app.get("mongo").getHumidityPromise(0, from, to).then(function (data) {
    var output = [];
    data.forEach(function (element) {
      output.push([
        element.time,
        element.sensorID,
        element.temperatureSum / element.entryCount,
        element.humiditySum / element.entryCount
      ]);
    });
    res.send(output);
  });
});

module.exports = router;
