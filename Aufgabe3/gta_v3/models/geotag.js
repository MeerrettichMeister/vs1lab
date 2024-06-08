// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** *
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {
    /**
     * @type {string}
     */
    #tagName;
    /**
     * @type {number}
     */
    #lat;
    /**
     * @type {number}
     */
    #long;
    /**
     * @type {string}
     */
    #tag;

    /**
     *
     * @param {string} tagName
     * @param {number} lat
     * @param {number} long
     * @param {string} tag
     */
    constructor(tagName, lat, long, tag) {
        this.#tagName = tagName;
        this.#lat = lat;
        this.#long = long;
        this.#tag = tag;
    }

    get tagName() {
        return this.#tagName;
    }

    get lat() {
        return this.#lat;
    }

    get long() {
        return this.#long;
    }

    get tag() {
        return this.#tag;
    }
}

module.exports = GeoTag;
