// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

const GeoTagExamples = require("./geotag-examples");
const GeoTag = require("./geotag");

/**
 * A class for in-memory-storage of geotags
 *
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 *
 * Provide a method 'addGeoTag' to add a geotag to the store.
 *
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 *
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 *
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields.
 */
class InMemoryGeoTagStore {
    /**
     * @type {GeoTag[]}
     */
    #tagList = GeoTagExamples.tagList.map(([name, lat, long, hashtag]) => new GeoTag(name, lat, long, hashtag));

    constructor() {
    }

    /**
     * Add new geotag
     * @param {string} name
     * @param {number} lat
     * @param {number} long
     * @param {string} [tag]
     */
    addGeoTag(name, lat, long, tag) {
        this.#tagList.push(new GeoTag(name, lat, long, tag));
    }

    /**
     * Remove tag by name
     * @param {string} name
     */
    removeGeoTag(name) {
        const el = this.#tagList.findIndex(el => el.tagName === name);
        if (el) {
            this.#tagList.splice(el, 1);
        }
    }


    updateTag(name, content) {
        let entryId = this.#tagList.findIndex(el => el.tagName === name);
        this.#tagList[entryId] = content;
        return this.#tagList[entryId];
    }

    findByName(name) {
        return this.#tagList.find(el => el.tagName === name)
    }


    /**
     * @param {number} degrees
     */
    #degreesToRadian(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Calculate distance from two points using Haversine formula
     *
     * Based on https://stackoverflow.com/a/27943
     *
     * @param {number} pointA.lat
     * @param {number} pointA.lon
     * @param {number} pointB.lat
     * @param {number} pointB.lon
     */
    #distance(pointA, pointB) {
        // Radius of the earth in km
        const earthRadius = 6371;
        const dLat = this.#degreesToRadian(pointB.lat - pointA.lat);
        const dLon = this.#degreesToRadian(pointB.lon - pointA.lon);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.#degreesToRadian(pointA.lat)) * Math.cos(this.#degreesToRadian(pointB.lat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        // Distance in km
        return earthRadius * c;
    }

    /**
     * Find geotags near point
     *
     * @param {number} lat
     * @param {number} long
     * @param {number} radius
     * @returns {GeoTag[]}
     */
    getNearbyGeoTags(lat, long, radius) {
        return this.#tagList.filter((el) =>
            this.#distance({lat, lon: long}, {lat: +el.lat, lon: +el.long}) <= radius
        );
    }

    /**
     * Search geotags near point
     *
     * @param {number} lat
     * @param {number} long
     * @param {number} radius
     * @param {string} searchTerm
     * @returns {GeoTag[]}
     */
    searchNearbyGeoTags(lat, long, radius, searchTerm) {
        return this.getNearbyGeoTags(lat, long, radius).filter(
            (el) => (el.tagName.includes(searchTerm) || el.tag.includes(searchTerm))
        );
    }
}

module.exports = InMemoryGeoTagStore;
