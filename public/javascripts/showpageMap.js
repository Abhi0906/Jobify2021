mapboxgl.accessToken = 'pk.eyJ1IjoiYWJoaXNoZWswOTA2IiwiYSI6ImNrdnFuc21wMzI0dzkyeG91cnF6NWVmbmEifQ.-jJ9Lm1_y8aGgvpm0ff6LA';
job = JSON.parse(job)
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: job.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(job.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${job.title}</h3><p>${job.location}</p>`
            )
    )
    .addTo(map)