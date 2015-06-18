var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', {title: 'Express'});
});

router.get("/week", function (req, res) {
  var from = new Date();
  from.setDate(from.getDate() - 7);
  var to = new Date();
  req.app.get("mongo").getHumidityPromise(0, from, to).then(function (data) {
    //var options = {
    //  title: "Temperature and humidity over the past week",
    //  width: 900,
    //  height: 500,
    //  series: {
    //    0: {axis: "Temperature"},
    //    1: {axis: "Humidity"}
    //  },
    //  axes: {
    //    y: {
    //      Temperature: {label: "Temperature C&deg;"},
    //      Humidity: {label: "Humidity %"}
    //    }
    //  }
    //};
    //var columns = [
    //  {
    //    label: "Time",
    //    type: "string"
    //  },
    //  {
    //    label: "Average temperature per minute",
    //    type: "number"
    //  },
    //  {
    //    label: "Average humidity per minute",
    //    type: "number"
    //  }
    //];
    var rows = [];
    data.forEach(function (element) {
      //var dateString = "Date("
      //  + element.time.getFullYear() + ", "
      //  + element.time.getMonth() + ", "
      //  + element.time.getDay() + ", "
      //  + element.time.getHours() + ", "
      //  + element.time.getMinutes() + ", 0)";
      rows.push({
        time: element.time,
        temperature: element.temperatureSum / element.entryCount,
        humidity: element.humiditySum / element.entryCount
      });
    });
    res.render("week", {
      title: "1 week (1 minute average)",
      data: JSON.stringify(rows)
      //cols: JSON.stringify(columns),
      //options: JSON.stringify(options)
    });
  });
});

module.exports = router;
