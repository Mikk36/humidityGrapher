/**
 * Created by mikk on 16.06.2015.
 */
var util = require("util");
var MongoClient = require("mongodb").MongoClient;

class Mongo {
  constructor(app) {
    this.app = app;
    var self = this;
    MongoClient.connect(app.get("config").mongoDB, function(err, db) {
      util.log("MongoDB connected");
      self.db = db;
    });
  }

  exit() {
    this.db.close();
  }

  logHumidity(sensor, temperature, humidity) {
    var collection = this.db.collection("dataLog");
    var currentTime = new Date();
    var currentTimeMinute = new Date(new Date(currentTime).setSeconds(0, 0));
    var currentSecond = currentTime.getUTCSeconds();
    var setObject = {
      sensorID: sensor,
      time: currentTimeMinute
    };
    setObject["temperature." + currentSecond] = temperature;
    setObject["humidity." + currentSecond] = humidity;

    collection.update({
      sensorID: sensor,
      time: currentTimeMinute
    }, {
      $set: setObject,
      $inc: {
        entryCount: 1,
        temperatureSum: temperature,
        humiditySum: humidity
      }
    }, {
      upsert: true
    });
  }

  getHumidity(sensor, from, to) {

  }
}

module.exports = Mongo;
