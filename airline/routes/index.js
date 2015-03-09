
/*
 * GET home page.
 */
var FlightSchema = require('../schemas/flight');

 module.exports = function(flights) {

    var flight = require('../flight');

    for (var number in flights) {
      flights[number] = flight.create(flights[number])
    }

    console.log(flights);
    var functions = {};

    functions.flight = function(req, res){
      var number = req.param('number');
      if (typeof flights[number] == 'undefined') {
        res.status(404).json({status: 'error'});
      } else {
        res.json(flights[number].getInformation());
      }
    };

    functions.arrived = function (req, res) {
      var number = req.param('number');

      if (typeof flights[number] === 'undefined') {
        res.status(404).json({status: 'error'});
      } else {
        flights[number].triggerArrive();

        var record = new FlightSchema(
          flights[number].getInformation()
        );

        record.save(function(err) {
          if (err) {
            console.log(err);
            //res.status(500).json({status: 'failure'});
          } else {
            console.log('success');
            //res.json({status: 'success'});
          }
        });

        res.json({status: 'done'});
      }
    };

    functions.list = function(req, res) {
      res.render('list', {
        name: 'all flights',
        flights: flights
      });
    };

    functions.arrivals = function(req, res) {
      FlightSchema.find()
      .setOptions({sort: 'actualArrive'})
      .exec(function(err, arrivals) {
        if (err) {
          console.log(err);
          res.status(500).json({status: 'failure'});
        } else {
          res.render('arrivals', { 
            title: 'Arrivals',
            arrivals: arrivals
          })
        }
      });
    };

    functions.listjson = function (req, res) {
      var flightData = [];

      for (var number in flights) {
        flightData.push(flights[number].getInformation());
      }

      res.json(flightData);
    };

    return functions;

 };

