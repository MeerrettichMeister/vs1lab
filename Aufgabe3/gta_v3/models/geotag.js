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

    // TODO: ... your code here ...

    tagName;
    lat;
    long;
    tag;


    constructor(tagName, lat, long, tag) {
        this.tagName = tagName;
        this.lat = lat;
        this.long = long;
        this.tag = tag;
    }
}

module.exports = GeoTag;
