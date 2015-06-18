var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('index', {title: 'Express'});
});

router.get("/week", function (req, res) {
  var from = new Date();
  from.setDate(from.getDate() - 7);
  var to = new Date();
  req.app.get("mongo").getHumidityPromise(0, from, to).then(function (data) {
    var rows = [];
    var smoothing = {
      count: 0,
      temperature: 0,
      humidity: 0
    };
    data.forEach(function (element, index, array) {
      smoothing.count++;
      smoothing.temperature += element.temperatureSum / element.entryCount;
      smoothing.humidity += element.humiditySum / element.entryCount;
      if (element.time.getMinutes() % 10 === 0 || index === array.length - 1) {
        rows.push({
          time: element.time,
          temperature: smoothing.temperature / smoothing.count,
          humidity: smoothing.humidity / smoothing.count
        });
        smoothing.count = 0;
        smoothing.temperature = 0;
        smoothing.humidity = 0;
      }
    });
    res.render("week", {
      title: "1 week (10 minute average)",
      data: JSON.stringify(rows)
    });
  });
});

module.exports = router;
