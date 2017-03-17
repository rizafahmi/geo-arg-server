const models = require('../models')

module.exports = {
  getLocations: (req, res) => {
    models.Locations.findAll().then(function (data) {
      res.send(data)
    }).catch(function (err) {
      res.send(err)
    })
  },
  getLocation: (req, res) => {
    models.Locations.findById(req.params.id).then(function (data) {
    models.Locations.findAll({
      attributes: [
        sequelize.fn('ST_DWithin',
        sequelize.literal('the_geom'),
        sequelize.literal(`ST_Point(${data.geolocation.coordinates[0]}, ${data.geolocation.coordinates[1]})::geography`),
        1000)]
    }).then(function(filter) {
      res.send(filter)
    })
    }).catch(function (err) {
      res.send(err)
    })
  },
  createLocation: (req, res) => {
    var point = {
      type: 'Point',
      coordinates: [+req.body.longitude, +req.body.latitude],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    };
    models.Locations.create({
      geolocation: point,
      userId: req.body.userId
    }).then(function (data) {
      res.send(data)
    }).catch(function (err) {
      res.send(err)
    })
  },
  deleteLocation: (req, res) => {
    models.Locations.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (data) {
      if(data.length === 0) {
        res.status(200).json({message: `Deleted location with ID: ${req.params.id}`})
      }
      else {
        res.send(`There is no location with such ID`)
      }
    }).catch(function (err) {
      res.send(err)
    })
  },
  updateLocation: (req, res) => {
    var point = {
      type: 'Point',
      coordinates: [+req.body.longitude, +req.body.latitude],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    };
    models.Locations.findById(req.params.id).then(function (location) {
      location.update({
        geolocation: point
      }).then(function (data) {
        res.send(data)
      }).catch(function (err) {
        res.send(err)
      })
    })
  }
}
