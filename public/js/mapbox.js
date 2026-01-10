
mapboxgl.accessToken = mapToken;

// MAP FEATURES
const map = new mapboxgl.Map({
    container: "map",
    style: 'mapbox://styles/mapbox/standard',
    zoom: 15.27,
    pitch: 42,
    bearing: -50,
    center: [coordinates[0], coordinates[1]]
});

// DOM MANIPULATION 
const el = document.createElement("div");
el.id = "marker";
el.style.backgroundImage = `url(${image})`; 


// POPUP
const popup = new mapboxgl.Popup()
    .setHTML(`<h3>${title}</h3>`);

// MARKER
const marker = new mapboxgl.Marker(el, {
    color: '#FF0000', // set marker color
    scale: 2       // scale the marker size
})
    .setLngLat(coordinates)
    .addTo(map)
    .setPopup(popup);

// MAP CONTROLS
map.addControl(new mapboxgl.NavigationControl());






