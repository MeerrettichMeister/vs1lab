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
     * @type {string | undefined}
     */
    #tag;

    /**
     *
     * @param {string} tagName
     * @param {number} lat
     * @param {number} long
     * @param {string} [tag]
     */
    constructor(tagName, lat, long, tag) {
        this.#tagName = tagName;
        this.#lat = lat;
        this.#long = long;
        this.#tag = tag;
    }

    /**
     * @returns {string}
     */
    get tagName() {
        return this.#tagName;
    }

    /**
     * @returns {number}
     */
    get lat() {
        return this.#lat;
    }

    /**
     * @returns {number}
     */
    get long() {
        return this.#long;
    }

    /**
     * @returns {string}
     */
    get tag() {
        return this.#tag;
    }

    /**
     * Serialization fn
     * @returns {string}
     */
    toJSON() {
        return {
            tagName: this.#tagName,
            lat: this.#lat,
            long: this.#long,
            tag: this.#tag ?? null,
        };
    }
}

module.exports = GeoTag;
