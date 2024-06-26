// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore.
 * It represents geotags.
 *
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore.
 * It provides an in-memory store for geotag objects.
 *
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

const tagStore = new GeoTagStore();

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests carry no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
    res.render('index', {
            taglist: [],
            lat: undefined,
            lon: undefined
        }
    )
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags
 * by radius around a given location.
 */

router.post('/tagging', (req, res) => {
    // sanitization? validation? what's that
    const lat = +req.body.latitude;
    const lon = +req.body.longitude;

    tagStore.addGeoTag(
        req.body.name,
        lat,
        lon,
        req.body.hashtag
    );

    res.render('index', {
        taglist: tagStore.getNearbyGeoTags(lat, lon, 25),
        lat,
        lon
    })
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain
 * the term as a part of their names or hashtags.
 * To this end, "GeoTagStore" provides methods to search geotags
 * by radius and keyword.
 */

router.post('/discovery', (req, res) => {
    // sanitization? validation? what's that
    const lat = +req.body.latitude;
    const lon = +req.body.longitude;

    console.log(lat, lon, tagStore.searchNearbyGeoTags(lat, lon, 25, req.body.search));

    res.render('index', {
        taglist: tagStore.searchNearbyGeoTags(lat, lon, 25, req.body.search),
        lat,
        lon
    })
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

router.get('/api/geotags', (req, res) => {
    let resBody;

    if (req.query.latitude == null || req.query.longitude == null) {
        res.status(422);
        res.send();
    }

    const lat = +req.query.latitude;
    const lon = +req.query.longitude;
    const rad = req.query.rad !== undefined ? +req.query.rad : 25;

    console.log(req.query.search);

    if (req.query.search) {
        resBody = tagStore.searchNearbyGeoTags(lat, lon, rad, req.query.search);
    } else {
        resBody = tagStore.getNearbyGeoTags(lat, lon, rad);
    }

    res.send(resBody);
})

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post('/api/geotags', (req, res) => {

    tagStore.addGeoTag(req.body['tagName'], req.body['lat'], req.body['long'], req.body['tag']);
    let resBody = tagStore.findByName(req.body['tagName']);
    res.location(`/api/geotags/${req.body['tagName']}`);
    res.status(201);
    res.send(resBody);
})

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

router.get('/api/geotags/:id', (req, res) => {
    res.send(tagStore.findByName(req.params.id));
})

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response.
 */

router.put('/api/geotags/:id', (req, res) => {
    const resBody = tagStore.updateTag(req.params.id, req.body);
    res.send(resBody);
})

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete('/api/geotags/:id', (req, res) => {
    const resBody = tagStore.findByName(req.params.id);
    tagStore.removeGeoTag(req.params.id);
    res.send(resBody);
})
module.exports = router;
