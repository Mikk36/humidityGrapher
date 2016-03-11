/**
 * Created by mikk on 12.06.2015.
 */
var util = require("util");
//var SerialPort = require("serialport").SerialPort;

class Humidity {
  constructor(app) {
    this.app = app;
    this.mongo = this.app.get("mongo");

    var self = this;
    var serial = require("serialport");
    serial.list(function(err, ports) {
      self.createSerial(err, ports);
    });
  }

  logData(temperature, relativeHumidity) {
    this.mongo.logHumidity(0, temperature, relativeHumidity);
  }

  createSerial(err, ports) {
    if (err) {
      util.log(err.message);
      util.log(err.stack);
      return;
    }
    var serialList = [];
    ports.forEach(function (port) {
      util.log(port.comName + ", " + port.pnpId + ", " + port.manufacturer);
      serialList.push(port.comName);
    });

    if (serialList.length == 0) {
      util.log("No serial ports found");
      return;
    }
    if (serialList.length > 1) {
      util.log("Multiple serial ports found, using first in the list");
    }
    this.serialPort = new SerialPort(serialList[0]);

    var self = this;
    this.serialPort.on("open", function() {
      util.log("Port opened");
      self.onSerialOpen();
    });
  }

  onSerialOpen() {
    var self = this;
    this.serialPort.on("data", function(data) {
      var dataString = data.toString().trim();
      var dataSplit = dataString.split(" | ");
      var temperature = parseFloat(dataSplit[0]);
      var relativeHumidity = parseFloat(dataSplit[1]);
      self.logData(temperature, relativeHumidity);
    });
  }
}

module.exports = Humidity;
