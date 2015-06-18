/**
 * Created by mikk on 16.06.2015.
 */
var util = require("util");
var MongoClient = require("mongodb").MongoClient;

class Mongo {
  constructor(app) {
    this.app = app;
    var self = this;
    MongoClient.connect(app.get("config").mongoDB, function (err, db) {
      if (err) {
        util.log("Error: " + err.message);
        return;
      }
      util.log("MongoDB connected");
      self.db = db;
      self.createDatabaseListeners();
    });
  }

  createDatabaseListeners() {
    this.db.on("error", function () {
      util.log("Database error");
    });
    this.db.on("reconnect", function () {
      util.log("Database reconnect");
    });
    this.db.on("timeout", function () {
      util.log("Database timeout");
    });
    this.db.on("close", function () {
      util.log("Database close");
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

    //noinspection JSDeprecatedSymbols,JSCheckFunctionSignatures
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

  getHumidityPromise(sensor, from, to, detailed) {
    var self = this;
    return new Promise(function (resolve, reject) {
      var collection = self.db.collection("dataLog");
      var projection = null;
      if (!detailed) {
        projection = {sensorID: 1, time: 1, entryCount: 1, temperatureSum: 1, humiditySum: 1};
      }
      collection.find({
        sensorID: sensor,
        time: {
          $gte: from,
          $lte: to
        }
      }, projection).sort({
        time: 1
      }).toArray(function (err, documents) {
        if (err) {
          reject(err);
        } else {
          resolve(documents);
        }
      });
    });
  }
}

module.exports = Mongo;
