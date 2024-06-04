// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

const {tagList} = require("./geotag-examples");
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

    // TODO: ... your code here ...

    #tagList;

    constructor() {
        tagList().forEach((el) => {
            this.addGeoTag(el[0], el[1], el[2], el[3]);
        })
    }

    addGeoTag(name, lat, long, tag) {
        this.#tagList.push(new GeoTag(name, lat, long, tag));
    }

    removeGeoTag(name) {
        this.#tagList.splice(this.#tagList.indexOf(this.#tagList.reduce((el) => el.name === name)), 1);
    }

    getNearbyGeoTags(lat, long, radius){
        return this.#tagList.filter((el) => {
            return (Math.sqrt(Math.pow((lat - el.lat),2) + Math.pow((long - el.long),2)) <= radius);
        })
    }

    searchNearbyGeoTags(lat, long, radius, seatchTerm){
        return this.getNearbyGeoTags(lat,long,radius).filter((el) => {
            return (el.name.contains(seatchTerm) || el.tag.contains(seatchTerm))
        })
    }
}

module.exports = InMemoryGeoTagStore
