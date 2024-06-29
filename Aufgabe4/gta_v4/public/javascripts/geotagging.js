// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");


/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...

/**
 * Set location coordinates
 * @param {string} lat
 * @param {string} long
 */
function setLocation(lat, long) {
    document.getElementById('latitude').setAttribute('value', lat);
    document.getElementById('latitude_hidden').setAttribute('value', lat);
    document.getElementById('longitude').setAttribute('value', long);
    document.getElementById('longitude_hidden').setAttribute('value', long);
    document.getElementById('discovery_lat').setAttribute('value', lat);
    document.getElementById('discovery_long').setAttribute('value', long);
    document.getElementById('mapView').remove();
    const map = new MapManager();
    map.initMap(+lat, +long);
    let tagList = JSON.parse(document.getElementById('map').getAttribute("data-tags"));
    map.updateMarkers(+lat, +long, tagList.map(({tagName, lat, long}) => ({
        name: tagName,
        // function args typing is wrong! location is missing
        location: {
            latitude: lat,
            longitude: long
        },
    })));
}

/**
 * Load coordinates from geolocator or previous state
 */
async function updateLocation() {
    // skip geolocation if previous location is known
    const previousLat = document.getElementById("latitude")?.value;
    const previousLong = document.getElementById("longitude")?.value;

    if (previousLat == null || previousLat.length === 0 || previousLong == null || previousLong.value === 0) {
        LocationHelper.findLocation((e) => {
            setLocation(e.latitude, e.longitude);
            searchTags();
        });
    } else {
        setLocation(previousLat, previousLong);
        searchTags();
    }
}

const formatTag = (tag) => {
    return `${tag.tagName} (${tag.lat}, ${tag.long})${tag ? ` ${tag.tag}` : ''}`;
}

async function searchTags() {
    /**
     * @type { HTMLInputElement | undefined }
     */
    const searchTerm = document.getElementById("disc_word_search")?.value;

    const lat = document.getElementById("latitude")?.value;
    const lon = document.getElementById("longitude")?.value;

    const response = await fetch(`/api/geotags?${new URLSearchParams({
        latitude: lat,
        longitude: lon,
        /* rad: 25, */
        search: searchTerm
    }).toString()}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    });
    /**
     * @type {{ tagName: string; lat: number; long: number; tag:  string | null}[]}
     */
    const json = await response.json();

    /**
     * @type {HTMLDivElement}
     */
    const tagList = document.getElementById("discoveryResults");
    tagList.innerHTML = '';

    for (const tag of json) {
        const el = document.createElement("li");
        el.innerHTML = formatTag(tag);
        tagList.appendChild(el);
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("tag-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(document.getElementById("tag-form"));
        // any less bad way?
        let data = {};
        for (const [key, value] of formData) {
            data[key] = value;
        }

        const response = await fetch("/api/geotags", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        // do something?
        const json = await response.json();
        const tagList = document.getElementById("discoveryResults");
        const el = document.createElement("li");
        el.innerHTML = formatTag(json);
        tagList.appendChild(el);
    });

    document.getElementById("discoveryFilterForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        searchTags();
    });

    updateLocation();
});
