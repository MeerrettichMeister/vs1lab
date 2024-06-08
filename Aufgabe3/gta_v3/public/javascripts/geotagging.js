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
    document.getElementById('longitude').setAttribute('value', long);
    document.getElementById('discovery_lat').setAttribute('value', lat);
    document.getElementById('discovery_long').setAttribute('value', long);
    const mapElement = document.createElement('div');
    mapElement.setAttribute("id", "map");
    document.getElementById('mapView').nextElementSibling.remove();
    document.getElementById('mapView').replaceWith(mapElement);
    const map = new MapManager();
    map.initMap(lat, long);
    const taglistHTML = document.getElementById('discoveryResults').getElementsByTagName('li');
    let tagList = Array();
    for (let i = 0; i < taglistHTML.length; i++) {
        const body = taglistHTML.item(i).innerText.replace(',', '').split(/\s/);
        const [name, latString, longString, hashtag] = body;
        const tag = {
            location: {
                latitude: latString.replace(/[()']+/g, ''),
                longitude: longString.replace(/[()']+/g, '')
            },
            name: name
        };
        tagList.push(tag);
    }
    map.updateMarkers(lat, long, tagList);

    history.replaceState(null, "",
        "?" + new URLSearchParams({
            lat: lat,
            lon: long
        }).toString()
    );
}

/**
 * Load coordinates from geolocator or previous state
 */
function updateLocation(lat, lon) {
    // skip geolocation if previous location is known
    const previousLat = document.getElementById("latitude")?.value;
    const previousLong = document.getElementById("longitude")?.value;

    if (previousLat == null || previousLat.length === 0 || previousLong == null || previousLong.value === 0) {
        LocationHelper.findLocation((e) => setLocation(e.latitude, e.longitude));
    } else {
        setLocation(previousLat, previousLong);
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});
