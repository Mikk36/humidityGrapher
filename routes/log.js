/**
 * Created by mikk on 15.06.2015.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  var from = new Date();
  from.setHours(from.getHours() - 1);
  var to = new Date();
  req.app.get("mongo").getHumidityPromise(0, from, to).then(function (data) {
    res.send(data);
  });
});

router.get('/current', function (req, res) {
  var minutes = 3;
  var from = new Date();
  from.setMinutes(from.getMinutes() - minutes);
  var to = new Date();
  req.app.get("mongo").getHumidityPromise(0, from, to).then(function (data) {
    console.log(JSON.stringify(data));
    var sums = {temp: 0, humidity: 0};
    data.forEach(function (element) {
      sums.temp += element.temperatureSum / element.entryCount / data.length;
      sums.humidity += element.humiditySum / element.entryCount / data.length;
    });
    res.send(sums);
  });
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
